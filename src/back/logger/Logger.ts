import moment from 'moment'

export type LogType = 'info' | 'warn' | 'error' | 'debug'
export type LogTheme = {
    date: string;
    lvls: {
        info: string;
        warn: string;
        error: string;
        debug: string;
    }
    msg: string;
};

export class Logger {
  private readonly namespace: string;
  private readonly theme: LogTheme;
  private readonly canDebug: boolean;

  constructor(namespace: string, theme: LogTheme, debug: boolean) {
    this.namespace = namespace;
    this.theme = theme;
    this.canDebug = debug;
  }

  info(...messages: string[]) {
    messages.forEach((msg) => this.log('info', msg))
  }

  warn(...messages: string[]) {
    messages.forEach((msg) => this.log('warn', msg))
  }

  error(...messages: string[]) {
    messages.forEach((msg) => this.log('error', msg))
  }

  debug(...messages: string[]) {
    if(!this.canDebug) return;

    messages.forEach((msg) => this.log('debug', msg))
  }

  private log(type: LogType, message: string) {
    const date = moment().format(this.theme.date)
    const lvl = this.theme.lvls[type]
    const { namespace } = this

    console[type](
        this.theme.msg
            .replace('%date', date)
            .replace('%lvl', lvl)
            .replace("%level", lvl)
            .replace('%msg', message)
            .replace('%message', message)
            .replace('%namespace', namespace)
    )
  }
}