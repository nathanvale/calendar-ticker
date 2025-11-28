/**
 * Design Token System - TypeScript Exports
 *
 * Nine News Branding - Based on official Nine for Brands guidelines
 * and 2024 Agenda Studio rebrand.
 *
 * Two-tier architecture:
 * - Tier 1: Primitives (raw values) - DO NOT use directly in components
 * - Tier 2: Semantics (purpose-driven) - USE these in components
 *
 * All values are also available as CSS custom properties via globals.css
 */

/* ========================================
   TIER 1: PRIMITIVE TOKENS
   ======================================== */

/**
 * Color Primitives - Nine News Brand
 *
 * Primary: #00beff (vibrant cyan-blue) - Official Nine for Brands
 * Alternative: #0518c5 (deep blue) - Used in broadcast graphics, can swap if preferred
 */
export const colorNine = {
	/** Official Nine brand blue - vibrant cyan */
	nineBlue: "#00beff",
	/** Deep broadcast blue - alternative, more traditional news look */
	nineBlueDark: "#0518c5",
	/** Pure black - OLED optimised */
	nineBlack: "#000000",
	/** Pure white - text on dark backgrounds */
	nineWhite: "#ffffff",
} as const;

/**
 * Color Primitives - Gray Scale (for subtle UI elements)
 */
export const colorGrays = {
	gray25: "#fcfcfd",
	gray50: "#f8fafc",
	gray100: "#eeeeee",
	gray200: "#e7ebef",
	gray250: "#e5e5e5",
	gray300: "#d1d5db",
	gray400: "#9aa4b2",
	gray500: "#787675",
	gray600: "#4b5563",
	gray700: "#374151",
	gray800: "#232323",
	gray900: "#111827",
} as const;

/**
 * Color Primitives - Status/Utility Colors
 */
export const colorUtility = {
	green500: "#10b981",
	green600: "#059669",
	red500: "#ef4444",
	red600: "#dc2626",
	yellow500: "#f59e0b",
	yellow600: "#d97706",
	orange500: "#f97316",
	orange600: "#ea580c",
} as const;

/**
 * Spacing Primitives - 8px base unit (broadcast standard)
 */
export const spacing = {
	space0: "0",
	space1: "0.25rem", // 4px
	space2: "0.5rem", // 8px - base unit
	space3: "0.75rem", // 12px
	space4: "1rem", // 16px
	space5: "1.25rem", // 20px
	space6: "1.5rem", // 24px - ticker padding
	space8: "2rem", // 32px
	space10: "2.5rem", // 40px
	space12: "3rem", // 48px - TV safe margin
	space16: "4rem", // 64px - event gap
} as const;

/**
 * Border Radius Primitives
 */
export const radius = {
	none: "0",
	sm: "0.25rem", // 4px
	md: "0.375rem", // 6px
	lg: "0.5rem", // 8px
	xl: "0.75rem", // 12px
	"2xl": "1rem", // 16px
	full: "9999px",
} as const;

/**
 * Typography Primitives - TV/Broadcast optimised
 *
 * Font: Montserrat (fallback for Proxima Nova)
 * Weights available: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold), 900 (Black)
 */
export const typography = {
	// Size scale
	xs: "0.75rem", // 12px
	sm: "0.875rem", // 14px
	base: "1rem", // 16px
	lg: "1.125rem", // 18px
	xl: "1.25rem", // 20px
	"2xl": "1.5rem", // 24px
	"3xl": "1.875rem", // 30px
	"4xl": "2.25rem", // 36px
	"5xl": "2.625rem", // 42px - ticker text
	"6xl": "3rem", // 48px - ticker large
	"7xl": "4rem", // 64px - clock
} as const;

/**
 * Font Weight Primitives
 */
export const fontWeights = {
	light: "300",
	regular: "400",
	medium: "500",
	bold: "700",
	black: "900",
} as const;

/**
 * Line Height Primitives - broadcast readability
 */
export const lineHeights = {
	tight: "1.1", // Headlines
	snug: "1.25", // Subheadings
	normal: "1.4", // Body text, ticker
	relaxed: "1.5", // Long-form
} as const;

/**
 * Letter Spacing Primitives
 */
export const letterSpacing = {
	tighter: "-0.05em",
	tight: "-0.025em",
	normal: "0",
	wide: "0.025em",
	wider: "0.05em",
} as const;

/**
 * Shadow Primitives (4 values)
 */
export const shadows = {
	sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
	md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
	lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
	xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
} as const;

