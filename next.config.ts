import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		// Served through the Worker's IMAGES binding. AVIF first, WebP fallback.
		formats: ["image/avif", "image/webp"],
	},
	async redirects() {
		return [
			// Renamed service. The old URL is in Facebook posts, the Google
			// Business Profile, and WhatsApp chats, so it has to keep resolving.
			{
				source: "/services/exports-imports",
				destination: "/services/clearing-forwarding-freight",
				permanent: true,
			},
		];
	},
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
