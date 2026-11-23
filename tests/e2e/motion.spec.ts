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

test("the promo bar scrolls away and the nav stays pinned", async ({ page }) => {
	await page.goto("/");
	await page.waitForTimeout(600);
	const promo = page.getByText(/booking spots filling/i);
	await expect(promo).toBeInViewport();

	await page.evaluate(() => window.scrollTo(0, 900));
	await page.waitForTimeout(400);
	await expect(promo).not.toBeInViewport();
	expect((await page.locator("header").boundingBox())?.y).toBe(0);
});

// Regression: the header used to shrink past a scroll threshold. A sticky header
// still takes up space in the page, so the page jumped, scroll anchoring moved
// scrollY back across the threshold, and the header flipped open and shut on
// its own (54 flips in 6s on /quote) whenever someone scrolled up near the top.
test("the header never changes height or moves the page while scrolling", async ({ page }) => {
	await page.goto("/quote");
	await page.waitForTimeout(600);
	const measure = () =>
		page.evaluate(() => ({
			y: Math.round(scrollY),
			header: Math.round(document.querySelector("header")!.getBoundingClientRect().height),
			main: Math.round(document.querySelector("main")!.getBoundingClientRect().top + scrollY),
		}));
	const atTop = await measure();

	// Wheel back up from below the fold, the gesture that triggered it.
	await page.mouse.move(400, 400);
	await page.evaluate(() => window.scrollTo(0, 220));
	await page.waitForTimeout(300);
	for (let i = 0; i < 22; i++) {
		await page.mouse.wheel(0, -10);
		await page.waitForTimeout(50);
		const now = await measure();
		expect(now.header).toBe(atTop.header);
		expect(now.main).toBe(atTop.main);
	}

	// Parked near the top with no input, nothing may keep moving.
	for (const park of [30, 45, 61, 90]) {
		await page.evaluate((y) => window.scrollTo(0, y), park);
		await page.waitForTimeout(100);
		const start = await measure();
		await page.waitForTimeout(700);
		expect(await measure()).toEqual(start);
	}
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
