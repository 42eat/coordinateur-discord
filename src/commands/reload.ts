import { SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../structures/DiscordCommand";

const reloadCommand: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("reload")
		.setDescription("Reload every commands of the client"),
	filters: { admin: true },
	async execute(interaction) {
		const client = interaction.client;

		const adminGuild = client.guilds.cache.get(process.env.DISCORD_ADMIN_GUILD_ID);
		if (adminGuild) await adminGuild.commands.set(client.commands.map((command) => command.data));

		const publicGuilds = client.guilds.cache.filter((guild) => guild.id !== process.env.DISCORD_ADMIN_GUILD_ID);
		const publicCommandsData = client.commands.filter((commands) => !commands.filters.admin).map((command) => command.data);
		interaction.deferReply();
		const commandSetpromises = publicGuilds.map((guild) => {
			return guild.commands.set(publicCommandsData);
		});
		await Promise.all(commandSetpromises);
		interaction.reply("Commands reloaded");
	}
};

export default reloadCommand;
