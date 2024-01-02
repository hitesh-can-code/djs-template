import type { ClientEvents } from "discord.js";
import type Client from "../Client.js";

export interface EventInfo {
    name: keyof ClientEvents;
    once?: boolean;
    nick?: string;
}

export function EventRun<K extends keyof ClientEvents>(name: K, cb: (...args: ClientEvents[K]) => any) {
    return cb
}

export type Event = {
    info: EventInfo;
    run(): typeof EventRun;
}