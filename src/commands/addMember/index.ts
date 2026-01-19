import { SlashCommandBuilder } from "discord.js"
import { DiscordCommand } from "../../structures/DiscordCommand";
import { insertMember } from "../../db/actions/members/insertMember";

const addMemberCommand: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("add-member")
		.setDescription("Ajoute un member au foyer")
		.addStringOption((opt) => opt.setName("login").setDescription("Login du membre")),
	filters: { admin: true },
	async execute(interaction) {
		const login = interaction.options.getString("login", true)
		insertMember(login);
		interaction.reply({ content: `Member \`\`${login}\`\` was successfully added.`, flags: "Ephemeral" });
	}
}

export default addMemberCommand;
