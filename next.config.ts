import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		// Served through the Worker's IMAGES binding. AVIF first, WebP fallback.
		formats: ["image/avif", "image/webp"],
	},
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
