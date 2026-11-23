import { test, expect } from "@playwright/test";

// The price calculator was removed in August 2026 (CLAIMS.md #10), but the copy
// kept selling it for months. Any of these phrases means a page is promising a
// tool that does not exist.
const DEAD_TOOL = /indicative|rough pricing|estimate tool|estimate right on the site|price in under a minute/i;

for (const path of ["/", "/how-it-works", "/about", "/services", "/for-business", "/quote"]) {
	test(`${path} does not promise the retired price tool`, async ({ page }) => {
		await page.goto(path);
		expect(await page.locator("body").innerText()).not.toMatch(DEAD_TOOL);
	});
}

test("the homepage call-to-action cards each go somewhere different", async ({ page }) => {
	await page.goto("/");
	const hrefs = await page
		.getByRole("list", { name: "Ways to get started" })
		.getByRole("link")
		.evaluateAll((as) => as.map((a) => a.getAttribute("href")));
	expect(hrefs).toHaveLength(4);
	expect(new Set(hrefs).size).toBe(hrefs.length);
	expect(hrefs).toContain("tel:+260976831400");
});
