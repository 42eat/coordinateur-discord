import { config } from "dotenv";
import { GatewayIntentBits } from "discord.js";
import { registerEvents } from "./handler/eventHandler";
import path from "path";
import { loadCommands } from "./handler/commandHandler";

import "./db/database"; // Creates and preloads the database
import { ExtendedClient } from "./structures/ExtendedClient";

config({ quiet: true })

process.on("exit", code => { console.log("Process stopped with code : " + code) });
process.on("uncaughtException", (err, origin) => {
	console.error("[UNCAUGHT_EXCEPTION] " + err, "Origine : " + origin);
	console.trace(err);
});
process.on("warning", (warn) => { console.warn("[WARNING]", warn.message) });

async function main() {
	const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds] });

	loadCommands(client, path.join(__dirname, "./commands"));
	registerEvents(client, path.join(__dirname, "./events"));

	client.login(process.env.DISCORD_BOT_TOKEN);
}

main();
