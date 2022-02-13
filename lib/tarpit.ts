import { ResponseError } from './response/response-error.ts';
import { parseRequestUrl } from './request/serve-request.ts';
import { EndpointsFactory, EndpointData } from './factory/endpoints-factory.ts';
import { DependencyFactory } from './factory/dependency-factory.ts';
import { ControllerClass, DependencyClass } from './metadata.ts';
import { ServerConfig, ConfigHelper, HttpsConfig } from './config.ts';
import { ControllerBase } from './controller.ts';
import { serve } from './server.ts';

/**
 * Collection of callbacks that are automatically executed at
 * various points in the program's lifecycle
 */
export interface LifetimeCallbacks {
    /**
     * Executed before the server is configurated and started.
     */
    setup?: () => void;
    /**
     * Executed when an error response is created
     */
    error?: (e: ResponseError) => void;
    /**
     * Executed after server is closed.
     */
    close?: (signal: Deno.Signal) => void;
}

// TODO Controller method checking
// TODO Create sample middleware (auth, denodb?)

/**
 * This is where it all begins...
 */
export class Tarpit {
    private static endpointsFactory: EndpointsFactory = new EndpointsFactory();
    private static defaultConfig: ServerConfig = {
        port: 8000,
        staticDir: 'public',
        useHttps: false
    };

    /**
     * @param module `{ 
     *   controllers: List of controller classes.
     *   dependencies: List of all other injectable classes used
     *   as dependencies by controllers or other injectables.
     * }`
     */
    static injectModule(module: { controllers: Array<ControllerClass>, dependencies: Array<DependencyClass> }) {
        const factory: DependencyFactory = new DependencyFactory(module.dependencies);
        const controllers: Array<ControllerBase> = factory.createControllers(module.controllers);

        this.endpointsFactory.addControllers(controllers);
    }

    /**
     * @param serverConfig Static server config. Additional options 
     * are taken first from any environment variables given at runtime,
     * then from command line arguments.  
     * @param lifetimeCallbacks Contains the {@link LifetimeCallbacks.setup | setup} 
     * and {@link LifetimeCallbacks.close | close} callbacks, executed at the very 
     * beginning and very end of the program life cycle (respsectively).
     * @param configureCli Whether or not to allow creation of extra config 
     * values from CLI variables. Defaults to `true` (Note: CLI arguments
     * cannot shadow properties already available in {@link ServerConfig}. i.e., 
     * providing `--port 9001` as a CLI argument won't override {@link ServerConfig.port}.
     */
    static async createServer(serverConfig: ServerConfig = {}, lifetimeCallbacks?: LifetimeCallbacks, configureCli = true): Promise<void> {
        if (lifetimeCallbacks?.setup) {
            lifetimeCallbacks.setup();
        }
        bindSignalListeners((signal: Deno.Signal) => {
            if (lifetimeCallbacks?.close) {
                lifetimeCallbacks.close(signal);
            }
        });

        serverConfig = {
            ...serverConfig,
            ...this.defaultConfig
        };
        ConfigHelper.setConfig(serverConfig, configureCli);

        const controllerEndpoints: EndpointData = this.endpointsFactory.all;
        const httpsConfig: HttpsConfig | undefined = serverConfig.useHttps ? serverConfig.https : undefined;
        const port: number = serverConfig.port || -1;

        await serve(async request => {
            return await handleRequest(request, controllerEndpoints, lifetimeCallbacks?.error);
        }, port, httpsConfig);
    }
}

function bindSignalListeners(close: (signal: Deno.Signal) => void) {
    for (const signal of ['SIGQUIT', 'SIGINT', 'SIGTERM']) {
        Deno.addSignalListener(signal as Deno.Signal, () => {
            close(signal as Deno.Signal);
            Deno.exit(0);
        });
    }
}

async function handleRequest(request: Request, controllerEndpoints: EndpointData, errorCallback?: (e: ResponseError) => void): Promise<Response> {
    let response;
    try {
        response = await parseRequestUrl(request, controllerEndpoints);
    } catch (error: any) {
        response = errorResponse(error, errorCallback);
    }
    return response;
}

function errorResponse(error: ResponseError, errorCallback?: (e: ResponseError) => void) {
    const status = error.code || 500;
    const message = error.message || error.stack;

    if (errorCallback) {
        errorCallback(error);
    }
    console.error(error.stack);

    return new Response(message, { status });
}