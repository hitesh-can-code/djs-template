import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { SlashSubCommandRun, type SlashSubCommandInfo } from "../../../../../back/bases/SlashSubCommand";

export const info: SlashSubCommandInfo = {
    description: 'Add a prefix to the bot',
    options: [
        {
            name: 'prefix',
            description: "Give prefix to the server",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
}

export const run = SlashSubCommandRun(async ({ interaction, client, options }) => {
    const prefix = options.getString('prefix', true)
    const db = client.db.prefix
    const id = interaction.guildId as string


    try {
        db.data[id].push(prefix)
        db.write()
    } catch (error) {
        void interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('500 Internal Server Error')
                    .setDescription(`${error}`)
                    .setColor('Red')
            ]
        })
        return; 
    }
    

    void interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('200 OK')
                .setDescription(`Successfully added given prefix to the bot.`)
                .setColor('Green')
        ]
    })
})