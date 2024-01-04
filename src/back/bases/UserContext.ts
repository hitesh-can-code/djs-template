import { type UserApplicationCommandData, UserContextMenuCommandInteraction } from 'discord.js'
import type Client from '../Client';

export interface UserContextInfo extends Omit<UserApplicationCommandData, "type"> { }
export interface UserContextRunOptions {
    interaction: UserContextMenuCommandInteraction;
    client: Client
}
export function UserContextRun(cb: (options: UserContextRunOptions) => any) {
    return cb
}

export type UserContext = {
    info: UserContextInfo;
    run(): typeof UserContextRun
}