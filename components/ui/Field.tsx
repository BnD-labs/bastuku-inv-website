export function Field({
	label,
	htmlFor,
	error,
	children,
}: {
	label: string;
	htmlFor: string;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={htmlFor} className="font-body text-sm font-semibold text-ink">
				{label}
			</label>
			{children}
			{error && (
				<p id={`${htmlFor}-error`} role="alert" className="font-body text-sm text-danger">
					{error}
				</p>
			)}
		</div>
	);
}
