import { parse, Args } from 'https://deno.land/std/flags/mod.ts';

/**
 * Data needed for resolving server connections if using HTTPS.
 */
export interface HttpsConfig {
    /**
     * Certificate (.pem or .cert) file path.
     */
    certFile: string;
    /**
     * Key (.pem or .key) file path.
     */
    keyFile: string;
}

/**
 * Config for Tarpit server. Extensible by giving command line
 * arguments and setting `allowCli` to `true` when running
 * `Tarpit.createServer`.
 */
export interface ServerConfig {
    /**
     * Public port the server will run on. Defaults to 8000.
     */
    port?: number;
    /**
     * Directory relative to project root where static files are
     * served from. Defaults to 'public'.
     */
    staticDir?: string;
    /**
     * Choose whether to use HTTPS (true) or HTTP (false). 
     * Defaults to 'false'.
     */
    useHttps?: boolean;
    /**
     * Cert and key file information when using HTTPS. 
     * No value provided by default.
     */
    https?: HttpsConfig;
    [key: string]: any;
}

export class ConfigHelper {
    private static serverConfig: ServerConfig;

    static setConfig(serverOptions: ServerConfig, allowCli: boolean) {
        this.serverConfig = serverOptions;
        if (allowCli) {
            this.populateConfigFromCli();
        }
    }

    private static populateConfigFromCli() {
        const parsedArgs: Args = parse(Deno.args);
        for (const arg of Object.keys(parsedArgs)) {
            if (arg === '_') {
                continue;
            }
            // TODO Remove shadowing
            this.serverConfig[arg.toLowerCase()] = parsedArgs[arg];
        }
    }

    static hasKey(key: string) {
        return key in this.serverConfig;
    }

    static getValue(key: string) {
        return this.serverConfig[key];
    }
}
