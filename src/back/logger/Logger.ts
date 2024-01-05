import moment from 'moment';

export type LogType = 'debug' | 'error' | 'info' | 'warn';
export type LogTheme = {
	date: string;
	lvls: {
		debug: string;
		error: string;
		info: string;
		warn: string;
	};
	msg: string;
};

export class Logger {
	private readonly namespace: string;

	private readonly theme: LogTheme;

	private readonly canDebug: boolean;

	public constructor(namespace: string, theme: LogTheme, debug: boolean) {
		this.namespace = namespace;
		this.theme = theme;
		this.canDebug = debug;
	}

	public info(...messages: string[]) {
		for (const msg of messages) this.log('info', msg);
	}

	public warn(...messages: string[]) {
		for (const msg of messages) this.log('warn', msg);
	}

	public error(...messages: string[]) {
		for (const msg of messages) this.log('error', msg);
	}

	public debug(...messages: string[]) {
		if (!this.canDebug) return;

		for (const msg of messages) this.log('debug', msg);
	}

	private log(type: LogType, message: string) {
		const date = moment().format(this.theme.date);
		const lvl = this.theme.lvls[type];
		const { namespace } = this;

		console[type](
			this.theme.msg
				.replace('%date', date)
				.replace('%lvl', lvl)
				.replace('%level', lvl)
				.replace('%msg', message)
				.replace('%message', message)
				.replace('%namespace', namespace),
		);
	}
}
