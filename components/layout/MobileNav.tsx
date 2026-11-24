"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/content/nav";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function MobileNav() {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	// Close on navigation. Adjusted during render rather than in an effect, so
	// the open panel never paints for a frame on the new page.
	const [lastPath, setLastPath] = useState(pathname);
	if (pathname !== lastPath) {
		setLastPath(pathname);
		setOpen(false);
	}

	// Close on Escape.
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open]);

	// The panel unmounts on close rather than animating out. Keeping it mounted
	// would leave links inside an aria-hidden container, which the a11y e2e test
	// forbids; an exit animation is not worth that trade.
	return (
		<div className="lg:hidden">
			<button
				type="button"
				aria-expanded={open}
				aria-controls="mobile-nav"
				aria-label={open ? "Close menu" : "Open menu"}
				onClick={() => setOpen((v) => !v)}
				className="flex h-11 w-11 items-center justify-center rounded-pill bg-card-tint transition-colors duration-200 hover:bg-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-deep"
			>
				{/* Three bars that fold into a cross. Decorative: the button already
				    carries the accessible name. */}
				<span aria-hidden="true" className="relative block h-3.5 w-5">
					{[0, 1, 2].map((i) => (
						<span
							key={i}
							className={`absolute left-0 block h-[2px] w-full rounded-full bg-ink transition-all duration-300 ease-out ${
								i === 0
									? open
										? "top-1.5 rotate-45"
										: "top-0 rotate-0"
									: i === 1
										? open
											? "top-1.5 opacity-0"
											: "top-1.5 opacity-100"
										: open
											? "top-1.5 -rotate-45"
											: "top-3 rotate-0"
							}`}
						/>
					))}
				</span>
			</button>

			{open && (
				<nav
					id="mobile-nav"
					aria-label="Main"
					className="absolute left-0 right-0 top-full flex origin-top flex-col gap-1 bg-paper px-[5vw] py-4 shadow-[0_24px_40px_-24px_rgba(7,34,72,0.6)]"
					style={{ animation: "rise 0.28s cubic-bezier(0.22,0.61,0.36,1) both" }}
				>
					{NAV_LINKS.map((l, i) => {
						const current = pathname === l.href || pathname.startsWith(`${l.href}/`);
						return (
							<Link
								key={l.href}
								href={l.href}
								aria-current={current ? "page" : undefined}
								className={`u-rise border-b border-ink/10 py-3 font-body text-base font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-deep ${
									current ? "text-lime-deep" : "text-ink"
								}`}
								style={{ animationDelay: `${60 + i * 45}ms` }}
							>
								{l.label}
							</Link>
						);
					})}
					<a
						href={buildWhatsAppUrl({})}
						target="_blank"
						rel="noopener noreferrer"
						className="u-rise mt-3 rounded-pill bg-lime px-5 py-3 text-center font-body text-sm font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-deep"
						style={{ animationDelay: `${60 + NAV_LINKS.length * 45}ms` }}
					>
						WhatsApp Us
					</a>
				</nav>
			)}
		</div>
	);
}
