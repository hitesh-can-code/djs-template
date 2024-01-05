import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { SlashSubCommandRun, type SlashSubCommandInfo } from "../../../../../back/bases/SlashSubCommand";

export const info: SlashSubCommandInfo = {
    description: 'Remove a prefix to the bot',
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

    if (!db.data[id].includes(prefix)) {
        void interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('400 Bad Request')
                    .setDescription(`Given prefix doesn't exists in our database.`)
                    .setColor('Red')
            ]
        })
        return;
    }

    try {
        const index = db.data[id].indexOf(prefix);
        if (index > -1) { // only splice array when item is found
            db.data[id].splice(index, 1); // 2nd parameter means remove one item only
        }

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
                .setDescription(`Successfully removed given prefix to the bot.`)
                .setColor('Green')
        ]
    })
})