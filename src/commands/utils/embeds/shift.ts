import { EmbedBuilder } from "discord.js";
import { Shift } from "../../../structures/db/ShiftTable";
import { fullDateString } from "../../../utils/stringFormat/dateFormats";
import { mdIntraProfile } from "../../../utils/stringFormat/mdIntraProfile";
import { displayPeriodMap, displayRoleMap } from "./displayMaps";

function formatPresences(shift: Shift) {
	return shift.presences.map((presence) => `  - ${mdIntraProfile(presence.login)} **-** ${displayRoleMap[presence.role]}`).join("\n")
}

export function createShiftEmbed(shift: Shift) {
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
