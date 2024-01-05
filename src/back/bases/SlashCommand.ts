import type { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import type Client from '../Client';

export type SlashCommandInfo = Omit<ChatInputApplicationCommandData, 'name' | 'type'> & {}
export function SlashCommandRun(
	// eslint-disable-next-line promise/prefer-await-to-callbacks
	cb: (options: { client: Client; interaction: CommandInteraction; options: CommandInteractionOptionResolver }) => any,
) {
	return cb;
}

export type SlashCommand = {
	info: SlashCommandInfo;
	run(): typeof SlashCommandRun;
};
