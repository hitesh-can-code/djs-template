import process from 'node:process'
import { URL } from 'node:url'
import djs from 'discord.js';
import { JSONFileSyncPreset } from 'lowdb/node';
import { config } from '../config.js';
import type { MessageContext } from './bases/MessageContext.js';
import type { PrefixCommand } from './bases/PrefixCommand.js';
import type { SlashCommand } from './bases/SlashCommand.js';
import type { UserContext } from './bases/UserContext.js';
import loadCommands from './loaders/commands.js';
import loadContexts from './loaders/contexts.js';
import loadEvents from './loaders/events.js';
import loadSlash from './loaders/slash.js';
import type { Logger } from './logger/Logger.js';
import createLogger from './logger/createLogger';

type PrefixData = {
	[key: string]: string[]
}

class Client extends djs.Client {
	public readonly loggers = new Map<string, Logger>();

	public readonly loaders;

	public readyOn?: number;

	public readonly slash: {
		collection: djs.Collection<string, SlashCommand>;
		discord: djs.ChatInputApplicationCommandData[];
	} = {
		collection: new djs.Collection(),
		discord: [],
	};

	public readonly context: {
		collection: djs.Collection<string, MessageContext | UserContext>;
		discord: djs.MessageApplicationCommandData[] | djs.UserApplicationCommandData[];
	} = {
		collection: new djs.Collection(),
		discord: [],
	};

	public readonly prefix = new djs.Collection<string, PrefixCommand>()

	public readonly db = {
		prefix: JSONFileSyncPreset<PrefixData>('src/db/prefix.json', {})
	}

	public constructor() {
		super(config.clientOptions);

		for (const namespace of ['events', 'client', 'slash', 'context', 'commands']) {
			this.loggers.set(namespace, createLogger(namespace, config.loggerOptions, config?.canDebug));
		}

		

		this.loaders = {
			events: loadEvents,
			slash: loadSlash,
			context: loadContexts,
			prefix: loadCommands
		};
		const startsOn = Date.now();
		let endsOn: number;

		this.on('ready', () => {
			endsOn = Date.now();

			this.readyOn = endsOn - startsOn;
			void this.application?.commands.set([...this.slash.discord, ...this.context.discord]);
		});
	}

	public getConfig = () => config;

	public getPrivateConfiguration = () => process.env;

	public override async login() {
		void this.loaders.events(new URL(`../front/events`, import.meta.url), this);
		void this.loaders.slash(new URL(`../front/interactions/slash`, import.meta.url), this);
		void this.loaders.context(new URL(`../front/interactions/contexts/message`, import.meta.url), this);
		void this.loaders.context(new URL(`../front/interactions/contexts/user`, import.meta.url), this);
		void this.loaders.prefix(new URL(`../front/commands`, import.meta.url), this)

		return super.login(process.env.CLIENT_TOKEN);
	}
}

export default Client;
