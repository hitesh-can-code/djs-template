import type { ApplicationCommandSubCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import type Client from "../Client";

export interface SlashSubCommandInfo extends Omit<ApplicationCommandSubCommandData, 'name' | 'type'> {}
export function SlashSubCommandRun(cb: (options: {
    interaction: CommandInteraction;
    client: Client
    options: CommandInteractionOptionResolver
}) => any) {
    return cb
}

export type SlashSubCommand = {
    info: SlashSubCommandInfo;
    run(): typeof SlashSubCommandRun
}