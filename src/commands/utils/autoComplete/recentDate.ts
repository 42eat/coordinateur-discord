import { AutocompleteInteraction } from "discord.js";

async function onInvalidInput(interaction: AutocompleteInteraction) {
	return await interaction.respond([]);
}

function getNearestDates(prefix: string) {
	const today = new Date();

	const splittedDate = prefix.split("-");

	const startYear = parseInt(splittedDate[0].padEnd(4, "0"));
	const endYear = Math.min(parseInt(splittedDate[0].padEnd(4, "9")), today.getFullYear());


	let startDay: number;
	let endDay: number;
	if (splittedDate[2]) {
		startDay = Math.max(parseInt(splittedDate[2].padEnd(4, "0")), 1);
		endDay = Math.min(parseInt(splittedDate[2].padEnd(4, "9")), 31);
	} else {
		startDay = 1;
		endDay = 31;
	}

	const result: string[] = [];

	for (let year = endYear; year >= startYear; year--) {
		let startMonth: number;
		let endMonth: number;
		if (splittedDate[1]) {
			startMonth = Math.max(parseInt(splittedDate[1].padEnd(4, "0")), 1);
			if (year === today.getFullYear()) {
				endMonth = Math.min(parseInt(splittedDate[1].padEnd(4, "9")), today.getMonth() + 1);
			} else {
				endMonth = Math.min(parseInt(splittedDate[1].padEnd(4, "9")), 12);
			}
		} else {
			startMonth = 1;
			endMonth = 12;
		}
		for (let month = endMonth; month >= startMonth; month--) {
			for (let day = endDay; day >= startDay; day--) {
				const date = new Date(year, month - 1/* month is indexed to 0 in js Date */, day);
				if (date.getDate() === day) {
					result.push(date.toISOString().substring(0, 10));
				}
				if (result.length >= 5) return result;
			}
		}
	}
	return result;
}

const isoProgressiveRgx = /^(\d(\d(\d(\d(-(\d(\d(-(\d(\d)?)?)?)?)?)?)?)?)?)?$/; // HELP ME

export async function onNewDateAutoComplete(interaction: AutocompleteInteraction) {
	const focused = interaction.options.getFocused();
	if (!isoProgressiveRgx.test(focused)) {
		await onInvalidInput(interaction);
		return;
	}

	await interaction.respond(
		getNearestDates(focused).map(choice => ({ name: choice, value: choice }))
	);
}
