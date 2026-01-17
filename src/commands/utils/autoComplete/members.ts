import { AutocompleteInteraction } from "discord.js";
import { getMembers } from "../../../db/actions/members/getMembers";

export async function onMemberAutocomplete(interaction: AutocompleteInteraction) {
	const focused = interaction.options.getFocused();
	const choices = getMembers().sort();
	const filtered = choices
		.filter((choice) => choice.startsWith(focused))
		.concat(choices.filter((choice) => !choice.startsWith(focused) && choice.includes(focused)))
		.filter((choice) => choice.length <= 100)
		.slice(0, 25); // Hard limit of elements that can be send for autocomplete

	await interaction.respond(
		filtered.map(choice => ({ name: choice, value: choice }))
	);
}
