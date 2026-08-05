import { test, expect } from "@playwright/test";

test("prefills the service from the estimate widget", async ({ page }) => {
	await page.goto("/quote?service=office-relocation&low=1200&high=1800");
	// Exact: the footer's <nav aria-label="Services"> also matches /service/i.
	await expect(page.getByLabel("Service", { exact: true })).toHaveValue("office-relocation");
});

test("shows a field error for an invalid phone number", async ({ page }) => {
	await page.goto("/quote");
	await page.getByLabel(/full name/i).fill("John Banda");
	await page.getByLabel(/phone/i).fill("12345");
	await page.getByRole("button", { name: /get my quote/i }).click();
	// Scoped to the form: Next.js's route announcer is also role="alert".
	await expect(page.locator("form").getByRole("alert")).toContainText(/valid Zambian mobile/i);
});

test("submits successfully and shows confirmation", async ({ page }) => {
	await page.route("**/api/quote", (r) =>
		r.fulfill({ status: 200, json: { ok: true, leadId: "lead-123" } })
	);
	await page.goto("/quote");
	await page.getByLabel(/full name/i).fill("John Banda");
	await page.getByLabel(/phone/i).fill("0962936172");
	await page.getByRole("button", { name: /get my quote/i }).click();
	await expect(page.getByText(/we've got your request/i)).toBeVisible();
});

test("offers a prefilled WhatsApp fallback when the server fails", async ({ page }) => {
	await page.route("**/api/quote", (r) =>
		r.fulfill({
			status: 503,
			json: {
				ok: false,
				error: "We couldn't submit that.",
				whatsappUrl: "https://wa.me/260962936172?text=Hi%20Bastuku",
			},
		})
	);
	await page.goto("/quote");
	await page.getByLabel(/full name/i).fill("John Banda");
	await page.getByLabel(/phone/i).fill("0962936172");
	await page.getByRole("button", { name: /get my quote/i }).click();

	// Named specifically: the always-present "Or WhatsApp us" link also matches
	// /whatsapp/i, and a loose selector would trip Playwright's strict mode.
	const fallback = page.getByRole("link", { name: /send this on whatsapp/i });
	await expect(fallback).toBeVisible();
	await expect(fallback).toHaveAttribute("href", /wa\.me\/260962936172/);
});

test("the typed data survives a server failure", async ({ page }) => {
	await page.route("**/api/quote", (r) => r.fulfill({ status: 503, json: { ok: false } }));
	await page.goto("/quote");
	await page.getByLabel(/full name/i).fill("John Banda");
	await page.getByLabel(/phone/i).fill("0962936172");
	await page.getByRole("button", { name: /get my quote/i }).click();

	// The form must not clear itself — the legacy form reset after a timeout.
	await expect(page.getByLabel(/full name/i)).toHaveValue("John Banda");
	await expect(page.getByRole("button", { name: /get my quote/i })).toBeEnabled();
});
