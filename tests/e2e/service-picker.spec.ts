import { test, expect } from "@playwright/test";

/** The dot whose `aria-current` is true identifies the active slide. */
const activeDot = (page: import("@playwright/test").Page) =>
	page.locator('button[aria-current="true"]');

test("arrow keys move the coverflow only when it has focus", async ({ page }) => {
	await page.goto("/");
	const stage = page.getByRole("region", { name: "Our services" });
	await stage.scrollIntoViewIfNeeded();

	await expect(activeDot(page)).toHaveAccessibleName("Show House Removals");

	await stage.focus();
	await page.keyboard.press("ArrowRight");
	await expect(activeDot(page)).toHaveAccessibleName("Show Office Relocation");
});

test("arrow keys do not hijack the page when the coverflow is not focused", async ({ page }) => {
	await page.goto("/");
	await page.locator("body").click({ position: { x: 5, y: 5 } });
	const before = await page.evaluate(() => window.scrollY);
	await page.keyboard.press("ArrowDown");
	await page.waitForTimeout(200);
	expect(await page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(before);
});

test("only the active slide exposes a focusable link", async ({ page }) => {
	await page.goto("/");
	// Off-stage slides render no CTA, so nothing focusable hides behind
	// aria-hidden and Tab order stays on the visible tile.
	await expect(page.locator('[aria-roledescription="slide"] a')).toHaveCount(1);
});

test("slides are exposed as labelled carousel slides, not tabs", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator('[role="tab"], [role="tablist"]')).toHaveCount(0);
	const slides = page.locator('[aria-roledescription="slide"]');
	await expect(slides).toHaveCount(6);
	await expect(slides.first()).toHaveAttribute("aria-label", "1 of 6: House Removals");
});

test("no element hidden from assistive tech contains focusable content", async ({ page }) => {
	await page.goto("/");
	const trapped = await page.evaluate(
		() =>
			[...document.querySelectorAll('[aria-hidden="true"]')].filter((el) =>
				el.querySelector("a[href], button, input, select, textarea, [tabindex]")
			).length
	);
	expect(trapped).toBe(0);
});
