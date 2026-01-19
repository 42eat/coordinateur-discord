import { db } from "../../database";
import { ShiftTableRow } from "../../../structures/db/ShiftTable"

const getShiftDatesStmt = db.prepare<[], Pick<ShiftTableRow, "date">>(`--sql
	SELECT date FROM shifts;
`);

export const getShiftDates = db.transaction(() => {
	return getShiftDatesStmt.all().map(({ date }) => date);
});
