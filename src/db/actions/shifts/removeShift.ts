import { SqliteError } from "better-sqlite3";
import { db } from "../../database";
import { ResponseError } from "../../../structures/ResponseError";
import { ShiftPeriod } from "../../../structures/db/ShiftTable";

const deleteShiftStmt = db.prepare<{ date: string, period: ShiftPeriod }>(`--sql
    DELETE FROM shifts WHERE date = @date AND period = @period
`);

const deleteShiftByIdStmt = db.prepare<{ id: number }>(`--sql
    DELETE FROM shifts WHERE id = @id
`);

export const deleteShift = db.transaction((date: string, period: ShiftPeriod) => {
	try {
		const info = deleteShiftStmt.run({ date, period });
		if (info.changes === 0) throw new ResponseError(`No ${period} shift on ${date}`);
		return info;
	} catch (error) {
		if (!(error instanceof SqliteError)) throw error;
		throw new Error("Error while deleting shift", { cause: error });
	}
});

export const deleteShiftById = db.transaction((id: number) => {
	try {
		const info = deleteShiftByIdStmt.run({ id });
		if (info.changes === 0) throw new ResponseError("Member not found");
		return info;
	} catch (error) {
		if (!(error instanceof SqliteError)) throw error;
		throw new Error("Error while deleting shift", { cause: error });
	}
})
