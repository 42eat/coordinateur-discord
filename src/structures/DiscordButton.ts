import { ButtonBuilder, ButtonInteraction } from "discord.js";

export interface DiscordButton<T extends readonly string[] = readonly string[]> {
	name: string,
	setupButton: (buttonBuilder: ButtonBuilder, ...payload: T) => ButtonBuilder,
	execute: (interaction: ButtonInteraction, ...payload: T) => Promise<void>
}
