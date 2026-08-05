"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { SERVICES } from "@/content/services";

export function ServicePicker() {
	const [active, setActive] = useState(0);
	const stageRef = useRef<HTMLDivElement>(null);

	const clamp = (i: number) => Math.max(0, Math.min(SERVICES.length - 1, i));

	// Scoped to the stage — NOT window. The concept's bug was binding globally.
	function onKeyDown(e: React.KeyboardEvent) {
		if (e.key === "ArrowRight") {
			e.preventDefault();
			setActive((i) => clamp(i + 1));
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			setActive((i) => clamp(i - 1));
		}
	}

	return (
		<div className="flex flex-col items-center">
			{/*
			 * APG carousel, not a tablist: these tiles have no separate panels —
			 * each tile *is* its content — and the active one contains a link, which
			 * `role="option"` would forbid. `aria-live` announces slide changes.
			 */}
			<div
				ref={stageRef}
				role="region"
				aria-roledescription="carousel"
				aria-label="Our services"
				aria-live="polite"
				tabIndex={0}
				onKeyDown={onKeyDown}
				className="relative flex h-[460px] w-full items-center justify-center [perspective:1400px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
			>
				{SERVICES.map((s, i) => {
					const offset = i - active;
					const abs = Math.abs(offset);
					const dir = Math.sign(offset);
					const isActive = abs === 0;

					const style = isActive
						? { transform: "none", opacity: 1, zIndex: 50 }
						: {
								transform: `translateX(${dir * (150 + (abs - 1) * 90)}px) translateZ(${
									-160 - (abs - 1) * 60
								}px) rotateY(${dir * -42}deg) scale(${0.82 - (abs - 1) * 0.08})`,
								opacity: abs > 2 ? 0 : 1 - abs * 0.28,
								zIndex: 50 - abs,
							};

					return (
						<div
							key={s.slug}
							role="group"
							aria-roledescription="slide"
							aria-label={`${i + 1} of ${SERVICES.length}: ${s.name}`}
							id={`svc-slide-${s.slug}`}
							// Off-stage slides are hidden from AT. They render no link, so
							// this never hides focusable content.
							aria-hidden={abs > 2}
							onClick={() => setActive(i)}
							style={style}
							className="absolute flex h-[400px] w-[300px] flex-col rounded-2xl bg-paper p-7 text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none"
						>
							<div className="mb-5 flex h-13 w-13 items-center justify-center rounded-xl bg-card-tint text-2xl">
								<span aria-hidden="true">{s.icon}</span>
							</div>
							<h3 className="mb-3 font-display text-2xl font-extrabold uppercase leading-none">
								{s.name}
							</h3>
							<p className="flex-1 font-body text-sm leading-relaxed text-ink-soft/85">{s.summary}</p>
							{isActive && (
								<Link
									href={`/services/${s.slug}`}
									className="mt-4 rounded-pill bg-ink px-5 py-3 text-center font-body text-sm font-bold text-amber-bright"
								>
									{s.cta} →
								</Link>
							)}
						</div>
					);
				})}
			</div>

			<div className="mt-6 flex gap-2.5">
				{SERVICES.map((s, i) => (
					<button
						key={s.slug}
						type="button"
						aria-label={`Show ${s.name}`}
						aria-controls={`svc-slide-${s.slug}`}
						aria-current={i === active}
						onClick={() => setActive(i)}
						className={`h-2.5 w-2.5 rounded-full transition-transform ${
							i === active ? "scale-125 bg-amber-bright" : "bg-paper/25"
						}`}
					/>
				))}
			</div>
		</div>
	);
}
