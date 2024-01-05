import type { PathLike } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import type Client from '../Client';
import type { Event } from '../bases/Event';

async function loadEvents(path: PathLike, client: Client) {
	try {
		const statFolder = await stat(path);
		if (!statFolder.isDirectory()) {
			throw new Error("Given dir isn't a dir.");
		}
	} catch (error) {
		throw new Error('Error while reading events. ', { cause: error });
	}

	const logger = client.loggers.get('events');
	const files = await readdir(path, { recursive: true });
	for (const file of files) {
		const event: Event = await import(`${path}/${file}`);

		// @ts-expect-error: Invaild error.
		// eslint-disable-next-line @typescript-eslint/unbound-method
		client[event.info.once ? 'once' : 'on'](event.info.name, event.run);

		const msg = event.info.nick ? `${event.info.name}(${event.info.nick})` : event.info.name;
		logger?.info(`"${msg}" is registered`);
	}
}

export default loadEvents;
