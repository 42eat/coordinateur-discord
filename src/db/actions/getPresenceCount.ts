import { PresenceRole } from "../../structures/db/PresencesTable";
import { db } from "../database";

const getRoleCountStmt = db.prepare<{ login: string, role: PresenceRole }, { count: number }>(`--sql
    SELECT COUNT(*) AS count
    FROM presences p
    JOIN members m ON m.id = p.member_id
    WHERE m.login = @login
      AND p.role = @role
`);

export const getRoleCount = db.transaction((login: string, role: PresenceRole) => {
	return getRoleCountStmt.get({ login, role })!.count;
});

const getPresenceCountStmt = db.prepare<{ login: string }, { count: number }>(`--sql
    SELECT COUNT(*) AS count
    FROM presences p
    JOIN members m ON m.id = p.member_id
    WHERE m.login = @login
`);

export const getPresenceCount = db.transaction((login: string) => {
	return getPresenceCountStmt.get({ login })!.count;
});
