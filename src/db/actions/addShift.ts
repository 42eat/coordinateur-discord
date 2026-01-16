import { db } from "../database";
import { addShiftParticipants, Participation } from "./addShiftParticipants";
import { getMemberId } from "./getMembers";

export interface Shift {
	referentLogin: string,
	date: ShiftDate,
	participations: Array<Participation>
}

export interface ShiftDate {
	day: string,
	period: string
}

const insertShiftStmt = db.prepare<{ referentId: number, date: string, period: string }, { id: number }>(`--sql
	INSERT INTO shifts (referent_id, date, period) VALUES (@referentId, @date, @period)
`);

export const insertShift = db.transaction((referentId: number, date: ShiftDate) => {
	return insertShiftStmt.run({ referentId, date: date.day, period: date.period })
});

export const addShift = db.transaction((shift: Shift) => {
	const referentId = getMemberId(shift.referentLogin);
	const shiftId = insertShift(referentId, shift.date).lastInsertRowid;
	addShiftParticipants(shiftId, shift.participations);
})
