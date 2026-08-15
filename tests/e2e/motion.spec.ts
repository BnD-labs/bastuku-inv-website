import { test, expect } from "@playwright/test";

/** Elements that are both on screen and transparent — the only state a user perceives as "blank". */
const hiddenInView = (page: import("@playwright/test").Page) =>
	page.evaluate(
		() =>
			[...document.querySelectorAll(".u-reveal")].filter((e) => {
				const r = e.getBoundingClientRect();
				return r.bottom > 0 && r.top < innerHeight && Number(getComputedStyle(e).opacity) < 0.99;
			}).length
	);

test("scroll reveal never hides content that is already on screen", async ({ page }) => {
	await page.goto("/services");
	// Sampled across hydration: the failure mode this guards against is a page
	// that renders blank until JS runs, which only shows up mid-load.
	for (let i = 0; i < 6; i++) {
		expect(await hiddenInView(page)).toBe(0);
		await page.waitForTimeout(250);
	}
});

test("below-fold content is armed and then revealed on scroll", async ({ page }) => {
	await page.goto("/services");
	await page.waitForTimeout(600);
	expect(await page.locator('.u-reveal[data-armed="true"]').count()).toBeGreaterThan(0);

	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
	await page.waitForTimeout(1400);
	expect(await hiddenInView(page)).toBe(0);
});

test("the header condenses once the page is scrolled", async ({ page }) => {
	await page.goto("/");
	await page.waitForTimeout(600);
	const promo = page.locator("header > div").first();
	const open = (await promo.boundingBox())?.height ?? 0;
	expect(open).toBeGreaterThan(0);

	await page.evaluate(() => window.scrollTo(0, 900));
	await page.waitForTimeout(700);
	const shut = (await promo.boundingBox())?.height ?? 0;
	expect(shut).toBeLessThan(open);
});

test("the current section is marked in the nav", async ({ page }) => {
	await page.goto("/services/house-removals");
	// Nested routes still mark their parent, so the indicator never goes blank.
	const current = page.locator('nav[aria-label="Main"] a[aria-current="page"]');
	await expect(current).toHaveCount(1);
	await expect(current).toHaveText("Services");
});

// The context is built by hand rather than with `test.use({ reducedMotion })`:
// at describe level that option silently fails to apply here — matchMedia still
// reports false — so the test would pass while never exercising reduced motion.
test("reduced motion hides nothing and animates nothing", async ({ browser, baseURL }) => {
	const context = await browser.newContext({ reducedMotion: "reduce" });
	const page = await context.newPage();
	try {
		await page.goto(`${baseURL}/services`);
		await page.waitForTimeout(800);

		// Guard the guard: if emulation ever stops applying, fail loudly rather
		// than quietly asserting nothing.
		expect(
			await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)
		).toBe(true);

		expect(await page.locator('.u-reveal[data-armed="true"]').count()).toBe(0);
		expect(await hiddenInView(page)).toBe(0);
		expect(await page.evaluate(() => document.querySelectorAll(".u-reveal").length)).toBeGreaterThan(0);
	} finally {
		await context.close();
	}
});
