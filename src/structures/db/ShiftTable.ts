import { ShiftPresence } from "./PresencesTable";

export interface ShiftTableRow {
	id: number,
	referrent_id: number,
	date: string,
	period: ShiftPeriod,
	exported: number
};

export type ShiftPeriod = string;

export interface Shift {
	referentLogin: string,
	date: ShiftDate,
	presences: Array<ShiftPresence>
}

export interface ShiftDate {
	day: string,
	period: ShiftPeriod
}

