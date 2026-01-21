import { Client, Collection } from "discord.js";
import { DiscordCommand } from "./DiscordCommand";

export class ExtendedClient extends Client {
	commands: Collection<string, DiscordCommand> = new Collection();
}
