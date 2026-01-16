export function hasDuplicate(arr: any[]) {
	const sorted = arr.slice().sort();
	for (let i = 0; i < sorted.length - 1; i++) {
		if (sorted[i + 1] === sorted[i]) {
			return true;
		}
	}
	return false;
}