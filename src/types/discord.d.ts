import { Collection } from "discord.js";
import { DiscordCommand } from "../structures/DiscordCommand";

declare module "discord.js" {
	export interface Client {
		commands: Collection<string, DiscordCommand>;
	}
}
