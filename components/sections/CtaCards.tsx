import Link from "next/link";
import { SITE } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * The four-card CTA row from the original static concept, which used <button>s
 * that went nowhere; each is a real destination here, and no two share one.
 * "Book Now" used to sit beside "Get a Quote" and both opened /quote, so it
 * became the phone line, which was otherwise missing from the top of the page.
 */
const CARDS: { label: string; caption: string; href: string; kind: "page" | "tab" | "tel" }[] = [
	{ label: "Get a Quote", caption: "Tell us the job, get a firm price", href: "/quote", kind: "page" },
	{ label: "WhatsApp Us", caption: "Message us from your phone", href: buildWhatsAppUrl({}), kind: "tab" },
	{ label: "Call Us", caption: SITE.phoneDisplay, href: `tel:${SITE.phoneE164}`, kind: "tel" },
	{ label: "For Business", caption: "Recurring office logistics", href: "/for-business", kind: "page" },
];

export function CtaCards() {
	return (
		<ul aria-label="Ways to get started" className="grid grid-cols-2 gap-4 px-[5vw] py-10 lg:grid-cols-4">
			{CARDS.map((c, i) => {
				// One target per card. The concept put a pill button inside a clickable
				// card, which read as two things to click. The quote card is navy
				// because it is the main action; lime stays on the dark surface.
				const primary = i === 0;
				const inner = (
					<>
						<span
							className={`flex items-center justify-between gap-2 font-display text-xl font-extrabold uppercase leading-none ${
								primary ? "text-lime" : "text-ink"
							}`}
						>
							{c.label}
							<span
								aria-hidden="true"
								className="font-body text-base transition-transform duration-300 ease-out group-hover:translate-x-1"
							>
								→
							</span>
						</span>
						<span
							className={`mt-2 block font-body text-[13.5px] font-medium ${
								primary ? "text-paper/75" : "text-ink-soft"
							}`}
						>
							{c.caption}
						</span>
					</>
				);
				const className =
					"group block h-full rounded-2xl px-5 py-5 shadow-[0_18px_34px_-18px_rgba(7,34,72,0.35)] " +
					"transition-[transform,box-shadow,background-color] duration-300 ease-out " +
					"hover:-translate-y-1 hover:shadow-[0_26px_44px_-20px_rgba(7,34,72,0.6)] " +
					"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-deep " +
					(primary ? "bg-ink hover:bg-ink-soft" : "bg-white hover:bg-card-tint");

				return (
					<li key={c.label}>
						{c.kind === "page" ? (
							<Link href={c.href} className={className}>
								{inner}
							</Link>
						) : (
							// WhatsApp opens in a new tab; a tel: link must not, or desktop
							// browsers leave a blank tab behind when the dialler takes over.
							<a
								href={c.href}
								className={className}
								{...(c.kind === "tab" && { target: "_blank", rel: "noopener noreferrer" })}
							>
								{inner}
							</a>
						)}
					</li>
				);
			})}
		</ul>
	);
}
