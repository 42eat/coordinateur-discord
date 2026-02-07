import { Shift } from "../../structures/db/ShiftTable";
import { getMembers } from "../../db/actions/members/getMembers";
import { ResponseError } from "../../structures/ResponseError";
import { hasDuplicate } from "../../utils/hasDuplicate";
import isISO8601 from "../../utils/isISODate";

export function assertValidShift(shift: Shift) {
	const members = getMembers();
	const presences = shift.presences;

	const now = new Date()

	if (!isISO8601(shift.date.day, { strict: true }) || new Date(shift.date.day) > now) {
		throw new ResponseError(`Are you sure about the date ? Freaking ISO format is that hard to understand ?\n# ** >>>> yyyy-MM-dd <<<<**\n-# today is \`\`${new Date().toISOString().slice(0, 10)}\`\``);
	}
	if (!presences.some(({ login }) => login === shift.referentLogin)) {
		throw new ResponseError("Referent must participate to the shift");
	}
	if (presences.some(({ login }) => !members.includes(login))) {
		throw new ResponseError("Some participants are not members of the **foyer**");
	}
	if (hasDuplicate(presences.map(({ login }) => login))) {
		throw new ResponseError("One member can't have 2 roles on the same shift");
	}
}
