import type { StorybookConfig } from "@storybook/react-vite";
import type { UserConfig } from "vite";

/**
 * Storybook Main Configuration
 *
 * Configures Storybook to work with:
 * - React 19 + Vite builder
 * - Bun workspaces (@calendar-ticker/design-system)
 * - Tailwind CSS 4 with design tokens
 * - Accessibility testing
 */
const config: StorybookConfig = {
	// Story locations - design-system stories + local stories
	stories: [
		"../../../packages/design-system/src/**/*.stories.@(ts|tsx)",
		"../stories/**/*.stories.@(ts|tsx)",
	],

	// Static files to include in build
	staticDirs: ["../public"],

	// TypeScript support
	typescript: {
		check: true,
	},

	// Addons configuration
	addons: [
		"@storybook/addon-essentials",
		"@storybook/addon-a11y",
		"@storybook/addon-docs",
	],

	// Vite builder for React 19
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},

	// Vite configuration customization
	async viteFinal(config: UserConfig) {
		// Add path alias support
		if (!config.resolve) {
			config.resolve = {};
		}

		if (!config.resolve.alias) {
			config.resolve.alias = {};
		}

		// Map imports to design-system
		config.resolve.alias = {
			...config.resolve.alias,
			"@calendar-ticker/design-system/styles": new URL(
				"../../../packages/design-system/src/styles/globals.css",
				import.meta.url,
			).pathname,
			"@calendar-ticker/design-system": new URL(
				"../../../packages/design-system/src",
				import.meta.url,
			).pathname,
		};

		// Configure CSS processing (Tailwind CSS 4 support)
		if (!config.css) {
			config.css = {};
		}

		config.css.postcss = new URL(
			"../postcss.config.cjs",
			import.meta.url,
		).pathname;

		return config;
	},

	// Core options
	core: {
		disableTelemetry: true,
	},
};

export default config;
