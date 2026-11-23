"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/content/nav";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { MobileNav } from "./MobileNav";

/*
 * The header must never change its own height on scroll. It used to collapse
 * the promo bar and shrink its padding past 60px, but a sticky header still
 * takes up space in the page, so shrinking it pulled the page up, and the
 * browser's scroll anchoring moved scrollY back across the threshold. The
 * header then flipped open and shut on its own (54 flips in 6s on /quote), so
 * it glitched whenever someone scrolled back up near the top.
 *
 * Now the promo bar sits outside the sticky header and scrolls away with the
 * page, and scrolling only toggles the shadow, which does not affect layout.
 */
export function Header() {
	const pathname = usePathname();
	const promoRef = useRef<HTMLDivElement>(null);
	const [stuck, setStuck] = useState(false);

	useEffect(() => {
		// The nav pins once the promo bar has scrolled out of view.
		const onScroll = () => setStuck(window.scrollY >= (promoRef.current?.offsetHeight ?? 0));
		onScroll(); // a refresh mid-page should start with the shadow on
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const isCurrent = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);

	return (
		<>
			<div ref={promoRef} className="bg-ink">
				<p className="px-4 py-2.5 text-center font-mono text-xs uppercase tracking-wider text-lime">
					Booking spots filling for month-end moves — reserve yours early
				</p>
			</div>

			<header
				className={`sticky top-0 z-50 bg-paper/90 backdrop-blur-md transition-shadow duration-300 ${
					stuck ? "shadow-[0_10px_30px_-22px_rgba(7,34,72,0.55)]" : "shadow-none"
				}`}
			>
				<div className="flex items-center justify-between px-[5vw] py-3">
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
		</>
	);
}
