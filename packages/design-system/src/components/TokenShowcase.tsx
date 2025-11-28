/**
 * TokenShowcase Component
 *
 * Visual documentation component for the design token system.
 * Renders color swatches, spacing demos, radius previews, and typography samples.
 *
 * Reads live CSS variable values from the document root and resolves
 * nested variable references (semantic tokens pointing to primitives).
 */

import { useEffect, useState } from "react";
import type { TokenDefinition, TokenGroup } from "../tokens";

/**
 * Token with resolved CSS value
 */
export interface ResolvedToken extends TokenDefinition {
	value: string;
}

/**
 * Group of resolved tokens
 */
export interface ResolvedTokenGroup {
	title: string;
	tokens: ResolvedToken[];
}

/**
 * Props for TokenShowcase component
 */
export interface TokenShowcaseProps {
	/** Token groups to display */
	groups: TokenGroup[];
	/** Optional className for custom styling */
	className?: string;
}

/**
 * Determines if a token represents a color value
 */
export function isColorToken(name: string, value?: string): boolean {
	return (
		name.includes("color") &&
		!name.includes("font") &&
		value !== undefined &&
		(value.startsWith("#") || value.startsWith("rgb") || value.includes("var("))
	);
}

/**
 * Determines if a token represents spacing
 */
export function isSpacingToken(name: string): boolean {
	return name.includes("space");
}

/**
 * Determines if a token represents border radius
 */
export function isRadiusToken(name: string): boolean {
	return name.includes("radius");
}

/**
 * Determines if a token represents font size
 */
export function isFontSizeToken(name: string): boolean {
	return name.includes("font-size");
}

/**
 * Recursively resolves CSS variable references to their final values.
 * Handles cases where a variable references another variable (semantic tokens).
 * Prevents infinite loops with circular references.
 */
function resolveCSSVariable(
	varValue: string,
	visited: Set<string> = new Set(),
): string {
	if (!varValue) return varValue;

	// Check if the value is a CSS variable reference like "var(--color-orange-500)"
	const varMatch = varValue.match(/var\((--[\w-]+)\)/);
	if (!varMatch?.[1]) return varValue;

	const referencedVar = varMatch[1];

	// Prevent infinite loops on circular references
	if (visited.has(referencedVar)) return varValue;

	// Mark this variable as visited
	visited.add(referencedVar);

	const rootStyles = getComputedStyle(document.documentElement);
	const propValue = rootStyles.getPropertyValue(referencedVar);
	const rawValue = propValue ? propValue.trim() : "";

	// Recursively resolve in case it references another var
	if (rawValue && rawValue !== varValue) {
		return resolveCSSVariable(rawValue, visited);
	}

	return varValue;
}

/**
 * Resolves token values from live CSS variables.
 *
 * Tailwind CSS 4 @theme directive creates CSS variables at runtime.
 * This function reads the actual computed values from the document root,
 * with recursive resolution for semantic tokens that reference primitives.
 */
export function resolveTokenValues(groups: TokenGroup[]): ResolvedTokenGroup[] {
	const rootStyles = getComputedStyle(document.documentElement);

	return groups.map((group) => ({
		title: group.title,
		tokens: group.tokens.map((token) => {
			// Extract CSS variable name from cssVar (e.g., "--color-gray-100")
			const cssVarName = token.cssVar;

			// Get the CSS variable value
			let cssValue = rootStyles.getPropertyValue(cssVarName).trim();

			// Resolve any nested variable references (e.g., var(--color-orange-500))
			cssValue = resolveCSSVariable(cssValue);

			// Fallback order:
			// 1. Live CSS variable value (preferred - from @theme directive)
			// 2. Hardcoded value in token definition (fallback if CSS not loaded yet)
			const value = cssValue.length > 0 ? cssValue : token.value;

			return {
				...token,
				value,
			};
		}),
	}));
}

/**
 * Color swatch component for color tokens
 */
function ColorSwatch({ value }: { value: string }) {
	return (
		<div
			className="h-16 rounded-md mb-3 border-2 border-[var(--color-border-default)] shadow-sm"
			style={{ backgroundColor: value }}
		/>
	);
}

