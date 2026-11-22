import type { Metadata } from "next";
import { SITE } from "@/content/site";

/** Open Graph fields every page shares. `url` is per page; see pageMetadata. */
export const OPEN_GRAPH_DEFAULTS = {
	type: "website",
	locale: "en_ZM",
	siteName: SITE.name,
	images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
} satisfies Metadata["openGraph"];

/**
 * Metadata for one page: canonical URL plus a complete `openGraph` object.
 *
 * Next merges metadata shallowly, so a page that set only `openGraph.url`
 * would drop the shared image and site name; and with `url` only in the root
 * layout, every page published `og:url` as the home page. This returns the
 * whole object with the page's own URL.
 *
 * `openGraph.title` and `description` are left out on purpose: Next fills them
 * from the page's resolved title and description, which applies the layout's
 * "%s | Bastuku Investments" template. Setting them here would bypass it.
 * Omit `title`/`description` to inherit the layout defaults (the home page).
 */
export function pageMetadata({
	title,
	description,
	path,
}: {
	title?: string;
	description?: string;
	path: string;
}): Metadata {
	return {
		...(title && { title }),
		...(description && { description }),
		alternates: { canonical: path },
		openGraph: { ...OPEN_GRAPH_DEFAULTS, url: path },
	};
}