/* ========================================
   TIER 2: SEMANTIC TOKENS
   Nine News Design System
   ======================================== */

/**
 * Semantic Brand Colors - Nine News
 */
export const brandColors = {
	/** Primary brand - Nine Blue #00beff */
	primary: "var(--color-brand-primary)",
	/** Hover state for primary */
	primaryHover: "var(--color-brand-primary-hover)",
	/** Deep blue accent - alternative broadcast look */
	accent: "var(--color-brand-accent)",
	accentHover: "var(--color-brand-accent-hover)",
} as const;

/**
 * Semantic Text Colors - optimised for OLED/dark backgrounds
 */
export const textColors = {
	/** Primary text - white on dark */
	primary: "var(--color-text-primary)",
	/** Secondary text - slightly dimmed */
	secondary: "var(--color-text-secondary)",
	/** Muted text - subtle info */
	muted: "var(--color-text-muted)",
	/** Brand-coloured text */
	brand: "var(--color-text-brand)",
} as const;

/**
 * Semantic Background Colors - OLED optimised
 */
export const bgColors = {
	/** App background - pure black for OLED */
	app: "var(--color-bg-app)",
	/** Ticker bar background */
	ticker: "var(--color-bg-ticker)",
	/** Subtle surface - slight transparency */
	surface: "var(--color-bg-surface)",
	/** Overlay for modals */
	overlay: "var(--color-bg-overlay)",
} as const;

/**
 * Semantic Status Colors
 */
export const statusColors = {
	success: "var(--color-status-success)",
	error: "var(--color-status-error)",
	warning: "var(--color-status-warning)",
	info: "var(--color-status-info)",
} as const;

/**
 * Semantic Border Colors
 */
export const borderColors = {
	/** Default border - subtle on dark */
	default: "var(--color-border-default)",
	/** Strong border - more visible */
	strong: "var(--color-border-strong)",
	/** Brand-coloured border */
	brand: "var(--color-border-brand)",
} as const;

/**
 * Calendar Event Colors - for colour-coding different calendars
 */
export const eventColors = {
	default: "var(--color-event-default)",
	meeting: "var(--color-event-meeting)",
	reminder: "var(--color-event-reminder)",
	task: "var(--color-event-task)",
	birthday: "var(--color-event-birthday)",
	important: "var(--color-event-important)",
} as const;

/**
 * Ticker Component Tokens - Nine News style
 */
export const tickerTokens = {
	/** Ticker bar height */
	height: "var(--ticker-height)",
	/** Padding inside ticker */
	padding: "var(--ticker-padding)",
	/** Gap between events */
	eventGap: "var(--ticker-event-gap)",
	/** Ticker background */
	bg: "var(--ticker-bg)",
	/** Border on ticker */
	border: "var(--ticker-border)",
	/** Event title text size */
	titleSize: "var(--ticker-title-size)",
	/** Event time text size */
	timeSize: "var(--ticker-time-size)",
	/** Clock display size */
	clockSize: "var(--ticker-clock-size)",
	/** Scroll speed (px/s) */
	scrollSpeed: "var(--ticker-scroll-speed)",
	/** Calendar indicator width */
	indicatorWidth: "var(--ticker-indicator-width)",
	/** Calendar indicator height */
	indicatorHeight: "var(--ticker-indicator-height)",
} as const;

/**
 * Card Component Tokens
 */
export const cardTokens = {
	padding: "var(--space-card-padding)",
	gap: "var(--space-card-gap)",
	radius: "var(--radius-card)",
	shadow: "var(--color-card-shadow)",
	bg: "var(--color-card-bg)",
	border: "var(--color-card-border)",
	hover: "var(--color-card-hover)",
} as const;

/**
 * Button Component Tokens
 */
export const buttonTokens = {
	paddingX: "var(--space-button-padding-x)",
	paddingY: "var(--space-button-padding-y)",
	radius: "var(--radius-button)",
} as const;

/* ========================================
   TYPE EXPORTS
   ======================================== */

export type ColorNine = typeof colorNine;
export type ColorGrays = typeof colorGrays;
export type ColorUtility = typeof colorUtility;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Typography = typeof typography;
export type FontWeights = typeof fontWeights;
export type LineHeights = typeof lineHeights;
export type LetterSpacing = typeof letterSpacing;
export type Shadows = typeof shadows;
export type BrandColors = typeof brandColors;
export type TextColors = typeof textColors;
export type BgColors = typeof bgColors;
export type StatusColors = typeof statusColors;
export type BorderColors = typeof borderColors;
export type EventColors = typeof eventColors;
export type TickerTokens = typeof tickerTokens;
export type CardTokens = typeof cardTokens;
export type ButtonTokens = typeof buttonTokens;

