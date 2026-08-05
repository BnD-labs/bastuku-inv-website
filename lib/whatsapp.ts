import { SITE } from "@/content/site";

export interface WhatsAppContext {
	service?: string;
	origin?: string;
	destination?: string;
	name?: string;
	message?: string;
}

export function buildWhatsAppUrl(ctx: WhatsAppContext = {}): string {
	const lines = ["Hi Bastuku, I'd like a quote."];

	const fields: [string, string | undefined][] = [
		["Name", ctx.name],
		["Service", ctx.service],
		["From", ctx.origin],
		["To", ctx.destination],
		["Details", ctx.message],
	];

	for (const [label, value] of fields) {
		if (value && value.trim()) lines.push(`${label}: ${value.trim()}`);
	}

	// encodeURIComponent leaves ' unescaped; encode it too so the URL stays intact
	// inside a single-quoted HTML attribute.
	const text = encodeURIComponent(lines.join("\n")).replace(/'/g, "%27");

	return `https://wa.me/${SITE.whatsappNumber}?text=${text}`;
}
