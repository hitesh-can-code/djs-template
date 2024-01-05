import type { MessageContextMenuCommandInteraction , type MessageApplicationCommandData } from 'discord.js';
import type Client from '../Client';

export type MessageContextInfo = Omit<MessageApplicationCommandData, 'type'> & {}
export type MessageContextRunOptions = {
	client: Client;
	interaction: MessageContextMenuCommandInteraction;
}
// eslint-disable-next-line promise/prefer-await-to-callbacks
export function MessageContextRun(cb: (options: MessageContextRunOptions) => any) {
	return cb;
}

export type MessageContext = {
	info: MessageContextInfo;
	run(): typeof MessageContextRun;
};
