import { test, expect } from "@playwright/test";
import { SITE } from "../../content/site";

// The office address is what local search ranks on (CLAIMS #25). These pin it
// in the three places it has to agree: the schema, the footer, and /contact.

test("the business schema carries the street address", async ({ page }) => {
	await page.goto("/");
	const blocks = await page
		.locator('script[type="application/ld+json"]')
		.evaluateAll((ss) => ss.map((s) => JSON.parse(s.textContent ?? "null")));
	const business = blocks.find((b) => b?.["@type"] === "MovingCompany");
	expect(business?.address).toMatchObject({
		"@type": "PostalAddress",
		addressLocality: SITE.city,
		addressCountry: "ZM",
	});
	expect(business.address.streetAddress).toContain(SITE.building);
	expect(business.address.streetAddress).toContain(SITE.unit);
	expect(business.telephone).toEqual([SITE.phoneE164, SITE.phone2E164]);
});

test("the footer and contact page show the office address", async ({ page }) => {
	await page.goto("/contact");
	await expect(page.locator("footer address")).toContainText(SITE.building);
	const office = page.locator("main address");
	await expect(office).toContainText(SITE.building);
	await expect(office).toContainText(SITE.plot);
	await expect(page.locator("main")).toContainText(`P.O. Box ${SITE.poBox}`);
});
