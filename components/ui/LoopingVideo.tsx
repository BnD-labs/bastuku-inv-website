"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
	src: string;
	poster: string;
	/** Read out like an image's alt text; the clip is muted and has no captions to give. */
	alt: string;
	width: number;
	height: number;
	className?: string;
}

/**
 * A muted, looping clip that behaves like a photo until it is worth playing.
 *
 *   - preload="none" and no autoPlay attribute: nothing downloads until the
 *     clip scrolls into view, so it never competes with the page's own load.
 *   - Paused off screen, so a phone isn't decoding video nobody can see.
 *   - Never starts for anyone who prefers reduced motion; they get the poster
 *     and can press play.
 *   - Always has a pause button: WCAG 2.2.2 requires one for motion that
 *     starts on its own and runs longer than five seconds.
 */
export function LoopingVideo({ src, poster, alt, width, height, className = "" }: Props) {
	const ref = useRef<HTMLVideoElement>(null);
	const [playing, setPlaying] = useState(false);
	// Set once the visitor presses pause, so scrolling back doesn't override them.
	const userPaused = useRef(false);

	useEffect(() => {
		const video = ref.current;
		if (!video) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (reduce.matches) userPaused.current = true;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !userPaused.current) {
					// play() rejects if the browser blocks it (data saver, low power);
					// the poster is a fine thing to be left with.
					video.play().catch(() => {});
				} else {
					video.pause();
				}
			},
			{ threshold: 0.25 }
		);
		observer.observe(video);
		return () => observer.disconnect();
	}, []);

	const toggle = () => {
		const video = ref.current;
		if (!video) return;
		if (video.paused) {
			userPaused.current = false;
			video.play().catch(() => {});
		} else {
			userPaused.current = true;
			video.pause();
		}
	};

	return (
		<div className={`relative overflow-hidden ${className}`}>
			<video
				ref={ref}
				src={src}
				poster={poster}
				width={width}
				height={height}
				muted
				loop
				playsInline
				preload="none"
				aria-label={alt}
				onPlay={() => setPlaying(true)}
				onPause={() => setPlaying(false)}
				className="h-full w-full object-cover"
			/>
			<button
				type="button"
				onClick={toggle}
				aria-label={playing ? "Pause video" : "Play video"}
				className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-paper backdrop-blur-sm transition-colors duration-200 hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
			>
				{playing ? (
					<svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
						<rect x="3" y="2" width="3.5" height="12" rx="1" />
						<rect x="9.5" y="2" width="3.5" height="12" rx="1" />
					</svg>
				) : (
					<svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
						<path d="M4 2.5v11a1 1 0 0 0 1.5.86l9-5.5a1 1 0 0 0 0-1.72l-9-5.5A1 1 0 0 0 4 2.5Z" />
					</svg>
				)}
			</button>
		</div>
	);
}
