import { db } from "../../database";

const getShiftMessageIdStmt = db.prepare<{ id: number }, { discordMessageId: string }>(`--sql
	SELECT discord_message_id as discordMessageId FROM shifts WHERE id = @id
`)

export const getShiftMessageId = db.transaction((id: number) => {
	const result = getShiftMessageIdStmt.get({ id });
	if (!result) throw new Error("Shift id not found");
	return result.discordMessageId;
});
