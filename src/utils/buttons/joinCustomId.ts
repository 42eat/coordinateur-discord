export function joinCustomId(...args: readonly string[]) {
	const customId = args.join(":");
	if ([...customId].filter((s) => s === ":").length !== args.length - 1) {
		throw new Error("Invalid customId: payload must not contain ':' as it breaks parsing. Format: \"<name>:<payload0>:<payload1>:<payloadN>\". Max length is 100 characters.");
	}
	if (customId.length > 100) {
		throw new Error("Invalid customId: length exceeds 100 characters.");
	}
	if (customId.length > 90) {
		console.warn(`Risky customId: ${customId.length}/100 characters used. Future payload changes may exceed the limit.`);
	}
	return customId;
}
