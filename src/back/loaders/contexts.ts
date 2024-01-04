import { readdir, stat } from 'node:fs/promises'
import type { PathLike } from 'fs'
import type Client from '../Client'
import type { UserContext } from '../bases/UserContext'
import type { MessageContext } from '../bases/MessageContext'
import { ApplicationCommandType } from 'discord.js'

async function loadContexts(path: PathLike, client: Client) {
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

    const logger = client.loggers.get('context')
    const files = await readdir(path, { withFileTypes: true })
    for (const file of files) {
        if(!file.isFile()) throw new Error(`No subfiles allowed in contexts.`)
        const ctx: UserContext | MessageContext = await import(`${path}/${file.name}`)
        
        client.context.collection.set(`${`${path}/${file.name}`.includes('message') ? 'message': 'user'}:${ctx.info.name}`, ctx)
        // @ts-ignore
        client.context.discord.push({
            // @ts-ignore
            type: `${path}/${file.name}`.includes('message') ? ApplicationCommandType.Message : ApplicationCommandType.User,
            ...ctx.info
        })

        logger?.info(`"${ctx.info.name}" is registered`)
    }

    client.on('interactionCreate', interaction => {
        if(interaction.isContextMenuCommand()) {
            const { commandName } = interaction
            const ctx = client.context.collection.get(`${interaction.isMessageContextMenuCommand() ? 'message' : 'user'}:${commandName}`)

            if(!ctx) {
                interaction.reply({
                    content: 'This context doesn\'t exists in our collection.'
                });
                return 
            }

            // @ts-ignore
            ctx?.run({ 
                interaction,
                client
            })
        }
    })
}

export default loadContexts