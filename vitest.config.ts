import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
	// clearMocks resets call history between tests. Without it, assertions like
	// `expect(fn).not.toHaveBeenCalled()` see calls leaked from earlier tests.
	test: { environment: "node", include: ["tests/unit/**/*.test.ts"], clearMocks: true },
	resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
