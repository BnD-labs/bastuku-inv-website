// Hand-written companion to the generated `cloudflare-env.d.ts`.
//
// Bindings declared in `wrangler.jsonc` (DB, ASSETS, IMAGES, …) are produced by
// `npm run cf-typegen` and must not be edited by hand — that file is regenerated.
// Secrets are set with `wrangler secret put` (and `.dev.vars` locally), so they
// never appear in wrangler.jsonc and `wrangler types` cannot know about them.
// Declaration merging adds them to the generated interface without touching it.
interface CloudflareEnv {
	TURNSTILE_SECRET_KEY: string;
	RESEND_API_KEY: string;
	LEAD_NOTIFY_EMAIL: string;
}
