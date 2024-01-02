import { EmbedBuilder } from "discord.js";
import { SlashSubCommandRun, type SlashSubCommand } from "../../../../back/bases/SlashSubCommand";

export const info: SlashSubCommand = {
    description: 'Give bot latency'
}

export const run = SlashSubCommandRun(({ interaction, client }) => {
    interaction.reply({
        embeds:[
            new EmbedBuilder()
                .setTitle('Pong!')
                .setColor('DarkButNotBlack')
                .setDescription(`> API Latency: ${client.ws.ping}`)
        ]
    })
}) 