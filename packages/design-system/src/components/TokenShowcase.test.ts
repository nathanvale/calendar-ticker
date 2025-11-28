/// <reference types="bun-types" />
/**
 * TokenShowcase Utility Functions Tests
 *
 * Tests the helper functions used by the TokenShowcase component
 * for identifying token types and resolving CSS variable values.
 */

import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import type { TokenGroup } from "../tokens";
import {
	isColorToken,
	isFontSizeToken,
	isRadiusToken,
	isSpacingToken,
	resolveTokenValues,
} from "./TokenShowcase";

describe("TokenShowcase Utility Functions", () => {
	describe("isColorToken", () => {
		it("should return true for color tokens with hex values", () => {
			expect(isColorToken("--color-blue-500", "#3b82f6")).toBe(true);
		});

		it("should return true for color tokens with rgb values", () => {
			expect(isColorToken("--color-red-500", "rgb(239, 68, 68)")).toBe(true);
			expect(isColorToken("--color-green-500", "rgba(34, 197, 94, 0.5)")).toBe(
				true,
			);
		});

		it("should return true for color tokens with CSS variable references", () => {
			expect(isColorToken("--color-primary", "var(--color-blue-500)")).toBe(
				true,
			);
		});

		it("should return false for color tokens without values", () => {
			expect(isColorToken("--color-blue-500", undefined)).toBe(false);
		});

		it("should return false for font-related color tokens", () => {
			expect(isColorToken("--font-color-primary", "#000000")).toBe(false);
		});

		it("should return false for non-color tokens", () => {
			expect(isColorToken("--space-4", "16px")).toBe(false);
			expect(isColorToken("--radius-md", "8px")).toBe(false);
		});

		it("should return false for color tokens with non-color values", () => {
			expect(isColorToken("--color-opacity", "0.5")).toBe(false);
			expect(isColorToken("--color-size", "16px")).toBe(false);
		});
	});

	describe("isSpacingToken", () => {
		it("should return true for spacing tokens", () => {
			expect(isSpacingToken("--space-1")).toBe(true);
			expect(isSpacingToken("--space-4")).toBe(true);
			expect(isSpacingToken("--space-large")).toBe(true);
		});

		it("should return false for non-spacing tokens", () => {
			expect(isSpacingToken("--color-blue-500")).toBe(false);
			expect(isSpacingToken("--radius-md")).toBe(false);
			expect(isSpacingToken("--font-size-lg")).toBe(false);
		});
	});

	describe("isRadiusToken", () => {
		it("should return true for radius tokens", () => {
			expect(isRadiusToken("--radius-sm")).toBe(true);
			expect(isRadiusToken("--radius-md")).toBe(true);
			expect(isRadiusToken("--border-radius-lg")).toBe(true);
		});

		it("should return false for non-radius tokens", () => {
			expect(isRadiusToken("--color-blue-500")).toBe(false);
			expect(isRadiusToken("--space-4")).toBe(false);
			expect(isRadiusToken("--font-size-lg")).toBe(false);
		});
	});

	describe("isFontSizeToken", () => {
		it("should return true for font-size tokens", () => {
			expect(isFontSizeToken("--font-size-sm")).toBe(true);
			expect(isFontSizeToken("--font-size-md")).toBe(true);
			expect(isFontSizeToken("--text-font-size-lg")).toBe(true);
		});

		it("should return false for non-font-size tokens", () => {
			expect(isFontSizeToken("--color-blue-500")).toBe(false);
			expect(isFontSizeToken("--space-4")).toBe(false);
			expect(isFontSizeToken("--radius-md")).toBe(false);
			expect(isFontSizeToken("--font-family-sans")).toBe(false);
		});
	});

	describe("resolveTokenValues", () => {
		// Mock getComputedStyle
		const mockGetPropertyValue = mock((_prop: string) => "");

		// Store originals to restore after tests
		let originalDocument: unknown;
		let originalGetComputedStyle: unknown;

		beforeEach(() => {
			mockGetPropertyValue.mockReset();

			// Store originals
			originalDocument = globalThis.document;
			originalGetComputedStyle = globalThis.getComputedStyle;

			// Mock document.documentElement
			(globalThis as Record<string, unknown>).document = {
				documentElement: {},
			};

			// Mock getComputedStyle
			(globalThis as Record<string, unknown>).getComputedStyle = mock(() => ({
				getPropertyValue: mockGetPropertyValue,
			}));
		});

		afterEach(() => {
			// Restore originals so other tests aren't affected
			(globalThis as Record<string, unknown>).document = originalDocument;
			(globalThis as Record<string, unknown>).getComputedStyle =
				originalGetComputedStyle;
		});

		it("should resolve primitive color tokens", () => {
			mockGetPropertyValue.mockImplementation((prop: string) => {
				if (prop === "--color-blue-500") return "#3b82f6";
				if (prop === "--color-red-500") return "#ef4444";
				return "";
			});

			const groups: TokenGroup[] = [
				{
					title: "Colors",
					tokens: [
						{
							name: "Blue 500",
							cssVar: "--color-blue-500",
							value: "#3b82f6",
							category: "primitive",
							usage: "Primary blue",
						},
						{
							name: "Red 500",
							cssVar: "--color-red-500",
							value: "#ef4444",
							category: "primitive",
							usage: "Error red",
						},
					],
				},
			];

			const result = resolveTokenValues(groups);

			expect(result).toHaveLength(1);
			expect(result[0]!.title).toBe("Colors");
			expect(result[0]!.tokens).toHaveLength(2);
			expect(result[0]!.tokens[0]!.value).toBe("#3b82f6");
			expect(result[0]!.tokens[1]!.value).toBe("#ef4444");
		});

		it("should resolve semantic tokens that reference primitive tokens", () => {
			mockGetPropertyValue.mockImplementation((prop: string) => {
				if (prop === "--color-brand-primary") return "var(--color-blue-500)";
				if (prop === "--color-blue-500") return "#3b82f6";
				return "";
			});

			const groups: TokenGroup[] = [
				{
					title: "Semantic Colors",
					tokens: [
						{
							name: "Brand Primary",
							cssVar: "--color-brand-primary",
							value: "var(--color-primary-500)",
							category: "semantic",
							usage: "Primary brand color",
						},
					],
				},
			];

			const result = resolveTokenValues(groups);

			expect(result[0]!.tokens[0]!.value).toBe("#3b82f6");
		});

		it("should handle tokens with missing CSS values by using fallback", () => {
			mockGetPropertyValue.mockReturnValue("");

			const groups: TokenGroup[] = [
				{
					title: "Fallback Test",
					tokens: [
						{
							name: "Custom Color",
							cssVar: "--color-custom",
							value: "#123456",
							category: "primitive",
							usage: "Custom color",
						},
					],
				},
			];

			const result = resolveTokenValues(groups);

			expect(result[0]!.tokens[0]!.value).toBe("#123456");
		});

		it("should handle circular references gracefully", () => {
			let callCount = 0;
			mockGetPropertyValue.mockImplementation((prop: string) => {
				callCount++;
				// Prevent infinite loop in test - return circular reference
				if (prop === "--color-a") return "var(--color-b)";
				if (prop === "--color-b") return "var(--color-a)";
				return "";
			});

			const groups: TokenGroup[] = [
				{
					title: "Circular Test",
					tokens: [
						{
							name: "Color A",
							cssVar: "--color-a",
							value: "var(--color-b)",
							category: "semantic",
							usage: "Circular ref A",
						},
					],
				},
			];

			// Should not throw or hang
			const result = resolveTokenValues(groups);

			// Should return the unresolved value when circular reference detected
			expect(result[0]!.tokens[0]!.value).toBeTruthy();
			// Call count should be limited (not infinite)
			expect(callCount).toBeLessThan(10);
		});

		it("should resolve multiple groups", () => {
			mockGetPropertyValue.mockImplementation((prop: string) => {
				if (prop === "--color-blue-500") return "#3b82f6";
				if (prop === "--space-4") return "16px";
				if (prop === "--radius-md") return "8px";
				return "";
			});

			const groups: TokenGroup[] = [
				{
					title: "Colors",
					tokens: [
						{
							name: "Blue 500",
							cssVar: "--color-blue-500",
							value: "#3b82f6",
							category: "primitive",
							usage: "Blue",
						},
					],
				},
				{
					title: "Spacing",
					tokens: [
						{
							name: "Space 4",
							cssVar: "--space-4",
							value: "1rem",
							category: "primitive",
							usage: "Base spacing",
						},
					],
				},
				{
					title: "Border Radius",
					tokens: [
						{
							name: "Radius MD",
							cssVar: "--radius-md",
							value: "0.375rem",
							category: "primitive",
							usage: "Medium radius",
						},
					],
				},
			];

			const result = resolveTokenValues(groups);

			expect(result).toHaveLength(3);
			expect(result[0]!.title).toBe("Colors");
			expect(result[1]!.title).toBe("Spacing");
			expect(result[2]!.title).toBe("Border Radius");
			expect(result[0]!.tokens[0]!.value).toBe("#3b82f6");
			expect(result[1]!.tokens[0]!.value).toBe("16px");
			expect(result[2]!.tokens[0]!.value).toBe("8px");
		});

		it("should preserve token properties like usage", () => {
			mockGetPropertyValue.mockImplementation((prop: string) => {
				if (prop === "--color-primary") return "#3b82f6";
				return "";
			});

			const groups: TokenGroup[] = [
				{
					title: "Semantic",
					tokens: [
						{
							name: "Color Primary",
							cssVar: "--color-primary",
							value: "#3b82f6",
							category: "semantic",
							usage: "Used for primary actions",
						},
					],
				},
			];

			const result = resolveTokenValues(groups);

			expect(result[0]!.tokens[0]!).toMatchObject({
				name: "Color Primary",
				cssVar: "--color-primary",
				category: "semantic",
				usage: "Used for primary actions",
				value: "#3b82f6",
			});
		});

		it("should handle tokens with whitespace in CSS values", () => {
			mockGetPropertyValue.mockImplementation((prop: string) => {
				if (prop === "--color-blue-500") return "  #3b82f6  ";
				return "";
			});

			const groups: TokenGroup[] = [
				{
					title: "Colors",
					tokens: [
						{
							name: "Blue 500",
							cssVar: "--color-blue-500",
							value: "#3b82f6",
							category: "primitive",
							usage: "Blue",
						},
					],
				},
			];

			const result = resolveTokenValues(groups);

			expect(result[0]!.tokens[0]!.value).toBe("#3b82f6");
		});

		it("should handle deeply nested variable references", () => {
			mockGetPropertyValue.mockImplementation((prop: string) => {
				if (prop === "--color-brand-primary")
					return "var(--color-semantic-primary)";
				if (prop === "--color-semantic-primary") return "var(--color-blue-500)";
				if (prop === "--color-blue-500") return "#3b82f6";
				return "";
			});

			const groups: TokenGroup[] = [
				{
					title: "Brand Colors",
					tokens: [
						{
							name: "Brand Primary",
							cssVar: "--color-brand-primary",
							value: "var(--color-primary-500)",
							category: "semantic",
							usage: "Brand primary",
						},
					],
				},
			];

			const result = resolveTokenValues(groups);

			expect(result[0]!.tokens[0]!.value).toBe("#3b82f6");
		});
	});
});
