import { Client, Collection } from "discord.js";
import { DiscordCommand } from "./DiscordCommand";
import { DiscordButton } from "./DiscordButton";
import { buttons } from "../buttons";

export class ExtendedClient extends Client {
	commands: Collection<string, DiscordCommand> = new Collection();
	buttons: Collection<string, DiscordButton> = new Collection();

	constructor(...args: ConstructorParameters<typeof Client>) {
		super(...args);
		buttons.forEach((button) => {
			this.buttons.set(button.name, button)
		})
	}
}
