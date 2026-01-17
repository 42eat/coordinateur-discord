export function fullDateString(date: Date) {
	const result = Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
	if (date.getDate() === 1) {
		return result.replace('1', '1er');
	}
	return result;
}