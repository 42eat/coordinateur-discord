import { SqliteError } from "better-sqlite3";
import { db } from "../../database";
import { addShiftParticipants } from "./addShiftParticipants";
import { getMemberId } from "../members/getMembers";
import { ResponseError } from "../../../structures/ResponseError";
import { Shift, ShiftDate, ShiftPeriod } from "../../../structures/db/ShiftTable";

const insertShiftStmt = db.prepare<{ referentId: number, date: string, period: ShiftPeriod }, { id: number }>(`--sql
	INSERT INTO shifts (referent_id, date, period) VALUES (@referentId, @date, @period)
`);

export const insertShift = db.transaction((referentId: number, date: ShiftDate) => {
	try {
		return insertShiftStmt.run({ referentId, date: date.day, period: date.period })
	} catch (error) {
		if (!(error instanceof SqliteError)) throw error;
		if (error.code !== "SQLITE_CONSTRAINT_UNIQUE") throw error;
		throw new ResponseError("There is already a shift registered at this date and period combination");
	}
});

export const addShift = db.transaction((shift: Shift) => {
	const referentId = getMemberId(shift.referentLogin);
	const shiftId = insertShift(referentId, shift.date).lastInsertRowid;
	addShiftParticipants(shiftId, shift.presences);
})
