import { DiscordEvent } from "../structures/DiscordEvent";

export default {
	name: "clientReady",
	once: true,
	async execute(client) {
		console.log(`Logged in as ${client.user.tag}`);
		const adminGuild = client.guilds.cache.get(process.env.DISCORD_ADMIN_GUILD_ID);
		if (!adminGuild) return;
		adminGuild.commands.set(client.commands.map((command) => command.data));
	}
} satisfies DiscordEvent<"clientReady">;
