import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";

export type DiscordCommandExecute = (interaction: ChatInputCommandInteraction) => Promise<void>

export interface DiscordCommand {
	data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
	filters: { admin: boolean }
	execute: DiscordCommandExecute
	onAutoComplete?: (interaction: AutocompleteInteraction) => Promise<void>
}
