import type { UserContextMenuCommandInteraction, UserApplicationCommandData } from 'discord.js';
import type Client from '../Client';

export type UserContextInfo = Omit<UserApplicationCommandData, 'type'> & {}
export type UserContextRunOptions = {
	client: Client;
	interaction: UserContextMenuCommandInteraction;
}
// eslint-disable-next-line promise/prefer-await-to-callbacks
export function UserContextRun(cb: (options: UserContextRunOptions) => any) {
	return cb;
}

export type UserContext = {
	info: UserContextInfo;
	run(): typeof UserContextRun;
};
