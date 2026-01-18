import { db } from "../database";

export type DbShift = {
	id: number,
	referrent_id: number,
	date: string,
	period: string,
	exported: number
};

const getShiftDatesStmt = db.prepare<[], Pick<DbShift, "date">>(`--sql
	SELECT date FROM shifts;
`);

export const getShiftDates = db.transaction(() => {
	return getShiftDatesStmt.all().map(({ date }) => date);
});