/* ========================================
   TOKEN GROUPS (for TokenShowcase)
   ======================================== */

export interface TokenDefinition {
	name: string;
	cssVar: string;
	value: string;
	category: "primitive" | "semantic";
	usage: string;
}

export interface TokenGroup {
	title: string;
	tokens: TokenDefinition[];
}

/**
 * All primitive color tokens for documentation - Nine News Brand
 */
export const primitiveColorTokens: TokenDefinition[] = [
	// Nine News Brand
	{
		name: "Nine Blue",
		cssVar: "--color-nine-blue",
		value: "#00beff",
		category: "primitive",
		usage: "Official Nine brand blue - vibrant cyan",
	},
	{
		name: "Nine Blue Dark",
		cssVar: "--color-nine-blue-dark",
		value: "#0518c5",
		category: "primitive",
		usage: "Deep broadcast blue - alternative look",
	},
	{
		name: "Nine Black",
		cssVar: "--color-nine-black",
		value: "#000000",
		category: "primitive",
		usage: "Pure black - OLED optimised background",
	},
	{
		name: "Nine White",
		cssVar: "--color-nine-white",
		value: "#ffffff",
		category: "primitive",
		usage: "Pure white - text on dark backgrounds",
	},
	// Grays (for subtle UI)
	{
		name: "Gray 500",
		cssVar: "--color-gray-500",
		value: "#787675",
		category: "primitive",
		usage: "Muted text on dark",
	},
	{
		name: "Gray 600",
		cssVar: "--color-gray-600",
		value: "#4b5563",
		category: "primitive",
		usage: "Secondary text on dark",
	},
	{
		name: "Gray 800",
		cssVar: "--color-gray-800",
		value: "#232323",
		category: "primitive",
		usage: "Subtle dark surface",
	},
	// Status/Utility
	{
		name: "Green 500",
		cssVar: "--color-green-500",
		value: "#10b981",
		category: "primitive",
		usage: "Success / Connected status",
	},
	{
		name: "Red 500",
		cssVar: "--color-red-500",
		value: "#ef4444",
		category: "primitive",
		usage: "Error / Disconnected status",
	},
	{
		name: "Yellow 500",
		cssVar: "--color-yellow-500",
		value: "#f59e0b",
		category: "primitive",
		usage: "Warning / Important events",
	},
	{
		name: "Orange 500",
		cssVar: "--color-orange-500",
		value: "#f97316",
		category: "primitive",
		usage: "Birthday events",
	},
];

/**
 * All semantic color tokens for documentation - Nine News
 */
export const semanticColorTokens: TokenDefinition[] = [
	// Brand
	{
		name: "Brand Primary",
		cssVar: "--color-brand-primary",
		value: "var(--color-nine-blue)",
		category: "semantic",
		usage: "Nine Blue - primary brand colour",
	},
	{
		name: "Brand Accent",
		cssVar: "--color-brand-accent",
		value: "var(--color-nine-blue-dark)",
		category: "semantic",
		usage: "Deep blue - alternative broadcast look",
	},
	// Text (dark theme - OLED)
	{
		name: "Text Primary",
		cssVar: "--color-text-primary",
		value: "var(--color-nine-white)",
		category: "semantic",
		usage: "White text on dark backgrounds",
	},
	{
		name: "Text Secondary",
		cssVar: "--color-text-secondary",
		value: "rgba(255, 255, 255, 0.7)",
		category: "semantic",
		usage: "Slightly dimmed text",
	},
	{
		name: "Text Muted",
		cssVar: "--color-text-muted",
		value: "rgba(255, 255, 255, 0.5)",
		category: "semantic",
		usage: "Subtle/muted text",
	},
	{
		name: "Text Brand",
		cssVar: "--color-text-brand",
		value: "var(--color-nine-blue)",
		category: "semantic",
		usage: "Brand-coloured text",
	},
	// Background (OLED optimised)
	{
		name: "Background App",
		cssVar: "--color-bg-app",
		value: "var(--color-nine-black)",
		category: "semantic",
		usage: "Pure black - OLED background",
	},
	{
		name: "Background Ticker",
		cssVar: "--color-bg-ticker",
		value: "rgba(0, 0, 0, 0.85)",
		category: "semantic",
		usage: "Ticker bar background",
	},
	{
		name: "Background Surface",
		cssVar: "--color-bg-surface",
		value: "rgba(255, 255, 255, 0.05)",
		category: "semantic",
		usage: "Subtle surface on dark",
	},
	// Status
	{
		name: "Status Success",
		cssVar: "--color-status-success",
		value: "var(--color-green-500)",
		category: "semantic",
		usage: "Connected / success",
	},
	{
		name: "Status Error",
		cssVar: "--color-status-error",
		value: "var(--color-red-500)",
		category: "semantic",
		usage: "Disconnected / error",
	},
	{
		name: "Status Warning",
		cssVar: "--color-status-warning",
		value: "var(--color-yellow-500)",
		category: "semantic",
		usage: "Important events",
	},
];

