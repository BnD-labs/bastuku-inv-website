import type { Metadata } from "next";
import { bigShoulders, sora, jetbrains } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/content/site";
import { COVERAGE_TIERS } from "@/content/coverage";
import { OPEN_GRAPH_DEFAULTS } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL(SITE.url),
	title: {
		default: "Bastuku Investments | Movers, Clearing & Forwarding in Lusaka, Zambia",
		template: "%s | Bastuku Investments",
	},
	description:
		"House removals, office relocation, cross-border moves, and clearing and forwarding for commercial cargo. Trusted logistics in Lusaka, Zambia, since 2017.",
	// No `url` or canonical here: inherited by every page, they made each one
	// claim to be the home page. Pages set both through pageMetadata().
	openGraph: OPEN_GRAPH_DEFAULTS,
	twitter: { card: "summary_large_image" },
};

const localBusiness = {
	"@context": "https://schema.org",
	"@type": "MovingCompany",
	name: SITE.legalName,
	url: SITE.url,
	telephone: [SITE.phoneE164, SITE.phone2E164],
	email: SITE.email,
	address: {
		"@type": "PostalAddress",
		// streetAddress omitted deliberately: "Lusaka, Zambia" is too vague to
		// rank locally, and inventing one would be worse. See CLAIMS.md.
		addressLocality: SITE.city,
		addressCountry: "ZM",
	},
	foundingDate: String(SITE.foundedYear),
	areaServed: COVERAGE_TIERS.flatMap((t) => t.areas),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			{/* Icons come from app/icon.png and app/apple-icon.png, which Next
			    detects by convention and links automatically. */}
			<body className={`${bigShoulders.variable} ${sora.variable} ${jetbrains.variable}`}>
				<JsonLd data={localBusiness} />
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
