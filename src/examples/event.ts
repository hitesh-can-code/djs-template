import type Client from "../back/Client";
import { type EventInfo, EventRun } from "../back/bases/Event";

export const info: EventInfo = {
    name: "ready",
    once: true
}

// @ts-ignore
export const run = EventRun("ready", (client: Client) => {
    client.loggers.get('client')?.info(`The client is ready! [${client.readyOn}ms]`)
})