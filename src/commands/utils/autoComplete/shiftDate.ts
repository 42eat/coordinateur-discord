import { AutocompleteInteraction } from "discord.js";
import { getShiftDates } from "../../../db/actions/getShiftDates";

export async function onShiftDateAutocomplete(interaction: AutocompleteInteraction) {
	const focused = interaction.options.getFocused();
	const choices = getShiftDates().sort();
	const filtered = choices
		.filter((choice) => choice.startsWith(focused))
		.reverse()
		.slice(0, 25); // Hard limit of elements that can be send for autocomplete

	await interaction.respond(
		filtered.map(choice => ({ name: choice, value: choice }))
	);
}
