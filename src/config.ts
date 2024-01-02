import { type ClientOptions, GatewayIntentBits as Intents } from 'discord.js'
import type { LogTheme } from './back/logger/Logger.js';

export interface Configuration {
    defaultPrefix: string;
    clientOptions: ClientOptions;
    loggerOptions: LogTheme;
    canDebug?: boolean;
}

export const config: Configuration = {
    defaultPrefix: "?",
    clientOptions: {
        intents: [
            Intents.Guilds
        ]
    },
    loggerOptions: {
        date: "L LTS", // https://momentjs.com/docs/#/parsing/string/
        lvls: {
            info: "info",
            warn: "warn",
            error: "error",
            debug: "debug"
        },
        msg: "[%date %lvl] [%namespace] // %msg"
    }
}