import { SqliteError } from "better-sqlite3";
import { db } from "../../database";
import { ResponseError } from "../../../structures/ResponseError";

const deleteMemberStmt = db.prepare<{ login: string }>(`--sql
    DELETE FROM members WHERE login = @login
`);

const deleteMemberByIdStmt = db.prepare<{ id: number }>(`--sql
    DELETE FROM members WHERE id = @id
`);

export function deleteMember(login: string) {
    try {
        const info = deleteMemberStmt.run({ login });
        if (info.changes === 0) throw new ResponseError(`Can't find member \`\`${login}\`\``);
        return info;
    } catch (error) {
		if (!(error instanceof SqliteError)) throw error;
		console.log(error)
        throw new Error("Error while deleting member");
    }
}

export function deleteMemberById(id: number) {
    try {
        const info = deleteMemberByIdStmt.run({ id });
        if (info.changes === 0) throw new ResponseError("Member not found");
        return info;
    } catch (error) {
        if (!(error instanceof SqliteError)) throw error;
        throw new Error("Error while deleting member");
    }
}