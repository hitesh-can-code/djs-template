import { SlashCommandRun, type SlashCommandInfo } from "../back/bases/SlashCommand";

export const info: SlashCommandInfo = {
    description: 'An test command.',
}

export const run = SlashCommandRun(({ interaction }) => {
    interaction.reply("👍")
})