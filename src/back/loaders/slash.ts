import { readdir, stat } from 'node:fs/promises'
import Client from '../Client'
import type { SlashCommand } from '../bases/SlashCommand'
import { ApplicationCommandType } from 'discord.js'

async function loadSlash(path: PathLike, client: Client) {
    try {
        const statFolder = await stat(path)
        if(!statFolder.isDirectory()) {
            throw new Error('Given dir isn\'t a dir')
        }
    } catch (e) {
        throw new Error(
            'Error while reading events. ',
            { cause: e }
        )
    }
    
    const logger = client.loggers.get('slash')
    const unknownPath = await readdir(path, { withFileTypes: true })
    for(const unknown of unknownPath) {
        if(unknown.isFile()) {
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
        }
    }
}

export default loadSlash