import * as Hapi from '@hapi/hapi';
import { Config } from './config';

export type Handler = (request: Hapi.Request, h: Hapi.Toolkit) => unknown;

export default class App {
    private readonly port: number;
    private readonly server: Hapi.Server;

    constructor(config: Config) {
        this.port = config.port;
        this.server = Hapi.server({
            port: this.port,
        });
    }

    get(path: string, handler: Handler, options?: unknown) {
        this.route('GET', path, handler, options);
    }

    post(path: string, handler: Handler, options?: unknown) {
        this.route('POST', path, handler, options);
    }

    async start(onError?: (err) => void) {
        process.on('unhandledRejection', (err) => {
            if (onError) {
                onError(err);
            }
            process.exit(1);
        });
        console.log(`Server started on port: ${this.port}`)
        await this.server.start();
    }

    private route(method: string, path: string, handler: Handler, options?: unknown) {
        this.server.route({
            method: method,
            path: path,
            handler: handler,
            options: options,
        });
    }
}
