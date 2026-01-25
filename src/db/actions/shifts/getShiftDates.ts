import { ShiftTableRow } from "../../../structures/db/ShiftTable";
import { db } from "../../database";

const getShiftDatesStmt = db.prepare<[], Pick<ShiftTableRow, "date">>(`--sql
	SELECT DISTINCT date FROM shifts;
`);

export const getShiftDates = db.transaction(() => {
	return getShiftDatesStmt.all().map(({ date }) => date);
});
