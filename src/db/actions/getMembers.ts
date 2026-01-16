import { db } from "../database";

const getMembersStmt = db.prepare<[], { login: string }>(`--sql
	SELECT login FROM members
`);

export const getMembers = db.transaction(() => {
	return getMembersStmt.all().map((entry) => entry.login);
});

const getMemberIdStmt = db.prepare<{ login: string }, { id: number }>(`--sql
	SELECT id FROM members WHERE login = @login
`);

export const getMemberId = db.transaction((login: string) => {
	const memberRow = getMemberIdStmt.get({ login })
	if (!memberRow) {
		throw new Error(`Can't find member : ${login}`);
	}
	return memberRow.id;
});