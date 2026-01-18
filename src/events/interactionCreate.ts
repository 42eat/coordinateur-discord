import { Interaction } from "discord.js";
import { DiscordEvent } from "../structures/DiscordEvent";
import { ResponseError } from "../structures/ResponseError";

async function onInteractionError(interaction: Interaction, error: Error) {
	if (interaction.isRepliable() && !interaction.replied) {
		if (error instanceof ResponseError) {
			if (interaction.deferred) {
				await interaction.editReply({ content: error.message });
			} else {
				await interaction.reply({ content: error.message, flags: "Ephemeral" });
			}
			return;
		}
		await interaction.reply({ content: "An error occured :(", flags: "Ephemeral" });
	}
	throw error;
}

export default {
	name: "interactionCreate",
	once: false,
	async execute(interaction) {
		const client = interaction.client;
		try {
			if (interaction.isChatInputCommand()) {
				const command = client.commands.get(interaction.commandName);
				if (!command) throw new Error("Command interaction not in collection");
				return await command.execute(interaction)
			} else if (interaction.isAutocomplete()) {
				const command = client.commands.get(interaction.commandName);
				if (!command) throw new Error("Command interaction not in collection");
				if (!command.onAutoComplete) throw new Error("No autocomplete could be loaded");
				await command.onAutoComplete(interaction);
			} else if (interaction.isRepliable()) {
				await interaction.reply({ content: "Cannot find interaction :(", flags: "Ephemeral" });
			}
		} catch (error) {
			if (!(error instanceof Error)) throw error;
			return await onInteractionError(interaction, error);
		}
	}
} satisfies DiscordEvent<"interactionCreate">;
