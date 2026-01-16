import { db } from "../database";

const insertMemberStmt = db.prepare<{ login: string }>(`--sql
	INSERT INTO members (login) VALUES (@login)
`);

export function insertMember(login: string) {
	insertMemberStmt.run({ login });
}
