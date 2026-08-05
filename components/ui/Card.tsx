export function Card({ className = "", ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={`rounded-2xl bg-paper p-7 text-ink shadow-[0_18px_34px_-18px_rgba(22,32,42,0.35)] ${className}`}
			{...props}
		/>
	);
}
