import Link from "next/link";
import { SITE } from "@/content/site";
import { SERVICES } from "@/content/services";
import { NAV_LINKS } from "@/content/nav";

export function Footer() {
	return (
		<footer className="bg-ink px-[6vw] py-16 text-paper">
			<div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-4">
				<div>
					<p className="font-display text-2xl font-black uppercase">
						Bastuku<span className="text-brick">.</span>
					</p>
					<p className="mt-4 font-body text-sm leading-relaxed text-paper/65">
						Logistics and supply solutions in {SITE.city}, {SITE.country}, since {SITE.foundedYear}.
					</p>
				</div>

				<nav aria-label="Footer">
					<h2 className="font-mono text-xs uppercase tracking-wider text-amber-bright">Company</h2>
					<ul className="mt-4 flex flex-col gap-2">
						{NAV_LINKS.map((l) => (
							<li key={l.href}>
								<Link href={l.href} className="font-body text-sm text-paper/65 hover:text-paper">
									{l.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<nav aria-label="Services">
					<h2 className="font-mono text-xs uppercase tracking-wider text-amber-bright">Services</h2>
					<ul className="mt-4 flex flex-col gap-2">
						{SERVICES.map((s) => (
							<li key={s.slug}>
								<Link
									href={`/services/${s.slug}`}
									className="font-body text-sm text-paper/65 hover:text-paper"
								>
									{s.name}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<div>
					<h2 className="font-mono text-xs uppercase tracking-wider text-amber-bright">Contact</h2>
					<ul className="mt-4 flex flex-col gap-2 font-body text-sm text-paper/65">
						<li>
							{SITE.city}, {SITE.country}
						</li>
						<li>
							<a href={`tel:${SITE.phoneE164}`} className="hover:text-paper">
								{SITE.phoneDisplay}
							</a>
						</li>
						<li>
							<a href={`mailto:${SITE.email}`} className="hover:text-paper">
								{SITE.email}
							</a>
						</li>
					</ul>
				</div>
			</div>

			<div className="mx-auto mt-12 max-w-6xl border-t border-paper/15 pt-8 text-center font-body text-sm text-paper/50">
				© {SITE.foundedYear}–{new Date().getFullYear()} {SITE.legalName}. All rights reserved.
			</div>
		</footer>
	);
}
