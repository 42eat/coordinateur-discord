
import { DiscordButton } from "../structures/DiscordButton";
import { deleteMessageButton } from "./deleteMessage";
import { removePresenceButton } from "./removePresence";

export function createButton<T extends readonly string[]>(config: DiscordButton<T>) {
	return config;
}

export const buttons = [
	removePresenceButton,
	deleteMessageButton
] satisfies Array<DiscordButton>;
