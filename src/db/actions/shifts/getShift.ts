import { db } from "../../database";
import { Shift, ShiftPeriod } from "../../../structures/db/ShiftTable"
import { getPresenceByShiftId } from "../presences/getPresence";

const getShiftByIdStmt = db.prepare<{ id: number }, { referentLogin: string, date: string, period: ShiftPeriod }>(`--sql
	SELECT login AS referentLogin, date, period
	FROM shifts s
	JOIN members m ON s.referent_id = m.id
	WHERE s.id = @id;
`);

export const getShiftById = db.transaction((id: number) => {
	const shift = getShiftByIdStmt.get({ id });
	if (!shift) throw new Error("Shift id not found");

	const presences = getPresenceByShiftId(id);
	const result: Shift = {
		referentLogin: shift.referentLogin,
		date: {
			day: shift.date,
			period: shift.period
		},
		presences
	};
	return result;
});

const getShiftsByDateStmt = db.prepare<{ date: string }, { id: number, referentLogin: string, date: string, period: ShiftPeriod }>(`--sql
	SELECT s.id, login AS referentLogin, date, period
	FROM shifts s
	JOIN members m ON s.referent_id = m.id
	WHERE date = @date;
`)

export const getShiftsByDate = db.transaction((date: string) => {
	const shift = getShiftsByDateStmt.all({ date });
	if (!shift.length) throw new Error("No shift found for this date");

	return shift.map((shift) => {
		const presences = getPresenceByShiftId(shift.id);
		const result: Shift = {
			referentLogin: shift.referentLogin,
			date: {
				day: shift.date,
				period: shift.period
			},
			presences
		};
		return result;
	});
});
