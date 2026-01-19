import { ShiftPeriod } from "../../structures/db/ShiftTable";
import { db } from "../database";

const getLastExportablePresencesStmt = db.prepare<[], { login: string, date: string, period: ShiftPeriod }>(`--sql
	SELECT login, date, period
	FROM presences p
	JOIN members m ON m.id = p.member_id
	JOIN shifts s ON s.id = p.shift_id
	WHERE exported = 0;
`);

const setLastExportablePresencesAsExportedStmt = db.prepare(`--sql
	UPDATE shifts
	SET exported = 1
	WHERE exported = 0;
`);

export const getLastExportablePresences = db.transaction(() => {
	const result = getLastExportablePresencesStmt.all();
	setLastExportablePresencesAsExportedStmt.run();
	return result
});

const getExportablePresencesSinceStmt = db.prepare<{ targetDate: string }, { login: string, date: string, period: ShiftPeriod }>(`--sql
	SELECT login, date, period
	FROM presences p
	JOIN members m ON m.id = p.member_id
	JOIN shifts s ON s.id = p.shift_id
	WHERE date >= @targetDate;
`);

export const getExportablePresencesSince = db.transaction((targetDate: string) => {
	return getExportablePresencesSinceStmt.all({ targetDate });
});

