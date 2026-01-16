declare namespace NodeJS {
	interface ProcessEnv {
		DISCORD_BOT_TOKEN: string
		DISCORD_ADMIN_GUILD_ID: string
		NODE_ENV: "development" | "production"
	}
}
