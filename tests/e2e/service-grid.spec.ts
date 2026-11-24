import { test, expect } from "@playwright/test";
import { SERVICES } from "../../content/services";

for (const path of ["/", "/services"]) {
	test(`${path} links every service, plus the not-sure card`, async ({ page }) => {
		await page.goto(path);
		for (const s of SERVICES) {
			await expect(page.locator(`main a[href="/services/${s.slug}"]`)).toHaveCount(1);
		}
		await expect(page.getByRole("link", { name: /not sure which you need/i })).toHaveAttribute("href", "/quote");
	});
}

// The grid's last card spans what is left of the final row, so no service sits
// alone on a row (General Supplies did, on the old three-column hub).
for (const width of [1366, 800]) {
	test(`the service grid's last row is full at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto("/services");
		const { gridRight, lastRight } = await page.evaluate(() => {
			const ul = document.querySelector("main ul")!;
			const last = ul.lastElementChild!;
			return {
				gridRight: Math.round(ul.getBoundingClientRect().right),
				lastRight: Math.round(last.getBoundingClientRect().right),
			};
		});
		expect(lastRight).toBe(gridRight);
	});
}

// Regression: the old homepage coverflow pushed its off-stage slides past the
// edge of a phone screen, so the page laid out at 698px and the browser zoomed
// the whole homepage out. innerWidth grows with the page on a phone, so the
// check is against the device width, not innerWidth.
test.describe("on a phone", () => {
	test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
	for (const path of ["/", "/services", "/services/house-removals", "/how-it-works", "/quote"]) {
		test(`${path} is no wider than the screen`, async ({ page }) => {
			await page.goto(path);
			await page.waitForTimeout(400);
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
		});
	}
});

// Kept from the retired coverflow spec: it guards every page element, not just
// the carousel. A focusable element inside aria-hidden is a keyboard trap that
// screen readers cannot announce.
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
