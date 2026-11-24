import { test, expect, type Page } from "@playwright/test";

/*
 * How far the hero photo is blown up past its own pixels, in device pixels.
 * The old hero was a 1920x973 landscape image with `sizes="100vw"`, so a phone
 * fetched the 1200px file and object-cover stretched it across a 390x1038 box:
 * about 5x, which is what "stretched and low res" looked like. Art direction
 * (a portrait crop for phones) keeps it near 1x.
 */
const heroUpscale = (page: Page) =>
	page.evaluate(async () => {
		const img = document.querySelector<HTMLImageElement>("main section picture img");
		if (!img) throw new Error("hero image not found");
		// naturalWidth is density-corrected for srcset images; load the chosen
		// file again to read its real pixel size.
		const probe = new Image();
		probe.src = img.currentSrc;
		await probe.decode();
		const aspect = probe.naturalWidth / probe.naturalHeight;
		const shownWidth = Math.max(img.clientWidth, img.clientHeight * aspect) * window.devicePixelRatio;
		return shownWidth / probe.naturalWidth;
	});

for (const [label, viewport, deviceScaleFactor, isMobile] of [
	["phone", { width: 390, height: 844 }, 3, true],
	["tablet", { width: 768, height: 1024 }, 2, true],
	["laptop", { width: 1366, height: 678 }, 1, false],
	["2x laptop", { width: 1440, height: 900 }, 2, false],
] as const) {
	test.describe(`hero on a ${label}`, () => {
		test.use({ viewport, deviceScaleFactor, isMobile });

		test("is not stretched past its own resolution", async ({ page }) => {
			await page.goto("/");
			expect(await heroUpscale(page)).toBeLessThan(1.5);
		});
	});
}

test.describe("service page video", () => {
	test.use({ viewport: { width: 390, height: 844 }, isMobile: true });

	test("downloads nothing until it is on screen, then plays and can be paused", async ({ page }) => {
		const requests: string[] = [];
		page.on("request", (r) => {
			if (r.url().endsWith(".mp4")) requests.push(r.url());
		});
		await page.goto("/services/house-removals");
		await page.waitForTimeout(1000);
		expect(requests).toHaveLength(0);

		const video = page.locator("video");
		await video.scrollIntoViewIfNeeded();
		await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.3);

		await page.getByRole("button", { name: "Pause video" }).click();
		expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
		await expect(page.getByRole("button", { name: "Play video" })).toBeVisible();
	});
});

test.describe("service page video with reduced motion", () => {
	test.use({ contextOptions: { reducedMotion: "reduce" } });

	test("stays on its poster", async ({ page }) => {
		await page.goto("/services/house-removals");
		await page.locator("video").scrollIntoViewIfNeeded();
		await page.waitForTimeout(1500);
		expect(await page.locator("video").evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
		await expect(page.getByRole("button", { name: "Play video" })).toBeVisible();
	});
});
