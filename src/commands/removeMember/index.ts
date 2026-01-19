import { SlashCommandBuilder } from "discord.js"
import { DiscordCommand } from "../../structures/DiscordCommand";
import { deleteMember } from "../../db/actions/members/removeMember";
import { onMemberAutocomplete } from "../utils/autoComplete/members";

const removeMemberCommand: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName("remove-member")
		.setDescription("Supprime un membre du foyer")
		.addStringOption((opt) => opt.setName("login").setRequired(true).setAutocomplete(true).setDescription("Member to remove")),
	filters: { admin: true },
	async execute(interaction) {
		const login = interaction.options.getString("login", true);
		deleteMember(login);
		interaction.reply({ content: `Member \`\`${login}\`\` was successfully removed.`, flags: "Ephemeral" });
	},
	onAutoComplete: onMemberAutocomplete
}

export default removeMemberCommand;