/**
 * Spacing tokens for documentation
 */
export const spacingTokens: TokenDefinition[] = [
	{
		name: "Space 0",
		cssVar: "--space-0",
		value: "0",
		category: "primitive",
		usage: "No spacing",
	},
	{
		name: "Space 1",
		cssVar: "--space-1",
		value: "0.25rem (4px)",
		category: "primitive",
		usage: "Tight spacing",
	},
	{
		name: "Space 2",
		cssVar: "--space-2",
		value: "0.5rem (8px)",
		category: "primitive",
		usage: "Small spacing",
	},
	{
		name: "Space 4",
		cssVar: "--space-4",
		value: "1rem (16px)",
		category: "primitive",
		usage: "Base spacing",
	},
	{
		name: "Space 6",
		cssVar: "--space-6",
		value: "1.5rem (24px)",
		category: "primitive",
		usage: "Medium spacing",
	},
	{
		name: "Space 8",
		cssVar: "--space-8",
		value: "2rem (32px)",
		category: "primitive",
		usage: "Large spacing",
	},
	{
		name: "Space 16",
		cssVar: "--space-16",
		value: "4rem (64px)",
		category: "primitive",
		usage: "Extra large spacing",
	},
];

/**
 * Typography tokens for documentation - TV/Broadcast optimised
 */
export const typographyTokens: TokenDefinition[] = [
	{
		name: "Font Size XS",
		cssVar: "--font-size-xs",
		value: "0.75rem (12px)",
		category: "primitive",
		usage: "Extra small text",
	},
	{
		name: "Font Size SM",
		cssVar: "--font-size-sm",
		value: "0.875rem (14px)",
		category: "primitive",
		usage: "Small text",
	},
	{
		name: "Font Size Base",
		cssVar: "--font-size-base",
		value: "1rem (16px)",
		category: "primitive",
		usage: "Base text",
	},
	{
		name: "Font Size LG",
		cssVar: "--font-size-lg",
		value: "1.125rem (18px)",
		category: "primitive",
		usage: "Large text",
	},
	{
		name: "Font Size XL",
		cssVar: "--font-size-xl",
		value: "1.25rem (20px)",
		category: "primitive",
		usage: "Extra large text",
	},
	{
		name: "Font Size 2XL",
		cssVar: "--font-size-2xl",
		value: "1.5rem (24px)",
		category: "primitive",
		usage: "Heading text",
	},
	{
		name: "Font Size 3XL",
		cssVar: "--font-size-3xl",
		value: "1.875rem (30px)",
		category: "primitive",
		usage: "Large heading",
	},
	{
		name: "Font Size 4XL",
		cssVar: "--font-size-4xl",
		value: "2.25rem (36px)",
		category: "primitive",
		usage: "Event time display",
	},
	{
		name: "Font Size 5XL",
		cssVar: "--font-size-5xl",
		value: "2.625rem (42px)",
		category: "primitive",
		usage: "Ticker event title",
	},
	{
		name: "Font Size 6XL",
		cssVar: "--font-size-6xl",
		value: "3rem (48px)",
		category: "primitive",
		usage: "Large ticker text",
	},
	{
		name: "Font Size 7XL",
		cssVar: "--font-size-7xl",
		value: "4rem (64px)",
		category: "primitive",
		usage: "Clock display",
	},
];

/**
 * All token groups for TokenShowcase component
 */
export const allTokenGroups: TokenGroup[] = [
	{ title: "Tier 1: Primitive Colors", tokens: primitiveColorTokens },
	{ title: "Tier 2: Semantic Colors", tokens: semanticColorTokens },
	{ title: "Spacing", tokens: spacingTokens },
	{ title: "Typography", tokens: typographyTokens },
];
