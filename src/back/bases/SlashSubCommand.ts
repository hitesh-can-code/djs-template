import type {
	ApplicationCommandSubCommandData,
	CommandInteraction,
	CommandInteractionOptionResolver,
} from 'discord.js';
import type Client from '../Client';

export type SlashSubCommandInfo = Omit<ApplicationCommandSubCommandData, 'name' | 'type'> & {}
export function SlashSubCommandRun(
	// eslint-disable-next-line promise/prefer-await-to-callbacks
	cb: (options: { client: Client; interaction: CommandInteraction; options: CommandInteractionOptionResolver }) => any,
) {
	return cb;
}

export type SlashSubCommand = {
	info: SlashSubCommandInfo;
	run(): typeof SlashSubCommandRun;
};
