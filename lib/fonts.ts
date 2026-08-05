// Google renamed "Big Shoulders Display" to "Big Shoulders"; next/font exports it
// under the new name only. The CSS variable keeps the original token name.
import { Big_Shoulders, Sora, JetBrains_Mono } from "next/font/google";

export const bigShoulders = Big_Shoulders({
	subsets: ["latin"],
	weight: ["700", "800", "900"],
	variable: "--font-big-shoulders",
	display: "swap",
});

export const sora = Sora({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-sora",
	display: "swap",
});

export const jetbrains = JetBrains_Mono({
	subsets: ["latin"],
	weight: ["500", "700"],
	variable: "--font-jetbrains",
	display: "swap",
});
