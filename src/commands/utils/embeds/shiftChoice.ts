import { EmbedBuilder } from "discord.js";
import { Shift } from "../../../structures/db/ShiftTable";
import { fullDateString } from "../../../utils/stringFormat/dateFormats";
import { mdIntraProfile } from "../../../utils/stringFormat/mdIntraProfile";
import { displayPeriodMap, displayRoleMap } from "./displayMaps";

function formatPresences(shift: Shift) {
	return shift.presences.map((presence) => `  - ${mdIntraProfile(presence.login)} **-** ${displayRoleMap[presence.role]}`).join("\n")
}

function formatShifts(shifts: Array<Shift>) {
	return shifts.map((shift) => `Shift du **${fullDateString(new Date(shift.date.day))}** par ${mdIntraProfile(shift.referentLogin)}
- **Periode** : \`\`${displayPeriodMap[shift.date.period]}\`\`
- **Presence** :
            ${formatPresences(shift)}`).join("\n")
}

export function createShiftChoiceEmbed(shifts: Array<Shift>) {
	return new EmbedBuilder()
		.setTitle(`Présence shift`)
		.setColor("DarkRed")
		.setDescription(formatShifts(shifts))
		.setFooter({ text: "Coordinateur Discord" });
}
