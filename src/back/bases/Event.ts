import type { ClientEvents } from 'discord.js';

export type EventInfo = {
	name: keyof ClientEvents;
	nick?: string;
	once?: boolean;
}

// eslint-disable-next-line promise/prefer-await-to-callbacks
export function EventRun<K extends keyof ClientEvents>(name: K, cb: (...args: ClientEvents[K]) => any) {
	return cb;
}

export type Event = {
	info: EventInfo;
	run(): typeof EventRun;
};
