import { Shift } from "../../db/actions/addShift";
import { getMembers } from "../../db/actions/getMembers";
import { hasDuplicate } from "../../utils/hasDuplicate";
import isISO8601 from "../../utils/isISODate";

export function assertValidShift(shift: Shift) {
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
