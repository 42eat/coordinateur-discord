import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../../structures/DiscordCommand";
import { onShiftDateAutocomplete } from "../utils/autoComplete/shiftDate";
import { getShiftsByDate } from "../../db/actions/shifts/getShift";
import { createShiftChoiceEmbed } from "../utils/embeds/shiftChoice";
import { displayPeriodMap } from "../utils/embeds/displayMaps";
import { removePresenceButton } from "../../buttons/removePresence";
import { deleteMessageButton } from "../../buttons/deleteMessage";

const reloadCommand: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("remove-presence")
		.addStringOption(opt => opt.setName("date").setRequired(true).setAutocomplete(true).setDescription("Date du shift"))
		.setDescription("Supprime une présence shift"),
	filters: { admin: false },
	async execute(interaction) {
		const date = interaction.options.getString("date", true);

		const shifts = getShiftsByDate(date);

		const buttons: Array<ButtonBuilder> = [];

		for (const shift of shifts) {
			buttons.push(
				removePresenceButton
					.setupButton(new ButtonBuilder(), shift.id.toString())
					.setLabel(displayPeriodMap[shift.date.period])
			);
		}

		buttons.push(
			deleteMessageButton
				.setupButton(new ButtonBuilder())
				.setLabel("Annuler")
		)

		const component = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)
		interaction.reply({
			embeds: [createShiftChoiceEmbed(shifts)],
			components: [component]
		})
	},
	onAutoComplete: onShiftDateAutocomplete
};

export default reloadCommand;
