import djs from 'discord.js'
import { config } from '../config.js'
import type { Logger } from './logger/Logger.js'
import createLogger from './logger/createLogger';
import loadEvents from './loaders/events.js';
import loadSlash from './loaders/slash.js';
import type { SlashCommand } from './bases/SlashCommand.js';

class Client extends djs.Client {
    readonly loggers = new Map<
        string, 
        Logger
    >();
    readonly loaders;
    readyOn?: number;
    readonly slash: {
        collection: djs.Collection<string, SlashCommand>
        discord: djs.ChatInputApplicationCommandData[]
    } = {
        collection: new djs.Collection(),
        discord: []
    }

    constructor() {
        super(config.clientOptions);

        for(const namespace of ['events', 'client', 'slash']) {
            this.loggers.set(
                namespace, 
                createLogger(namespace, config.loggerOptions, config?.canDebug)
            )
        }

        this.loaders = {
            events: loadEvents,
            slash: loadSlash
        };
        let startsOn = Date.now();
        let endsOn: number;

        this.on('ready', () => {
            endsOn = Date.now()
            this.readyOn = endsOn - startsOn

            console.log(this.slash.discord)
            this.application?.commands.set(this.slash.discord)
        })
    }

    getConfig = () => config
    getPrivateConfiguration = () => process.env

    override async login() {
        this.loaders.events(
            new URL(`../front/events`, import.meta.url),
            this
        )
        this.loaders.slash(
            new URL(`../front/interactions/slash`, import.meta.url),
            this
        )

        return super.login(process.env.CLIENT_TOKEN)
    }
}

export default Client
