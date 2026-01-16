import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { DiscordCommand, DiscordCommandExecute } from "../structures/DiscordCommand";
import { getMembers } from "../db/actions/getMembers";
import { addShift, Shift } from "../db/actions/addShift";
import { Participation } from "../db/actions/addShiftParticipants";

function hasDuplicate(arr: string[]) {
	const sorted_arr = arr.slice().sort();
	for (let i = 0; i < sorted_arr.length - 1; i++) {
		if (sorted_arr[i + 1] == sorted_arr[i]) {
			return true;
		}
	}
	return false;
}

function createShiftEmbed(shift: Shift) {
	const period = shift.date.period;
	return new EmbedBuilder()
		.setTitle(`Shift du \`\`${shift.date.day}\`\` ${period === "noon" ? "midi" : "soir"}`)
		.setColor(period === "noon" ? "Blue" : "DarkBlue")
		.setAuthor({ name: "Coordinateur Discord" })
}

const execute: DiscordCommandExecute = async (interaction) => {
	const members = getMembers();

	const referent = interaction.options.getString("referent", true);
	const date = interaction.options.getString("date", true);
	const period = interaction.options.getString("period", true);
	const cashier = interaction.options.getString("caisse");
	const wrap = interaction.options.getString("wrap");
	const croq = interaction.options.getString("croq");
	const versatile = interaction.options.getString("polyvalent");

	const participations: Array<Participation> = []
	if (cashier) participations.push({ login: cashier, role: "cashier" });
	if (wrap) participations.push({ login: wrap, role: "wrap" });
	if (croq) participations.push({ login: croq, role: "croq" });
	if (versatile) participations.push({ login: versatile, role: "versatile" });

	if (!participations.some(({ login }) => login === referent)) {
		interaction.reply({ content: "Referent must participate to the shift", flags: "Ephemeral" });
		return;
	}
	if (participations.some(({ login }) => !members.includes(login))) {
		interaction.reply({ content: "Some participants are not members of the **foyer**", flags: "Ephemeral" });
		return;
	}
	if (hasDuplicate(participations.map(({ login }) => login))) {
		interaction.reply({ content: "One member can't have 2 roles on the same shift", flags: "Ephemeral" });
		return;
	}

	const shift: Shift = {
		referentLogin: referent,
		participations: participations,
		date: {
			day: date,
			period: period
		}
	}

	try {
		addShift(shift);
		interaction.reply({ embeds: [createShiftEmbed(shift)] });
	} catch (error) {
		if (!(error instanceof Error)) throw error;
		interaction.reply({ content: error.message, flags: "Ephemeral" });
	}
}

const presenceShiftCommand: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("presence-shift")
		.setDescription("Ajouter une nouvelle présence shift")
		.addStringOption(opt => opt.setName("referent").setAutocomplete(true).setRequired(true).setDescription("Qui était référent du shift ?"))
		.addStringOption(opt => opt.setName("date").setRequired(true).setDescription("Quel jour (aaaa-MM-dd"))
		.addStringOption(opt => opt.setName("period").setRequired(true).addChoices({ name: "midi", value: "noon" }, { name: "soir", value: "evening" }).setDescription("midi ou soir"))
		.addStringOption(opt => opt.setName("caisse").setAutocomplete(true).setDescription("Qui était à la caisse ?"))
		.addStringOption(opt => opt.setName("wrap").setAutocomplete(true).setDescription("Qui a fait les wraps ?"))
		.addStringOption(opt => opt.setName("croq").setAutocomplete(true).setDescription("Qui a fait les croqs ?"))
		.addStringOption(opt => opt.setName("decoupe").setAutocomplete(true).setDescription("Qui était le commis de service ?")),
	filters: { admin: false },
	execute,
	async onAutoComplete(interaction) {
		const focused = interaction.options.getFocused();
		const choices = getMembers();
		const filtered = choices.filter((choice) => choice.startsWith(focused));

		filtered.concat(choices.filter((choice) => !choice.startsWith(focused) && choice.includes(focused)));

		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice }))
		);
	}
};

export default presenceShiftCommand;
