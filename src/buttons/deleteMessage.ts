import { ButtonBuilder, ButtonStyle } from "discord.js";
import { joinCustomId } from "../utils/buttons/joinCustomId";
import { createButton } from ".";

export const deleteMessageButton = createButton({
	name: "delete-message",
	setupButton() {
		return new ButtonBuilder()
			.setCustomId(joinCustomId(this.name))
			.setStyle(ButtonStyle.Secondary)
			.setEmoji("❌");
	},
	async execute(interaction) {
		await interaction.message.delete();
	}
});
