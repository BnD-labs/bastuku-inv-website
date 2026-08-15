"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates its children in when they scroll into view.
 *
 * The resting state is **visible**, and JS only hides ("arms") an element that
 * is already below the fold at mount. That ordering matters: an approach that
 * rests hidden and waits for JS to reveal leaves the page blank until hydration
 * finishes, which on a slow phone is seconds of empty screen — and this site's
 * audience is largely on mobile. Nothing the user can currently see is ever
 * hidden, so a slow, failed, or disabled script degrades to a static page
 * rather than an empty one.
 *
 * The trade is that content above the fold does not animate. That is deliberate:
 * the hero runs its own load-time stagger, and animating what is already on
 * screen would fight it.
 *
 * `as` keeps the wrapper semantically neutral — a grid item passes "li" so no
 * invalid element appears between <ul> and its children.
 */
export function Reveal({
	children,
	delay = 0,
	className = "",
	as: Tag = "div",
}: {
	children: React.ReactNode;
	/** Stagger offset in ms. Keep under ~400 or the last item feels detached. */
	delay?: number;
	className?: string;
	as?: "div" | "li" | "span";
}) {
	const ref = useRef<HTMLElement>(null);
	const [armed, setArmed] = useState(false);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (typeof IntersectionObserver === "undefined") return;
		if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

		// Arm only what is *entirely* below the fold. Anything with even a sliver
		// on screen is left alone: hiding it would blank a visible strip, and the
		// observer's 0.1 threshold would not fire to bring it back until a scroll.
		if (el.getBoundingClientRect().top < window.innerHeight) return;

		setArmed(true);

		const io = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				setVisible(true);
				io.disconnect(); // once only — re-animating on scroll-back is nauseating
			},
			{ threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	return (
		<Tag
			ref={ref as never}
			className={`u-reveal ${className}`}
			data-armed={armed ? "true" : undefined}
			data-visible={visible ? "true" : undefined}
			style={armed && delay ? { transitionDelay: `${delay}ms` } : undefined}
		>
			{children}
		</Tag>
	);
}
