import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// eslint-config-next@16 ships flat configs. The old FlatCompat wrapper around
// "next/core-web-vitals" crashed with "Converting circular structure to JSON".
export default defineConfig([
	...nextVitals,
	...nextTs,
	// Build output and generated files: nothing here is written by hand.
	globalIgnores([
		".next/**",
		".open-next/**",
		".wrangler/**",
		"out/**",
		"build/**",
		"playwright-report/**",
		"test-results/**",
		"next-env.d.ts",
		"cloudflare-env.d.ts",
	]),
]);
