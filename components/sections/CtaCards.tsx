import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * The four-card CTA row from `legacy/bastuku-full-flow.html:343-348`.
 * The concept used <button>s that went nowhere; each is a real destination here.
 */
const CARDS: { label: string; caption: string; href: string; external?: boolean }[] = [
	{ label: "Book Now", caption: "Start your move today", href: "/quote" },
	{ label: "Get a Quote", caption: "See rough pricing first", href: "/quote" },
	{ label: "For Business", caption: "Recurring office logistics", href: "/for-business" },
	{
		label: "WhatsApp Us",
		caption: "Chat with us in minutes",
		href: buildWhatsAppUrl({}),
		external: true,
	},
];

export function CtaCards() {
	return (
		<div className="grid grid-cols-2 gap-4 px-[5vw] pb-14 lg:grid-cols-4">
			{CARDS.map((c) => {
				const inner = (
					<>
						<span className="flex justify-center bg-card-tint px-4 py-6">
							<span className="rounded-pill bg-ink px-5 py-3 font-body text-sm font-bold text-amber-bright">
								{c.label}
							</span>
						</span>
						<span className="block bg-white px-3 pb-5 pt-4 text-center font-body text-[13.5px] font-medium text-ink-soft">
							{c.caption}
						</span>
					</>
				);
				const className =
					"block overflow-hidden rounded-2xl shadow-[0_18px_34px_-18px_rgba(22,32,42,0.35)] " +
					"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brick";

				return c.external ? (
					<a
						key={c.label}
						href={c.href}
						target="_blank"
						rel="noopener noreferrer"
						className={className}
					>
						{inner}
					</a>
				) : (
					<Link key={c.label} href={c.href} className={className}>
						{inner}
					</Link>
				);
			})}
		</div>
	);
}
