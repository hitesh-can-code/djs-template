import { type MessageContextInfo, MessageContextRun } from '../../../../back/bases/MessageContext';

export const info: MessageContextInfo = {
	name: 'Test optional right?',
};

export const run = MessageContextRun(({ interaction }) => {
	void interaction.reply(`👍`);
});
