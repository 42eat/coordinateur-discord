import { SqliteError } from "better-sqlite3";
import { db } from "../database";
import { ResponseError } from "../../structures/ResponseError";

const insertMemberStmt = db.prepare<{ login: string }>(`--sql
	INSERT INTO members (login) VALUES (@login)
`);

export function insertMember(login: string) {
	try {
		return insertMemberStmt.run({ login });
	} catch (error) {
		if (!(error instanceof SqliteError)) throw error;
		if (error.code !== "SQLITE_CONSTRAINT_UNIQUE") throw error;
		throw new ResponseError("This member is already registered");
	}
}
