import type { Metadata } from "next";
import { bigShoulders, sora, jetbrains } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
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
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className={`${bigShoulders.variable} ${sora.variable} ${jetbrains.variable}`}>
				<Header />
				{children}
			</body>
		</html>
	);
}
