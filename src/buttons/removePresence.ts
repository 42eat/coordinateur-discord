import { ButtonStyle } from "discord.js"
import { joinCustomId } from "../utils/buttons/joinCustomId";
import { deleteShiftById } from "../db/actions/shifts/removeShift";
import { DiscordButton } from "../structures/DiscordButton";
import { createButton } from ".";
import { getShiftMessageId } from "../db/actions/shifts/getShiftMessageId";

export const removePresenceButton = createButton({
	name: "remove-presence",
	setupButton(button, shiftId) {
		return button
			.setCustomId(joinCustomId(this.name, shiftId))
			.setStyle(ButtonStyle.Danger)
			.setEmoji("🚮");
	},
	async execute(interaction, shiftId) {
		const presenceMessageId = getShiftMessageId(parseInt(shiftId));
		deleteShiftById(parseInt(shiftId));
		const message = await interaction.channel?.messages.fetch(presenceMessageId);
		await message?.delete()
		await interaction.reply({ content: "Shift was removed", flags: "Ephemeral" });
		await interaction.message.delete();
	}
}) satisfies DiscordButton;
