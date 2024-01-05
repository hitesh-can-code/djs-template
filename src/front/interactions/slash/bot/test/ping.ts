import { EmbedBuilder } from 'discord.js';
import { SlashSubCommandRun, type SlashSubCommandInfo } from '../../../../../back/bases/SlashSubCommand';

export const info: SlashSubCommandInfo = {
	description: 'Give bot latency',
};

export const run = SlashSubCommandRun(({ interaction, client }) => {
	void interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setTitle('Pong!')
				.setColor('DarkButNotBlack')
				.setDescription(`> API Latency: ${client.ws.ping}`),
		],
	});
});
