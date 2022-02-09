import { ResponseError } from './response/response-error.ts';
import { parseRequestUrl } from './request/serve-request.ts';
import { EndpointsFactory, EndpointData } from './factory/endpoints-factory.ts';
import { DependencyFactory } from './factory/dependency-factory.ts';
import { ControllerClass, DependencyClass } from './metadata.ts';
import { ServerConfig, ConfigHelper, HttpsConfig } from './config.ts';
import { ControllerBase } from './controller.ts';
import { serve } from './server.ts';

export interface LifetimeCallbacks {
    /**
     * Function that is executed before the server is configurated and started.
     */
    setup?: () => void;
    /**
     * Function that is executed after server is closed.
     */
    close?: (signal: Deno.Signal) => void; 
}

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
     * @param module { 
     *   controllers: List of controller classes.
     *   dependencies: List of all other injectable classes used
     *   as dependencies by controllers or other injectables.
     * }
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
     * @param lifetimeCallbacks Contains the 'setup' and 'close' callbacks,
     * executed at the very beginning and very end of the program life
     * cycle (respsectively).
     * @param configureCli Whether or not to allow auto-population of config 
     * from cli variables. Defaults to 'true'.
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

        await serve(async request => await handleRequest(request, controllerEndpoints), port, httpsConfig);
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

async function handleRequest(request: Request, controllerEndpoints: EndpointData): Promise<Response> {
    let response;
    try {
        response = await parseRequestUrl(request, controllerEndpoints);
    } catch (e: any) {
        response = errorResponse(e);
    }
    return response;
}

function errorResponse(e: ResponseError) {
    const status = e.code || 500;
    const message = e.stack || e.message;

    return new Response(message, { status });
}