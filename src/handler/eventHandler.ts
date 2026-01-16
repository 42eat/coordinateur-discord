import fs from "fs";
import path from "path";
import { Client } from "discord.js";
import { DiscordEvent } from "../structures/DiscordEvent";
import { BOLD, PURPLE, RESET } from "../logHelper/ansiColors";

export function registerEvents(client: Client, dir: string) {
	const entries = fs.readdirSync(dir);

	for (const fileName of entries) {
		const file = path.join(dir, fileName);
		const stats = fs.statSync(file);

		if (stats.isDirectory()) {
			registerEvents(client, file);
		} else {
			const event: DiscordEvent = require(file).default;
			console.log(`[${BOLD}${PURPLE}EVT${RESET}] registering:`, event.name);
			if (event.once) {
				client.once(event.name, event.execute);
			} else {
				client.on(event.name, event.execute);
			}
		}
	}
}
