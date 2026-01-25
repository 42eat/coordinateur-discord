import { ShiftPresence } from "../../../structures/db/PresencesTable";
import { db } from "../../database";

const getPresenceByIdStmt = db.prepare<{ id: number }, ShiftPresence>(`--sql
	SELECT login, role
	FROM presences p
	JOIN members m ON p.member_id = m.id
	WHERE p.id = @id
`);

export const getPresenceById = db.transaction((id: number) => {
	const result = getPresenceByIdStmt.get({ id });
	if (!result) throw new Error("Presence not found");
	return result;
});

const getPresenceByShiftIdStmt = db.prepare<{ shiftId: number }, ShiftPresence>(`--sql
	SELECT login, role
	FROM presences p
	JOIN members m ON p.member_id = m.id
	WHERE shift_id = @shiftId
`);

export const getPresenceByShiftId = db.transaction((shiftId: number) => {
	return getPresenceByShiftIdStmt.all({ shiftId });
});