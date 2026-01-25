import Database from "better-sqlite3";

export const db = new Database("database.db");

db.pragma("foreign_keys = ON");

db.prepare(`--sql
	CREATE TABLE IF NOT EXISTS members (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		login TEXT UNIQUE
	)
`).run();

db.prepare(`--sql
	CREATE TABLE IF NOT EXISTS shifts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		referent_id INTEGER NOT NULL,
		date TEXT NOT NULL,
		period TEXT NOT NULL,
		exported INTEGER NOT NULL DEFAULT 0,
		FOREIGN KEY(referent_id) REFERENCES members(id) ON DELETE CASCADE,
		UNIQUE(date, period)
	)
`).run();

db.prepare(`--sql
	CREATE TABLE IF NOT EXISTS presences (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		member_id INTEGER NOT NULL,
		shift_id INTEGER NOT NULL,
		role TEXT NOT NULL,
		FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE,
		FOREIGN KEY(shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
		UNIQUE(member_id, shift_id) -- A member can't be two times on the same shift
	)
`).run();
