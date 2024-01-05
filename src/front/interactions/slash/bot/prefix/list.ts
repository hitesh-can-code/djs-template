import { EmbedBuilder } from "discord.js";
import { SlashSubCommandRun, type SlashSubCommandInfo } from "../../../../../back/bases/SlashSubCommand";

export const info: SlashSubCommandInfo = {
    description: 'Shows the bot\'s prefixes',
}

export const run = SlashSubCommandRun(({ interaction, client }) => {
    const db = client.db.prefix
    const id = interaction.guildId as string

    void interaction.reply({
        embeds: [
            new EmbedBuilder()
            .setTitle('Prefixes Available:')
            .setDescription(db.data[id].map((val: string) => `> ${val}`).join('\n'))
            .setColor('DarkButNotBlack')
        ]
    })
})