import { EmbedBuilder } from 'discord.js'
import { PrefixCommandRun, type PrefixCommandInfo } from "../../back/bases/PrefixCommand";

export const info: PrefixCommandInfo = {
    name: 'ping',
    description: 'Get the bot latency',
    arguments: [
        {
            min: 0,
            max: -1,
        },
        [],
    ]
}

export const run = PrefixCommandRun(({ message, client }) => {
    void message.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Pong!')
                .setColor('DarkButNotBlack')
                .setDescription(`> API Latency: ${client.ws.ping}`),
        ],
    });
})