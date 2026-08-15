"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/content/nav";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { MobileNav } from "./MobileNav";

/** Past this many pixels the header condenses and the promo bar rolls away. */
const CONDENSE_AT = 60;

export function Header() {
	const pathname = usePathname();
	const [condensed, setCondensed] = useState(false);

	useEffect(() => {
		const onScroll = () => setCondensed(window.scrollY > CONDENSE_AT);
		onScroll(); // a refresh mid-page should not start expanded
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const isCurrent = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);

	return (
		<header
			className={`sticky top-0 z-50 bg-paper/90 backdrop-blur-md transition-shadow duration-300 ${
				condensed ? "shadow-[0_10px_30px_-22px_rgba(7,34,72,0.55)]" : "shadow-none"
			}`}
		>
			{/* grid-rows 0fr→1fr collapses the promo bar without animating height on
			    an auto-sized box, so no layout thrash and nothing to measure. */}
			<div
				className={`grid overflow-hidden bg-ink transition-[grid-template-rows] duration-400 ease-out ${
					condensed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
				}`}
			>
				<div className="min-h-0">
					<p className="px-4 py-2.5 text-center font-mono text-xs uppercase tracking-wider text-lime">
						Booking spots filling for month-end moves — reserve yours early
					</p>
				</div>
			</div>

			<div
				className={`flex items-center justify-between px-[5vw] transition-[padding] duration-300 ease-out ${
					condensed ? "py-2.5" : "py-4"
				}`}
			>
				<Link
					href="/"
					className="group font-display text-2xl font-black uppercase text-ink transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-deep"
				>
					Bastuku
					<span className="inline-block text-lime-deep transition-transform duration-300 group-hover:translate-y-[-3px]">
						.
					</span>
				</Link>

				<nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
					{NAV_LINKS.map((l) => (
						<Link
							key={l.href}
							href={l.href}
							aria-current={isCurrent(l.href) ? "page" : undefined}
							className={`u-navlink font-body text-sm font-semibold transition-colors duration-200 hover:text-lime-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-deep ${
								isCurrent(l.href) ? "text-lime-deep" : "text-ink-soft"
							}`}
						>
							{l.label}
						</Link>
					))}
					<a
						href={buildWhatsAppUrl({})}
						target="_blank"
						rel="noopener noreferrer"
						className="group rounded-pill bg-card-tint px-5 py-2.5 font-body text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime hover:shadow-[0_10px_22px_-12px_rgba(7,34,72,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-deep"
					>
						WhatsApp Us
						<span
							aria-hidden="true"
							className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1"
						>
							&rarr;
						</span>
					</a>
				</nav>

				<MobileNav />
			</div>
		</header>
	);
}
