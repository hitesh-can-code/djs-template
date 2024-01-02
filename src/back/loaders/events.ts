import { readdir, stat } from 'node:fs/promises'
import type { PathLike } from 'fs'
import type { Event } from '../bases/Event'
import type Client from '../Client'
import { EmbedBuilder } from 'discord.js'

async function loadEvents(path: PathLike, client: Client) {
    try {
        const statFolder = await stat(path)
        if(!statFolder.isDirectory()) {
            throw new Error("Given dir isn't a dir.")
        }
    } catch (e) {
        throw new Error('Error while reading events. ', { cause: e })
    }

    const logger = client.loggers.get('events')
    const files = await readdir(path, { recursive: true })
    for (const file of files) {
        const event: Event = await import(`${path}/${file}`)
        
        // @ts-ignore
        client[event.info.once ? 'once' : 'on'](
            event.info.name,
            event.run
        )

        const msg = event.info.nick ? `${event.info.name}(${event.info.nick})` : event.info.name
        logger?.info(`"${msg}" is registered`)
    }
    
    client.on('interactionCreate', interaction => {
        if(interaction.isCommand()) {
            const { commandName } = interaction
            const command = client.slash.collection.get(commandName)

            if(!command) {
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
                options: interaction.options,
                client
            })
        }
    })
}

export default loadEvents