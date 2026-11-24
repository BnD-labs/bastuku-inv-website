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
	// role="list": Safari drops list semantics from a ul with list-style: none,
	// which Tailwind's preflight sets.
	return (
		<ul role="list" aria-label="Ways to get started" className="grid grid-cols-2 gap-4 px-[5vw] pb-14 lg:grid-cols-4">
			{CARDS.map((c) => {
				const inner = (
					<>
						<span className="flex justify-center bg-card-tint px-4 py-6">
							<span className="rounded-pill bg-ink px-5 py-3 font-body text-sm font-bold text-lime transition-colors duration-300 group-hover:bg-ink-soft">
								{c.label}
							</span>
						</span>
						<span className="block bg-white px-3 pb-5 pt-4 text-center font-body text-[13.5px] font-medium text-ink-soft">
							{c.caption}
						</span>
					</>
				);
				const className =
					"group block h-full overflow-hidden rounded-2xl shadow-[0_18px_34px_-18px_rgba(7,34,72,0.35)] " +
					"transition-[transform,box-shadow] duration-300 ease-out " +
					"hover:-translate-y-1.5 hover:shadow-[0_26px_44px_-20px_rgba(7,34,72,0.6)] " +
					"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-deep";

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
