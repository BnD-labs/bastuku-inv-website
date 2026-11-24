import { test, expect } from "@playwright/test";

/*
 * Cumulative layout shift on load, measured in the page. /quote used to score
 * 0.27 on a laptop and 0.52 on a phone: its form rendered inside a Suspense
 * boundary with a null fallback, so the static HTML had no form and the footer
 * jumped down when it hydrated. Lighthouse in CI catches this too, but only on
 * the pages it audits and only after a full build; this fails locally, fast.
 * 0.1 is Google's "good" threshold; the site aims for 0.
 */
const measureCls = async (page: import("@playwright/test").Page, path: string) => {
	await page.addInitScript(() => {
		(window as unknown as { __cls: number }).__cls = 0;
		new PerformanceObserver((list) => {
			for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
				if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
			}
		}).observe({ type: "layout-shift", buffered: true });
	});
	await page.goto(path, { waitUntil: "load" });
	await page.waitForTimeout(2500);
	return page.evaluate(() => (window as unknown as { __cls: number }).__cls);
};

for (const viewport of [
	{ width: 1366, height: 678 },
	{ width: 390, height: 844 },
]) {
	for (const path of ["/", "/quote", "/quote?service=exports-imports&origin=Kabulonga"]) {
		test(`${path} holds still while loading at ${viewport.width}px`, async ({ page }) => {
			await page.setViewportSize(viewport);
			expect(await measureCls(page, path)).toBeLessThan(0.02);
		});
	}
}
