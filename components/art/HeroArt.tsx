/**
 * Decorative hero illustration, ported from the concept
 * (`legacy/bastuku-full-flow.html:294-331`).
 *
 * Purely presentational: hidden from assistive technology so screen readers
 * announce the headline, not a wall of unlabelled shapes.
 */
export function HeroArt() {
	return (
		<svg
			viewBox="0 0 1600 760"
			width="100%"
			height="100%"
			preserveAspectRatio="xMidYMid slice"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			role="presentation"
			focusable="false"
		>
			<defs>
				<linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#EFE9DA" />
					<stop offset="100%" stopColor="#DCD3BC" />
				</linearGradient>
				<linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor="#F3EFE6" stopOpacity="1" />
					<stop offset="45%" stopColor="#F3EFE6" stopOpacity="0.55" />
					<stop offset="100%" stopColor="#F3EFE6" stopOpacity="0" />
				</linearGradient>
			</defs>
			<rect width="1600" height="760" fill="url(#skyGrad)" />
			<rect y="560" width="1600" height="200" fill="#B8AF97" />
			<rect y="600" width="1600" height="10" fill="#F3EFE6" opacity="0.5" />
			<g stroke="#F3EFE6" strokeWidth="8" strokeDasharray="40 30" opacity="0.6">
				<line x1="0" y1="640" x2="1600" y2="640" />
			</g>
			<g transform="translate(880,410)">
				<rect x="0" y="60" width="230" height="120" rx="10" fill="#16202A" />
				<rect x="230" y="90" width="120" height="90" rx="8" fill="#B24C32" />
				<rect x="248" y="105" width="55" height="45" rx="4" fill="#E8A33D" opacity="0.85" />
				<circle cx="60" cy="190" r="26" fill="#0E1620" />
				<circle cx="60" cy="190" r="11" fill="#E7E1D2" />
				<circle cx="290" cy="190" r="26" fill="#0E1620" />
				<circle cx="290" cy="190" r="11" fill="#E7E1D2" />
				<rect x="20" y="80" width="70" height="45" rx="4" fill="#5B8C7B" opacity="0.5" />
				<rect x="100" y="80" width="70" height="45" rx="4" fill="#E8A33D" opacity="0.4" />
			</g>
			<path
				d="M 60 300 C 300 250, 500 420, 880 460"
				fill="none"
				stroke="#5B8C7B"
				strokeWidth="5"
				strokeDasharray="4 16"
				strokeLinecap="round"
				opacity="0.7"
			/>
			<circle cx="60" cy="300" r="9" fill="#16202A" />
			<circle cx="880" cy="460" r="9" fill="#B24C32" />
			<g transform="translate(1140,470)">
				<rect x="0" y="0" width="70" height="70" rx="4" fill="#E8A33D" opacity="0.9" />
				<rect x="80" y="20" width="55" height="50" rx="4" fill="#5B8C7B" opacity="0.8" />
			</g>
			<rect width="900" height="760" fill="url(#fade)" />
		</svg>
	);
}
