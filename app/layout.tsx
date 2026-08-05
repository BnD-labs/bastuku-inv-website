import type { Metadata } from "next";
import { bigShoulders, sora, jetbrains } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/content/site";
import { COVERAGE_TIERS } from "@/content/coverage";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL(SITE.url),
	title: {
		default: "Bastuku Investments | Movers & Logistics in Lusaka, Zambia",
		template: "%s | Bastuku Investments",
	},
	description:
		"House removals, office relocation, cross-border moves, and freight across Zambia. Trusted logistics in Lusaka since 2017.",
	openGraph: {
		type: "website",
		locale: "en_ZM",
		siteName: SITE.name,
		url: SITE.url,
		images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
	},
	twitter: { card: "summary_large_image" },
	alternates: { canonical: "/" },
};

const localBusiness = {
	"@context": "https://schema.org",
	"@type": "MovingCompany",
	name: SITE.legalName,
	url: SITE.url,
	telephone: SITE.phoneE164,
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
