declare global {
	interface PrivateConfiguration {
		CLIENT_TOKEN: string;
		CLIENT_SECRET: string;
		CLIENT_ID: string;
	}

	namespace NodeJS {
		interface ProcessEnv extends PrivateConfiguration {}
	}
}

export {};
