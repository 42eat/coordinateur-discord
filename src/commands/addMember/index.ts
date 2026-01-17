import { SlashCommandBuilder } from "discord.js"
import { DiscordCommand } from "../../structures/DiscordCommand";
import { insertMember } from "../../db/actions/insertMember";

const addMemberCommand: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("add-member")
		.setDescription("Add a member to the shift peoples")
		.addStringOption((opt) => opt.setName("login").setDescription("New member's login")),
	filters: { admin: true },
	async execute(interaction) {
		try {
			const login = interaction.options.getString("login", true)
			insertMember(login);
			interaction.reply({ content: `Member \`\`${login}\`\` was successfully added.`, flags: "Ephemeral" });
		} catch (error) {
			if (!(error instanceof Error)) throw error;
			interaction.reply({ content: error.message, flags: "Ephemeral" });
		}
	}
}

export default addMemberCommand;
