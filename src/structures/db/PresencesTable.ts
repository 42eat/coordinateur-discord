export interface PresencesTableRow {
	id: number,
	member_id: number,
	shift_id: number,
	role: PresenceRole
}

export type PresenceRole = string;

export interface ShiftPresence {
	login: string,
	role: PresenceRole
};
