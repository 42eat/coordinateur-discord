import { ClientEvents } from "discord.js";

export interface DiscordEvent<K extends keyof ClientEvents = keyof ClientEvents> {
	name: K,
	once: boolean,
	execute: (...args: ClientEvents[K]) => Promise<void> | void;
}
