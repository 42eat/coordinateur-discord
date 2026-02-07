import { Shift } from "../../structures/db/ShiftTable";
import { getMembers } from "../../db/actions/members/getMembers";
import { ResponseError } from "../../structures/ResponseError";
import { hasDuplicate } from "../../utils/hasDuplicate";
import isISO8601 from "../../utils/isISODate";

export function assertValidShift(shift: Shift) {
	const members = getMembers();
	const presences = shift.presences;

	const now = new Date()


	if (!members.includes(shift.referentLogin)) {
		throw new ResponseError(`\`\`${shift.referentLogin}\`\` is not member of the **Foyer**.\nIf he should be, use the folowing command to add him.\`\`\`/add-member login:${shift.referentLogin}\`\`\``);
	}
	if (!isISO8601(shift.date.day, { strict: true }) || new Date(shift.date.day) > now) {
		throw new ResponseError(`Are you sure about the date ? Are you having trouble understanding what ISO format is ? 😢\n# ** >>>> yyyy-MM-dd <<<<**\n-# If you need help like a little baby, today is \`\`${new Date().toISOString().slice(0, 10)}\`\``);
	}
	presences.forEach(({ login }) => {
		if (!members.includes(login)) {
			throw new ResponseError(`\`\`${login}\`\` is not member of the **Foyer**.\nIf he should be, use the folowing command to add him.\`\`\`/add-member login:${shift.referentLogin}\`\`\``);
		}
	});
	if (!presences.some(({ login }) => login === shift.referentLogin)) {
		throw new ResponseError("Referent must participate to the shift");
	}
	if (hasDuplicate(presences.map(({ login }) => login))) {
		throw new ResponseError("One member can't have 2 roles on the same shift");
	}
}
