import { config } from "dotenv";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { DiscordCommand } from "./structures/DiscordCommand";
import { registerEvents } from "./handler/eventHandler";
import path from "path";
import { loadCommands } from "./handler/commandHandler";

import "./db/database"; // Creates and preloads the database

config({ quiet: true })

process.on("exit", code => { console.log("Process stopped with code : " + code) });
process.on("uncaughtException", (err, origin) => {
	console.error("[UNCAUGHT_EXCEPTION] " + err, "Origine : " + origin);
	console.trace(err);
});
process.on("warning", (warn) => { console.warn("[WARNING]", warn.message) });

async function main() {
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	client.commands = new Collection<string, DiscordCommand>();

	loadCommands(client, path.join(__dirname, "./commands"));
	registerEvents(client, path.join(__dirname, "./events"));

	client.login(process.env.DISCORD_BOT_TOKEN);
}

main();
