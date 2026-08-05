import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { SERVICES } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = [
		"",
		"/services",
		"/coverage",
		"/how-it-works",
		"/for-business",
		"/about",
		"/quote",
		"/contact",
		...SERVICES.map((s) => `/services/${s.slug}`),
	];

	return routes.map((path) => ({
		url: `${SITE.url}${path}`,
		lastModified: new Date(),
		changeFrequency: path === "" ? "weekly" : "monthly",
		priority: path === "" ? 1 : 0.7,
	}));
}