/**
 * Spacing demo component for spacing tokens
 */
function SpacingDemo({ value }: { value: string }) {
	return (
		<div className="h-16 mb-3 flex items-center gap-2">
			<div
				className="bg-[var(--color-brand-primary)] flex-shrink-0"
				style={{ width: value, height: "12px" }}
			/>
			<span className="text-xs text-[var(--color-text-secondary)]">
				{value}
			</span>
		</div>
	);
}

/**
 * Border radius demo component for radius tokens
 */
function RadiusDemo({ value }: { value: string }) {
	return (
		<div className="h-16 mb-3 flex items-center gap-3">
			<div
				className="bg-[var(--color-brand-primary)]"
				style={{ width: "60px", height: "60px", borderRadius: value }}
			/>
		</div>
	);
}

/**
 * Font size demo component for typography tokens
 */
function FontSizeDemo({ value }: { value: string }) {
	return (
		<div className="mb-3 p-2 bg-[var(--color-bg-surface)] rounded">
			<p
				style={{ fontSize: value }}
				className="font-semibold text-[var(--color-text-primary)]"
			>
				Aa
			</p>
		</div>
	);
}

/**
 * Category badge component
 */
function CategoryBadge({ category }: { category: "primitive" | "semantic" }) {
	const badgeClass =
		category === "primitive"
			? "bg-blue-100 text-blue-700"
			: "bg-purple-100 text-purple-700";

	return (
		<span className={`inline-block px-2 py-0.5 rounded text-xs ${badgeClass}`}>
			{category}
		</span>
	);
}

/**
 * Individual token card component
 */
function TokenCard({ token }: { token: ResolvedToken }) {
	const { name, value, category, usage, cssVar } = token;

	return (
		<div className="bg-[var(--color-bg-card)] p-4 rounded-lg border border-[var(--color-border-default)]">
			{/* Visual demo based on token type */}
			{isColorToken(cssVar, value) && <ColorSwatch value={value} />}
			{isSpacingToken(cssVar) && <SpacingDemo value={value} />}
			{isRadiusToken(cssVar) && <RadiusDemo value={value} />}
			{isFontSizeToken(cssVar) && <FontSizeDemo value={value} />}

			{/* Token name */}
			<div className="text-sm font-mono text-[var(--color-text-primary)] mb-1">
				{name}
			</div>

			{/* CSS variable name */}
			<div className="text-xs font-mono text-[var(--color-text-tertiary)] mb-1">
				{cssVar}
			</div>

			{/* Token value */}
			<div className="text-xs text-[var(--color-text-secondary)] mb-2">
				{value}
			</div>

			{/* Category badge */}
			<div className="mb-2">
				<CategoryBadge category={category} />
			</div>

			{/* Usage description */}
			{usage && (
				<div className="text-xs text-[var(--color-text-tertiary)]">{usage}</div>
			)}
		</div>
	);
}

/**
 * Token group section component
 */
function TokenGroupSection({ group }: { group: ResolvedTokenGroup }) {
	return (
		<div className="mb-8">
			<h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
				{group.title}
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{group.tokens.map((token) => (
					<TokenCard key={token.cssVar} token={token} />
				))}
			</div>
		</div>
	);
}

/**
 * TokenShowcase - Visual documentation component for design tokens
 *
 * @example
 * ```tsx
 * import { TokenShowcase, allTokenGroups } from "@calendar-ticker/design-system";
 *
 * function DesignTokensPage() {
 *   return <TokenShowcase groups={allTokenGroups} />;
 * }
 * ```
 */
export function TokenShowcase({ groups, className = "" }: TokenShowcaseProps) {
	const [resolvedGroups, setResolvedGroups] = useState<ResolvedTokenGroup[]>(
		[],
	);

	useEffect(() => {
		// Resolve CSS variable values after component mounts
		setResolvedGroups(resolveTokenValues(groups));
	}, [groups]);

	return (
		<div className={`token-showcase ${className}`}>
			{resolvedGroups.map((group) => (
				<TokenGroupSection key={group.title} group={group} />
			))}
		</div>
	);
}
