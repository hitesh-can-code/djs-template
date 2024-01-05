import type { PathLike } from 'node:fs';
import { readdir, stat } from 'node:fs/promises'
import type Client from '../Client'
import type { PrefixCommand } from '../bases/PrefixCommand';

async function loadCommands(path: PathLike, client: Client) {
    try {
        const statFolder = await stat(path);
        if (!statFolder.isDirectory()) {
            throw new Error("Given dir isn't a dir");
        }
    } catch (error) {
        throw new Error('Error while reading slash folder. ', { cause: error });
    }

    const logger = client.loggers.get('commands');
    const unknownPath = await readdir(path, { withFileTypes: true });
    for (const unknown of unknownPath) {
        if(!unknown.isFile()) throw new Error(`No subfiles in prefix commands.`)
        const { info, run }: PrefixCommand = await import(`${path}/${unknown.name}`)

        client.prefix.set(info.name, { info, run })
        logger?.info(`"${info.name}" command is registered`)
    }

    const db = client.db.prefix
    client.on('messageCreate', msg => {
        const prefixes = getPrefix(msg.guildId as string)
        let prefix: string | null = null;
        for (const pre of prefixes) {
            if(msg.content.startsWith(pre)) {
                prefix = pre;
                break;
            }
        }
        
        if(!prefix) return;
        
        const args = msg.content.slice(prefix.length).trim().split(/ +/);
        // @ts-expect-error: Idk
        const commandName = args.shift().toLowerCase();
        const command = client.prefix.get(commandName);
        if (!command) return;
        
        try {
            // @ts-expect-error: Below function has args
            command.run({ message: msg, args, client});
        } catch (error) {
            console.error(error);
            void msg.reply('There was an error executing that command.');
        }
    })

    function getPrefix(id: string): string[] {
        // eslint-disable-next-line no-negated-condition
        if(!db.data[id]) {
            db.data[id] = [...client.getConfig().defaultPrefix]
            db.write()
            return [...client.getConfig().defaultPrefix]
        } else {
            return db.data[id]
        }
    }
}

export default loadCommands
