import { DiscordEvent } from "../structures/DiscordEvent";

export default {
	name: "guildCreate",
	once: true,
	async execute(guild) {
		const client = guild.client;
		console.log(`Joined guild as ${client.user.tag}`);
		guild.commands.set(client.commands.map((command) => command.data));
	}
} satisfies DiscordEvent<"guildCreate">;
