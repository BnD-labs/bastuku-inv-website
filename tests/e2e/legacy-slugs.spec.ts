import { test, expect } from "@playwright/test";

// "Exports & Imports" was renamed. Links to the old slug are out in Facebook
// posts, the Google Business Profile, and WhatsApp chats, so both entry points
// have to keep landing on the renamed service.

test("the old exports-imports service URL redirects to the renamed page", async ({ page }) => {
	const res = await page.goto("/services/exports-imports");
	expect(res?.status()).toBe(200);
	await expect(page).toHaveURL(/\/services\/clearing-forwarding-freight$/);
	await expect(page.getByRole("heading", { level: 1 })).toContainText(/clearing, forwarding and freight/i);
});

test("an old ?service=exports-imports quote link preselects the renamed service", async ({ page }) => {
	await page.goto("/quote?service=exports-imports");
	// Exact: the footer's <nav aria-label="Services"> also matches /service/i.
	await expect(page.getByLabel("Service", { exact: true })).toHaveValue("clearing-forwarding-freight");
});
