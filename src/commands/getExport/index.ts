import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import { DiscordCommand } from "../../structures/DiscordCommand";
import { getExportablePresencesSince, getLastExportablePresences } from "../../db/actions/getExportable";
import { ResponseError } from "../../structures/ResponseError";
import { onShiftDateAutocomplete } from "../utils/autoComplete/shiftDate";
import { ShiftPeriod } from "../../structures/db/ShiftTable";

async function execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		const date = interaction.options.getString("since");
		let exportedPresences: Array<{ login: string, date: string, period: ShiftPeriod }>;
		if (date) {
			exportedPresences = getExportablePresencesSince(date);
		} else {
			exportedPresences = getLastExportablePresences();
		}

		if (!exportedPresences.length) {
			if (date) {
				throw new ResponseError("Aucun shift n'a été noté depuis cette date");
			} else {
				throw new ResponseError("Il ne reste aucun shift à exporter");
			}
			return;
		}

		const loginFileText = exportedPresences.map(({ login }) => login).join("\n");
		const loginFileRaw = Buffer.from(loginFileText, "utf-8");
		const loginFile = new AttachmentBuilder(loginFileRaw, { name: "logins.csv" });

		const dateFileText = exportedPresences.map(({ date, period }) => `${date} ${period === "noon" ? "12:00" : "20:00"}`).join("\n");
		const dateFileRaw = Buffer.from(dateFileText, "utf-8");
		const dateFile = new AttachmentBuilder(dateFileRaw, { name: "dates.csv" });

		interaction.editReply({
			content: "Vos exports sont prêts !",
			files: [loginFile, dateFile]
		});
	}

const pingCommand: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("export-shifts")
		.setDescription("Exporte des fichiers csv à importer dans la fiche d'activité de 42 Lyon")
		.addStringOption(opt => opt.setName("depuis").setAutocomplete(true).setDescription("Date (aaaa-MM-dd) à partir desquels le shifs seront exportés")),
	filters: { admin: false },
	execute: execute,
	onAutoComplete: onShiftDateAutocomplete
}

export default pingCommand;
