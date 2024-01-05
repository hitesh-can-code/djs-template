import type { Message } from "discord.js";
import type Client from "../Client";

export type PrefixCommandInfo = {
    aliases?: string[];
    arguments: [
        {
            max?: number;
            min?: number;
        },
        {
            name: string;
            optional?: boolean;
        }[],
        string?
    ];
    description: string;
    name: string;
}

export type PrefixCommandRunOptions = {
    args: string[];
    client: Client;
    message: Message;   
}

// eslint-disable-next-line promise/prefer-await-to-callbacks
export function PrefixCommandRun(cb: (options: PrefixCommandRunOptions) => any) {
    return cb
}

export type PrefixCommand = {
    info: PrefixCommandInfo;
    run(): typeof PrefixCommandRun;
}