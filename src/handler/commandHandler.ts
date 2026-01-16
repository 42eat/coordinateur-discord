import { Client } from "discord.js";
import path from "path";
import { DiscordCommand } from "../structures/DiscordCommand";
import { BOLD, GREEN, RESET } from "../logHelper/ansiColors";
import fs from "fs";

export function loadCommands(client: Client, dir: string) {
	const entries = fs.readdirSync(dir);

	for (const fileName of entries) {
		const file = path.join(dir, fileName);
		const stats = fs.statSync(file);

		if (stats.isDirectory()) {
			loadCommands(client, file);
		} else {
			const command: DiscordCommand = require(file).default;
			console.log(`[${BOLD}${GREEN}CMD${RESET}] loading:`, command.data.name);
			client.commands.set(command.data.name, command);
		}
	}
}
