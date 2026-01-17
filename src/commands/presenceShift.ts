import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { DiscordCommand, DiscordCommandExecute } from "../structures/DiscordCommand";
import { getMembers } from "../db/actions/getMembers";
import { addShift, Shift } from "../db/actions/addShift";
import { Presence } from "../db/actions/addShiftParticipants";
import { hasDuplicate } from "../utils/hasDuplicate";
import { mdIntraProfile } from "../utils/stringFormat/mdIntraProfile";
import isISO8601 from "../utils/isISODate";
import { fullDateString } from "../utils/stringFormat/dateFormats";

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

const displayRoleMap: Record<string, string> = {
	cashier: "caissier",
	wrap: "wraps",
	croq: "croque-monsieurs",
	preparation: "découpe",
	versatile: "polyvalent"
};

const displayPeriodMap: Record<string, string> = {
	noon: "midi",
	evening: "soir"
};

function formatPresences(shift: Shift) {
	return shift.presences.map((presence) => `  - ${mdIntraProfile(presence.login)} **-** ${displayRoleMap[presence.role]}`).join("\n")
}

function createShiftEmbed(shift: Shift) {
	const period = shift.date.period;
	return new EmbedBuilder()
		.setTitle(`Présence shift`)
		.setColor(period === "noon" ? "Gold" : "DarkBlue")
		.setDescription(`${mdIntraProfile(shift.referentLogin)} a lancé un shift **${fullDateString(new Date(shift.date.day))}**
- **Periode** : \`\`${displayPeriodMap[shift.date.period]}\`\`
- **Presence** :
			${formatPresences(shift)}`)
		.setFooter({ text: "Coordinateur Discord" });
}

function assertValidShift(shift: Shift) {
	const members = getMembers();
	const presences = shift.presences;

	if (!presences.some(({ login }) => login === shift.referentLogin)) {
		throw new Error("Referent must participate to the shift");
	}
	if (presences.some(({ login }) => !members.includes(login))) {
		throw new Error("Some participants are not members of the **foyer**");
	}
	if (hasDuplicate(presences.map(({ login }) => login))) {
		throw new Error("One member can't have 2 roles on the same shift");
	}
	if (!isISO8601(shift.date.day, { strict: true })) {
		throw new Error("Invalid date, expected **ISO format (aaaa-MM-dd)**");
	}
}

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
	execute,
	async onAutoComplete(interaction) {
		const focused = interaction.options.getFocused();
		const choices = getMembers().sort();
		const filtered = choices.filter((choice) => choice.startsWith(focused));

		filtered.concat(choices.filter((choice) => !choice.startsWith(focused) && choice.includes(focused)));

		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice }))
		);
	}
};

export default presenceShiftCommand;
