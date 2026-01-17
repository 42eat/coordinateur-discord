import { AutocompleteInteraction } from "discord.js";
import { getMembers } from "../../db/actions/getMembers";

export async function onAutoComplete(interaction: AutocompleteInteraction) {
	const focused = interaction.options.getFocused();
	const choices = getMembers().sort();
	let filtered = choices.filter((choice) => choice.startsWith(focused));

	filtered = filtered.concat(choices.filter((choice) => !choice.startsWith(focused) && choice.includes(focused)));
	filtered = filtered.slice(0, 25); // Hard limit of elements that can be send for autocomplete

	await interaction.respond(
		filtered.map(choice => ({ name: choice, value: choice }))
	);
}
