import { Interaction } from "discord.js";
import { DiscordEvent } from "../structures/DiscordEvent";

async function onInteractionError(interaction: Interaction, error: Error) {
	if (interaction.isRepliable() && !interaction.replied) {
		await interaction.reply({
			content: "An error occured :(",
			flags: "Ephemeral"
		});
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
				return command.execute(interaction)
			} else if (interaction.isAutocomplete()) {
				const command = client.commands.get(interaction.commandName);
				if (!command) throw new Error("Command interaction not in collection");
				if (!command.onAutoComplete) throw new Error("No autocomplete could be loaded");
				command.onAutoComplete(interaction);
			} else if (interaction.isRepliable()) {
				interaction.reply({ content: "Cannot find interaction :(", flags: "Ephemeral" });
			}
		} catch (error) {
			if (!(error instanceof Error)) throw error;
			return onInteractionError(interaction, error);
		}
	}
} satisfies DiscordEvent<"interactionCreate">;
