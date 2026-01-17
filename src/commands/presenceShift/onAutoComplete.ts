import { AutocompleteInteraction } from "discord.js";
import { getMembers } from "../../db/actions/getMembers";

export async function onAutoComplete(interaction: AutocompleteInteraction) {
	const focused = interaction.options.getFocused();
	const choices = getMembers().sort();
	const filtered = choices.filter((choice) => choice.startsWith(focused));

	filtered.concat(choices.filter((choice) => !choice.startsWith(focused) && choice.includes(focused)));

	await interaction.respond(
		filtered.map(choice => ({ name: choice, value: choice }))
	);
}
