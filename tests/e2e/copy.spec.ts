import { test, expect } from "@playwright/test";
import { SERVICES } from "../../content/services";

// The price calculator was removed in August 2026 (CLAIMS.md #10), but the copy
// kept selling it for months. Any of these phrases means a page is promising a
// tool that does not exist.
const DEAD_TOOL =
	/indicative|rough pricing|estimate tool|estimate right on the site|price in under a minute|request an estimate/i;

const PATHS = [
	"/",
	"/how-it-works",
	"/about",
	"/services",
	"/for-business",
	"/contact",
	"/quote",
	...SERVICES.map((s) => `/services/${s.slug}`),
];

for (const path of PATHS) {
	test(`${path} does not promise the retired price tool`, async ({ page }) => {
		await page.goto(path);
		// The head too: search results and link previews show the description.
		const head = await page
			.locator('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]')
			.evaluateAll((ms) => ms.map((m) => m.getAttribute("content")).join(" | "));
		const body = await page.locator("body").innerText();
		expect([await page.title(), head, body].join(" | ")).not.toMatch(DEAD_TOOL);
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
