import { EmbedBuilder } from "discord.js";
import { Shift } from "../../db/actions/addShift";
import { fullDateString } from "../../utils/stringFormat/dateFormats";
import { mdIntraProfile } from "../../utils/stringFormat/mdIntraProfile";

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