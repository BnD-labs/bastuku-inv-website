import type { Metadata } from "next";
import { bigShoulders, sora, jetbrains } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
	title: "Bastuku Investments",
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
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
