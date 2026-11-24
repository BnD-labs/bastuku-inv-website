import { test, expect } from "@playwright/test";

/*
 * A stand-in for Turnstile's explicit-render API. Each render drops a hidden
 * response input into the container, as the real widget does, with a numbered
 * token so a test can tell which widget a submission came from.
 */
const FAKE_TURNSTILE = `
window.turnstile = {
	n: 0, widgets: {},
	render(el) {
		const id = "w" + (++this.n);
		const input = document.createElement("input");
		input.type = "hidden"; input.name = "cf-turnstile-response"; input.value = "token-" + this.n;
		el.appendChild(input); this.widgets[id] = input; return id;
	},
	remove(id) { this.widgets[id]?.remove(); delete this.widgets[id]; },
};`;

async function fillAndSubmit(page: import("@playwright/test").Page) {
	await page.getByLabel(/full name/i).fill("John Banda");
	await page.getByLabel(/phone/i).fill("0962936172");
	const request = page.waitForRequest("**/api/quote");
	await page.getByRole("button", { name: /get my quote/i }).click();
	return (await request).postDataJSON() as { turnstileToken: string };
}

// Regression: the form used Turnstile's implicit mode, which scans the page for
// .cf-turnstile once, when the script loads. A form mounted after that, such as
// coming back to /quote within the site, got no widget, sent an empty token,
// and the server refused it with a 403.
test("the quote form sends a Turnstile token, including after navigating away and back", async ({ page }) => {
	await page.route("https://challenges.cloudflare.com/**", (r) =>
		r.fulfill({ contentType: "text/javascript", body: FAKE_TURNSTILE })
	);
	await page.route("**/api/quote", (r) => r.fulfill({ status: 403, json: { ok: false, error: "x" } }));

	await page.goto("/quote");
	const form = page.locator("form");
	await expect(form.locator('input[name="cf-turnstile-response"]')).toHaveCount(1);
	expect((await fillAndSubmit(page)).turnstileToken).toMatch(/^token-\d+$/);

	// Client-side navigation away and back remounts the form.
	await page.locator('header nav[aria-label="Main"] a[href="/services"]').click();
	await expect(page).toHaveURL(/\/services$/);
	await page.goBack();
	await expect(page).toHaveURL(/\/quote$/);

	// Exactly one widget, in the live form: the old one was removed on unmount.
	await expect(form.locator('input[name="cf-turnstile-response"]')).toHaveCount(1);
	expect((await fillAndSubmit(page)).turnstileToken).toMatch(/^token-\d+$/);
});

// The static HTML carries a placeholder copy of the form so the page doesn't
// shift as it loads. Before hydration it must not be usable: typing would be
// wiped when React swaps in the real form, and a native submit would be a GET
// that puts the visitor's name and phone in the URL.
test.describe("before the page's JavaScript runs", () => {
	test.use({ javaScriptEnabled: false });

	test("the placeholder form is disabled and cannot be submitted", async ({ page }) => {
		await page.goto("/quote");
		await expect(page.getByLabel(/full name/i)).toBeDisabled();
		await expect(page.getByRole("button", { name: /get my quote/i })).toBeDisabled();
	});
});
