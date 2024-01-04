import { type MessageApplicationCommandData, MessageContextMenuCommandInteraction } from 'discord.js'
import type Client from '../Client';

export interface MessageContextInfo extends Omit<MessageApplicationCommandData, "type"> {}
export interface MessageContextRunOptions {
    interaction: MessageContextMenuCommandInteraction;
    client: Client
}
export function MessageContextRun(cb: (options: MessageContextRunOptions) => any) {
    return cb
}

export type MessageContext = {
    info: MessageContextInfo;
    run(): typeof MessageContextRun
}
