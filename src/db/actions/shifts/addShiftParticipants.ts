import { db } from "../../database";
import { getMemberId } from "../members/getMembers";
import { ShiftPresence, PresenceRole } from "../../../structures/db/PresencesTable";

const insertPresenceStmt = db.prepare<{ memberId: number, shiftId: number | bigint, role: PresenceRole }>(`--sql
	INSERT INTO presences (member_id, shift_id, role) VALUES (@memberId, @shiftId, @role)
`);

export const addShiftParticipants = db.transaction((shiftId: number | bigint, presences: ShiftPresence[]) => {
	presences.forEach((presence) => {
		const participantId = getMemberId(presence.login);
		insertPresenceStmt.run({ memberId: participantId, shiftId, role: presence.role });
	});
})
