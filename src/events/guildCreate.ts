import { DiscordEvent } from "../structures/DiscordEvent";

export default {
	name: "guildCreate",
	once: true,
	async execute(guild) {
		const client = guild.client;
		console.log(`Joined guild as ${client.user.tag}`);
		let commands;
		if (guild.id === process.env.DISCORD_ADMIN_GUILD_ID) {
			commands = client.commands.filter((command) => command.filters.admin).map((command) => command.data);
		} else {
			commands = client.commands.map((command) => command.data);
		}
		guild.commands.set(commands);
	}
} satisfies DiscordEvent<"guildCreate">;
