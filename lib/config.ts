import { parse, Args } from 'https://deno.land/std@0.125.0/flags/mod.ts';

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
     * Public port the server will run on. Defaults to `8000`.
     */
    port?: number;
    /**
     * Directory relative to project root where static files are
     * served from. Defaults to `"public"`.
     */
    staticDir?: string;
    /**
     * Choose whether to use HTTPS (`true`) or HTTP (`false`). 
     * Defaults to `false`.
     */
    useHttps?: boolean;
    /**
     * Cert and key file information when using HTTPS. 
     * No value provided by default.
     */
    https?: HttpsConfig;
    /**
     * If true, runs the server with developer mode features enabled.
     * These features include:
     * 
     * 1. Warnings about misplacement/misuse of certain decorators 
     * 2. Warnings when controller methods aren't used (dead code) [WIP]
     * 3. Console logging for most events, including response times [WIP]
     * 
     * Setting this flag will most likely slow down the application somewhat
     * due to all the checks/logging this enables, thereofre it's recommended
     * to only set this flag for local development. Tarpit doesn't have a
     * builtin way to detect if the application has been started in production
     * mode or not, so it's recommended to set this flag based on input
     * from the command line/a custom environment variable. Defaults to `false`.
     */
    devMode?: boolean;
    [key: string]: any;
}

/**
 * Wrapper for reading keys from server config
 */
export class ConfigHelper {
    private static serverConfig: ServerConfig;

    /**
     * Should NOT be called outside of `Tarpit.createServer`
     * 
     * @param serverOptions Global server config
     * @param allowCli Populate extra keys to server config 
     * from CLI arguments if `true`
     */
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
            
            const propName = arg.toLowerCase();
            if (propName in this.serverConfig) {
                continue;
            }
            this.serverConfig[arg.toLowerCase()] = parsedArgs[arg];
        }
    }

    /**
     * Check if `key` exists within the server config
     * 
     * @param key Server config key
     * @returns `true` if `key` exists in server config, 
     * `false` otherwise
     */
    static hasKey(key: string) {
        return key in this.serverConfig;
    }

    /**
     * @param key Server config key
     * @returns Associated value for `key` in server config
     */
    static getValue(key: string) {
        return this.serverConfig[key];
    }
}
