import type { ServiceIconName } from "@/content/services";

/*
 * Line icons for the services, replacing the emoji placeholders. Emoji render
 * differently on every phone (and as empty boxes on some older Android builds),
 * so they read as unfinished. These are drawn on a 24px grid with a 1.75px
 * stroke in currentColor, so each icon takes the colour of the text around it.
 */
const PATHS: Record<ServiceIconName, React.ReactNode> = {
	house: (
		<>
			<path d="M3 10.5 12 3l9 7.5" />
			<path d="M5.5 9v12h13V9" />
			<path d="M10 21v-6h4v6" />
		</>
	),
	office: (
		<>
			<rect x="5" y="3" width="14" height="18" rx="1" />
			<path d="M9 7.5h2M13 7.5h2M9 11.5h2M13 11.5h2M9 15.5h2M13 15.5h2" />
		</>
	),
	// A border line with a route crossing it: over the border, by road.
	border: (
		<>
			<path d="M12 3v3M12 10v4M12 18v3" />
			<path d="M3 12h17" />
			<path d="m16.5 8.5 3.5 3.5-3.5 3.5" />
		</>
	),
	globe: (
		<>
			<circle cx="12" cy="12" r="9" />
			<path d="M3 12h18" />
			<path d="M12 3c2.5 2.6 3.75 5.6 3.75 9S14.5 18.4 12 21c-2.5-2.6-3.75-5.6-3.75-9S9.5 5.6 12 3Z" />
		</>
	),
	container: (
		<>
			<rect x="2.5" y="6.5" width="19" height="11" rx="1" />
			<path d="M7 6.5v11M12 6.5v11M17 6.5v11" />
		</>
	),
	box: (
		<>
			<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5Z" />
			<path d="m3 7.5 9 4.5 9-4.5M12 12v9" />
		</>
	),
	// A pitched-roof shed with pallets stacked inside.
	warehouse: (
		<>
			<path d="M2.5 9 12 4l9.5 5v11.5h-19Z" />
			<path d="M6.5 20.5v-8h11v8" />
			<path d="M9 16.5h6M9 18.5h6" />
		</>
	),
	truck: (
		<>
			<path d="M2.5 5.5h11v10.5h-11Z" />
			<path d="M13.5 9h4l3.5 3.5V16h-7.5" />
			<circle cx="7" cy="17.5" r="1.75" />
			<circle cx="17" cy="17.5" r="1.75" />
		</>
	),
};

export function ServiceIcon({ name, className = "h-6 w-6" }: { name: ServiceIconName; className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.75}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			focusable="false"
			className={className}
		>
			{PATHS[name]}
		</svg>
	);
}
