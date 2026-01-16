import { SlashCommandBuilder } from "discord.js"
import { DiscordCommand } from "../structures/DiscordCommand";

const pingCommand: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("🏓"),
	filters: { admin: false },
	async execute(interaction) {
		interaction.reply("Pong !");
	}
}

export default pingCommand;
