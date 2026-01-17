import { db } from "../database";
import { getMemberId } from "./members/getMembers";

export interface Presence {
	login: string,
	role: string
};

const insertPresenceStmt = db.prepare<{ memberId: number, shiftId: number | bigint, role: string }>(`--sql
	INSERT INTO presences (member_id, shift_id, role) VALUES (@memberId, @shiftId, @role)
`);

export const addShiftParticipants = db.transaction((shiftId: number | bigint, presences: Presence[]) => {
	presences.forEach((presence) => {
		const participantId = getMemberId(presence.login);
		insertPresenceStmt.run({ memberId: participantId, shiftId, role: presence.role });
	});
})
