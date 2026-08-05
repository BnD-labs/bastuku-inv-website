"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/content/nav";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function MobileNav() {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	// Close on navigation.
	useEffect(() => setOpen(false), [pathname]);

	// Close on Escape.
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open]);

	return (
		<div className="lg:hidden">
			<button
				type="button"
				aria-expanded={open}
				aria-controls="mobile-nav"
				aria-label={open ? "Close menu" : "Open menu"}
				onClick={() => setOpen((v) => !v)}
				className="rounded-pill bg-card-tint px-4 py-2.5 font-body text-sm font-bold text-ink"
			>
				{open ? "Close" : "Menu"}
			</button>

			{open && (
				<nav
					id="mobile-nav"
					aria-label="Main"
					className="absolute left-0 right-0 top-full flex flex-col gap-1 bg-paper px-[5vw] py-4 shadow-lg"
				>
					{NAV_LINKS.map((l) => (
						<Link
							key={l.href}
							href={l.href}
							className="border-b border-ink/10 py-3 font-body text-base font-semibold text-ink"
						>
							{l.label}
						</Link>
					))}
					<a
						href={buildWhatsAppUrl({})}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-3 rounded-pill bg-amber px-5 py-3 text-center font-body text-sm font-bold text-ink"
					>
						WhatsApp Us
					</a>
				</nav>
			)}
		</div>
	);
}
