export function formatKwacha(amount: number): string {
	return `K${Math.round(amount).toLocaleString("en-US")}`;
}
