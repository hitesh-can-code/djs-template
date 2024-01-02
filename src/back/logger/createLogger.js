import { Logger } from "./Logger";

export default function createLogger(namespace, theme, debug) {
    return new Logger(namespace, theme, debug)
}