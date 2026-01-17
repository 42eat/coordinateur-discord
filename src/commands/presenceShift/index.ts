import { SlashCommandBuilder } from "discord.js";
import { addShift, Shift } from "../../db/actions/addShift";
import { Presence } from "../../db/actions/addShiftParticipants";
import { DiscordCommand, DiscordCommandExecute } from "../../structures/DiscordCommand";
import { createShiftEmbed } from "./createShiftEmbed";
import { onAutoComplete } from "./onAutoComplete";
import { assertValidShift } from "./assertValidShift";

const slashCommand = new SlashCommandBuilder()
	.setName("presence-shift")
	.setDescription("Ajouter une nouvelle présence shift")
	.addStringOption(opt => opt.setName("referent").setAutocomplete(true).setRequired(true).setDescription("Qui était référent du shift ?"))
	.addStringOption(opt => opt.setName("date").setRequired(true).setDescription("Quel jour **au format ISO (aaaa-MM-dd)**"))
	.addStringOption(opt => opt.setName("period").setRequired(true).addChoices({ name: "midi", value: "noon" }, { name: "soir", value: "evening" }).setDescription("midi ou soir ?"))
	.addStringOption(opt => opt.setName("caisse").setAutocomplete(true).setDescription("Qui était à la caisse ?"))
	.addStringOption(opt => opt.setName("wrap").setAutocomplete(true).setDescription("Qui a fait les wraps ?"))
	.addStringOption(opt => opt.setName("croq").setAutocomplete(true).setDescription("Qui a fait les croqs ?"))
	.addStringOption(opt => opt.setName("decoupe").setAutocomplete(true).setDescription("Qui était le commis de service ?"))
	.addStringOption(opt => opt.setName("polyvalent").setAutocomplete(true).setDescription("Qui était le branle-couille ?"))

const execute: DiscordCommandExecute = async (interaction) => {

	const referent = interaction.options.getString("referent", true);
	const date = interaction.options.getString("date", true);
	const period = interaction.options.getString("period", true);
	const cashier = interaction.options.getString("caisse");
	const wrap = interaction.options.getString("wrap");
	const croq = interaction.options.getString("croq");
	const preparation = interaction.options.getString("decoupe");
	const versatile = interaction.options.getString("polyvalent");

	const presences: Array<Presence> = []
	if (cashier) presences.push({ login: cashier, role: "cashier" });
	if (wrap) presences.push({ login: wrap, role: "wrap" });
	if (croq) presences.push({ login: croq, role: "croq" });
	if (preparation) presences.push({ login: preparation, role: "preparation" });
	if (versatile) presences.push({ login: versatile, role: "versatile" });

	try {
		const shift: Shift = {
			referentLogin: referent,
			presences: presences,
			date: {
				day: date,
				period: period
			}
		}
		assertValidShift(shift)
		addShift(shift);
		interaction.reply({ embeds: [createShiftEmbed(shift)] });
	} catch (error) {
		if (!(error instanceof Error)) throw error;
		interaction.reply({ content: error.message, flags: "Ephemeral" });
	}
}

const presenceShiftCommand: DiscordCommand = {
	data: slashCommand,
	filters: { admin: false },
	execute: execute,
	onAutoComplete: onAutoComplete
};

export default presenceShiftCommand;
