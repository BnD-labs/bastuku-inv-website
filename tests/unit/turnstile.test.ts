import { describe, it, expect, vi, afterEach } from "vitest";
import { verifyTurnstile } from "@/lib/turnstile";

afterEach(() => vi.unstubAllGlobals());

function stubFetch(body: unknown, ok = true) {
	const fn = vi.fn().mockResolvedValue({ ok, json: async () => body });
	vi.stubGlobal("fetch", fn);
	return fn;
}

describe("verifyTurnstile", () => {
	it("returns true when Cloudflare reports success", async () => {
		stubFetch({ success: true });
		expect(await verifyTurnstile("tok", "secret")).toBe(true);
	});

	it("returns false when Cloudflare reports failure", async () => {
		stubFetch({ success: false, "error-codes": ["invalid-input-response"] });
		expect(await verifyTurnstile("tok", "secret")).toBe(false);
	});

	it("returns false rather than throwing when the network fails", async () => {
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
		expect(await verifyTurnstile("tok", "secret")).toBe(false);
	});

	it("returns false for an empty token without calling the network", async () => {
		const fn = stubFetch({ success: true });
		expect(await verifyTurnstile("", "secret")).toBe(false);
		expect(fn).not.toHaveBeenCalled();
	});

	it("sends the token and secret to Cloudflare's siteverify endpoint", async () => {
		const fn = stubFetch({ success: true });
		await verifyTurnstile("tok", "secret", "1.2.3.4");
		const [url, init] = fn.mock.calls[0];
		expect(url).toContain("challenges.cloudflare.com");
		const body = JSON.parse((init as RequestInit).body as string);
		expect(body).toMatchObject({ secret: "secret", response: "tok", remoteip: "1.2.3.4" });
	});
});
