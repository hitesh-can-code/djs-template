import { readdir, stat } from 'node:fs/promises'
import Client from '../Client'
import type { SlashCommand } from '../bases/SlashCommand'
import { ApplicationCommandOptionType, ApplicationCommandType, type ApplicationCommandSubGroupData, type ChatInputApplicationCommandData } from 'discord.js'
import type { SlashSubCommand } from '../bases/SlashSubCommand'
import { URL } from 'node:url'
import { EmbedBuilder } from 'discord.js'
import type { PathLike } from 'fs'


async function loadSlash(path: PathLike, client: Client) {
    try {
        const statFolder = await stat(path)
        if (!statFolder.isDirectory()) {
            throw new Error('Given dir isn\'t a dir')
        }
    } catch (e) {
        throw new Error(
            'Error while reading slash folder. ',
            { cause: e }
        )
    }

    const logger = client.loggers.get('slash')
    const unknownPath = await readdir(path, { withFileTypes: true })
    for (const unknown of unknownPath) {
        if (unknown.isFile()) {
            const { info, run }: SlashCommand = await import(`${path}/${unknown.name}`)
            const name = unknown.name.replace('.ts', '').replace('.js', '')

            client.slash.collection.set(name, { info, run })
            client.slash.discord.push({
                name,
                type: ApplicationCommandType.ChatInput,
                ...info
            })

            logger?.info(`"${name}" command is registered`)
        } else {
            const slash: ChatInputApplicationCommandData = {
                name: unknown.name,
                description: "No description provided",
                type: ApplicationCommandType.ChatInput,
                options: [],
            }
            const unknownPath2 = await readdir(new URL(`slash/${unknown.name}`, path.toString()), { withFileTypes: true })

            for (const unknown2 of unknownPath2) {
                if (unknown2.isFile()) {
                    const { info, run }: SlashSubCommand = await import(`${path}/${unknown.name}/${unknown2.name}`)
                    const name = unknown2.name.replace('.ts', '').replace('.js', '')

                    client.slash.collection.set(`${slash.name}/${name}`, { info, run })
                    // @ts-ignore
                    slash.options?.push({
                        name,
                        type: ApplicationCommandOptionType.Subcommand,
                        ...info
                    })
                    logger?.info(`"${slash.name}/${name}" command is registered`)
                } else {
                    const slash2: ApplicationCommandSubGroupData = {
                        name: unknown2.name,
                        description: "No description provided",
                        type: ApplicationCommandOptionType.SubcommandGroup,
                        options: [],
                    }
                    const unknownPath3 = await readdir(new URL(`slash/${unknown.name}/${unknown2.name}`, path.toString()), { withFileTypes: true })

                    for (const unknown3 of unknownPath3) {
                        if (!unknown3.isFile()) throw new Error(`Folder can't be exists in sub-group folder`)
                        const { info, run }: SlashSubCommand = await import(`${path}/${unknown.name}/${unknown2.name}/${unknown3.name}`)
                        const name = unknown3.name.replace('.ts', '').replace('.js', '')

                        client.slash.collection.set(`${slash.name}/${slash2.name}/${name}`, { info, run })
                        // @ts-ignore
                        slash2.options?.push({
                            name,
                            type: ApplicationCommandOptionType.Subcommand,
                            ...info
                        })
                        logger?.info(`"${slash.name}/${slash2.name}/${name}" command is registered`)
                    }

                    // @ts-ignore
                    slash.options?.push(slash2)
                }
            }

            client.slash.discord.push(slash)
        }
    }

    client.on('interactionCreate', interaction => {
        if (interaction.isChatInputCommand()) {
            const { commandName, options } = interaction
            let name;
            if (options.getSubcommandGroup()) {
                name = `${commandName}/${options.getSubcommandGroup()}/${options.getSubcommand()}`
            } else if (options.getSubcommand()) {
                name = `${commandName}/${options.getSubcommand()}`
            } else {
                name = commandName
            }

            const command = client.slash.collection.get(name)



            if (!command) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('404 Not Found')
                            .setDescription(`This command doesn't exists in our collection`)
                    ]
                })
                return;
            }

            // @ts-ignore
            command.run({
                interaction,
                options,
                client
            })
        }
    })
}

export default loadSlash