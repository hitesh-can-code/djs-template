import type { PathLike } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { ApplicationCommandType } from 'discord.js';
import type Client from '../Client';
import type { MessageContext } from '../bases/MessageContext';
import type { UserContext } from '../bases/UserContext';

async function loadContexts(path: PathLike, client: Client) {
	try {
		const statFolder = await stat(path);
		if (!statFolder.isDirectory()) {
			throw new Error("Given dir isn't a dir");
		}
	} catch (error) {
		throw new Error('Error while reading slash folder. ', { cause: error });
	}

	const logger = client.loggers.get('context');
	const files = await readdir(path, { withFileTypes: true });
	for (const file of files) {
		if (!file.isFile()) throw new Error(`No subfiles allowed in contexts.`);
		const ctx: MessageContext | UserContext = await import(`${path}/${file.name}`);

		client.context.collection.set(
			`${`${path}/${file.name}`.includes('message') ? 'message' : 'user'}:${ctx.info.name}`,
			ctx,
		);
		client.context.discord.push({
			// @ts-expect-error: Invaild type.
			type: `${path}/${file.name}`.includes('message') ? ApplicationCommandType.Message : ApplicationCommandType.User,
			...ctx.info,
		});

		logger?.info(`"${ctx.info.name}" is registered`);
	}

	client.on('interactionCreate', (interaction) => {
		if (interaction.isContextMenuCommand()) {
			const { commandName } = interaction;
			const ctx = client.context.collection.get(
				`${interaction.isMessageContextMenuCommand() ? 'message' : 'user'}:${commandName}`,
			);

			if (!ctx) {
				void interaction.reply({
					content: "This context doesn't exists in our collection.",
				});
				return;
			}

			// @ts-expect-error: Below function has args
			ctx?.run({
				interaction,
				client,
			});
		}
	});
}

export default loadContexts;
