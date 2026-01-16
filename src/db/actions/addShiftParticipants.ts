import { db } from "../database";
import { getMemberId } from "./getMembers";

export interface Participation {
	login: string,
	role: string
};

const insertParticipationStmt = db.prepare<{ memberId: number, shiftId: number | bigint, role: string }>(`--sql
	INSERT INTO participations (member_id, shift_id, role) VALUES (@memberId, @shiftId, @role)
     ON CONFLICT(member_id, shift_id) DO UPDATE SET role = excluded.role
`);

export const addShiftParticipants = db.transaction((shiftId: number | bigint, participations: Participation[]) => {
	participations.forEach((participation) => {
		const participantId = getMemberId(participation.login);
		insertParticipationStmt.run({ memberId: participantId, shiftId, role: participation.role });
	});
})
