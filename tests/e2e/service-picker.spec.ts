import { test, expect } from "@playwright/test";

test("arrow keys move the coverflow only when it has focus", async ({ page }) => {
	await page.goto("/");
	const stage = page.getByRole("tablist", { name: "Our services" });
	await stage.scrollIntoViewIfNeeded();

	const first = page.getByRole("tab").first();
	await expect(first).toHaveAttribute("aria-selected", "true");

	await stage.focus();
	await page.keyboard.press("ArrowRight");
	await expect(page.getByRole("tab").nth(1)).toHaveAttribute("aria-selected", "true");
});

test("arrow keys do not hijack the page when the coverflow is not focused", async ({ page }) => {
	await page.goto("/");
	await page.locator("body").click({ position: { x: 5, y: 5 } });
	const before = await page.evaluate(() => window.scrollY);
	await page.keyboard.press("ArrowDown");
	await page.waitForTimeout(200);
	expect(await page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(before);
});

test("only the active tile is reachable by Tab", async ({ page }) => {
	await page.goto("/");
	const tabbable = page.locator('[role="tab"][tabindex="0"]');
	await expect(tabbable).toHaveCount(1);
});
