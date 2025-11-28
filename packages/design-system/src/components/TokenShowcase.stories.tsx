import type { Meta, StoryObj } from "@storybook/react";
import {
	allTokenGroups,
	primitiveColorTokens,
	semanticColorTokens,
	spacingTokens,
	typographyTokens,
} from "../tokens";
import { TokenShowcase } from "./TokenShowcase";

/**
 * Design Tokens: Two-Tier System
 *
 * This project uses a two-tier design token system with Tailwind CSS 4:
 * - **Tier 1 (Primitives)**: Raw values (colors, spacing, fonts) - DO NOT use directly
 * - **Tier 2 (Semantics)**: Purpose-driven tokens that reference primitives - USE these
 *
 * This approach enables easy theme switching and consistent design language.
 *
 * ## Architecture
 *
 * ```
 * globals.css (@theme) → CSS Variables → TypeScript Exports
 *                      ↓
 *           TokenShowcase (reads live values)
 * ```
 *
 * ## Usage in Components
 *
 * ```tsx
 * // ✅ Good: Use semantic tokens
 * <div className="bg-[var(--color-bg-card)] text-[var(--color-text-primary)]">
 *
 * // ❌ Bad: Don't use primitives directly
 * <div className="bg-[var(--color-gray-100)] text-[var(--color-navy-900)]">
 * ```
 */
const meta = {
	title: "Design System/Tokens/Overview",
	component: TokenShowcase,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Visual documentation of the 2-tier design token system. Values are read live from CSS custom properties, ensuring documentation stays in sync with implementation.",
			},
		},
	},
} satisfies Meta<typeof TokenShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * All Design Tokens
 *
 * Complete overview of all design tokens used in Calendar Ticker.
 * This includes primitives, semantics, spacing, and typography.
 */
export const AllTokens: Story = {
	args: {
		groups: allTokenGroups,
	},
};

/**
 * Primitive Colors
 *
 * Tier 1: Raw color values. These are the building blocks.
 * **Do not use directly in components** - use semantic tokens instead.
 */
export const PrimitiveColors: Story = {
	args: {
		groups: [
			{ title: "Tier 1: Primitive Colors", tokens: primitiveColorTokens },
		],
	},
};

/**
 * Semantic Colors
 *
 * Tier 2: Purpose-driven colors that reference primitives.
 * **Use these in components** for consistent theming.
 */
export const SemanticColors: Story = {
	args: {
		groups: [{ title: "Tier 2: Semantic Colors", tokens: semanticColorTokens }],
	},
};

/**
 * Spacing Scale
 *
 * Consistent spacing values from 0 to 4rem (64px).
 * Use these for padding, margin, and gaps.
 */
export const Spacing: Story = {
	args: {
		groups: [{ title: "Spacing Scale", tokens: spacingTokens }],
	},
};

/**
 * Typography Scale
 *
 * Font size scale from xs (12px) to 3xl (30px).
 * Use these for consistent text sizing.
 */
export const Typography: Story = {
	args: {
		groups: [{ title: "Typography Scale", tokens: typographyTokens }],
	},
};

/**
 * Colors Only
 *
 * Combined view of both primitive and semantic colors.
 */
export const ColorsOnly: Story = {
	args: {
		groups: [
			{ title: "Tier 1: Primitive Colors", tokens: primitiveColorTokens },
			{ title: "Tier 2: Semantic Colors", tokens: semanticColorTokens },
		],
	},
};
