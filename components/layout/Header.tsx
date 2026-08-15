import Link from "next/link";
import { NAV_LINKS } from "@/content/nav";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { MobileNav } from "./MobileNav";

export function Header() {
	return (
		<header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md">
			<div className="bg-ink px-4 py-2.5 text-center font-mono text-xs uppercase tracking-wider text-lime">
				Booking spots filling for month-end moves — reserve yours early
			</div>
			<div className="flex items-center justify-between px-[5vw] py-4">
				<Link href="/" className="font-display text-2xl font-black uppercase text-ink">
					Bastuku<span className="text-lime-deep">.</span>
				</Link>

				<nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
					{NAV_LINKS.map((l) => (
						<Link
							key={l.href}
							href={l.href}
							className="font-body text-sm font-semibold text-ink-soft hover:text-lime-deep"
						>
							{l.label}
						</Link>
					))}
					<a
						href={buildWhatsAppUrl({})}
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-pill bg-card-tint px-5 py-2.5 font-body text-sm font-bold text-ink hover:bg-card-tint/70"
					>
						WhatsApp Us
					</a>
				</nav>

				<MobileNav />
			</div>
		</header>
	);
}
