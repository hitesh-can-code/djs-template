import type { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import type Client from "../Client";

export interface SlashCommandInfo extends Omit<ChatInputApplicationCommandData, 'name' | 'type'> {}
export function SlashCommandRun(cb: (options: {
    interaction: CommandInteraction;
    client: Client
    options: CommandInteractionOptionResolver
}) => any) {
    return cb
}

export type SlashCommand = {
    info: SlashCommandInfo;
    run(): typeof SlashCommandRun
}