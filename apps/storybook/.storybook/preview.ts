import type { Preview } from "@storybook/react-vite";

/**
 * Storybook Preview Configuration
 *
 * Configures:
 * - React 19 components
 * - Tailwind CSS 4 with design tokens
 * - Global parameters and decorators
 * - WCAG 2.1 AA accessibility testing
 */

// Import global styles (includes Tailwind CSS + design tokens)
import "@calendar-ticker/design-system/styles";

const preview: Preview = {
	// Global parameters
	parameters: {
		// Controls for interactive component properties
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},

		// Docs configuration
		docs: {
			source: {
				type: "dynamic",
				excludeDecorators: true,
			},
			story: {
				height: "120px",
			},
		},

		// Accessibility checker configuration
		a11y: {
			config: {
				rules: [
					{
						id: "color-contrast",
						enabled: true,
					},
					{
						id: "valid-aria-role",
						enabled: true,
					},
				],
			},
		},

		// Layout configuration
		layout: "centered",
	},

	// Tags for organization
	tags: ["autodocs"],
};

export default preview;
