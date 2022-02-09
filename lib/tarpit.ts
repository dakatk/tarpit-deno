import { ResponseError } from './response/response-error.ts';
import { parseRequestUrl } from './request/serve-request.ts';
import { EndpointsFactory, EndpointData } from './factory/endpoints-factory.ts';
import { DependencyFactory } from './factory/dependency-factory.ts';
import { ControllerClass, DependencyClass } from './metadata.ts';
import { ServerConfig, ConfigHelper } from './config.ts';
import { ControllerBase } from './controller.ts';
import { serve } from './server.ts';

/**
 * This is where it all begins...
 */
export class Tarpit {
    private static endpointsFactory: EndpointsFactory = new EndpointsFactory();
    private static defaultConfig: ServerConfig = {
        port: 8080,
        staticDir: 'public'
    };

    /**
     * @param module { 
     *   controllers: List of controller classes,
     *   dependencies: List of all other injectable classes used
     *   as dependencies by controllers or other injectables
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
     * 
     * @param allowCli Whether or not to allow auto-population of config 
     * from cli variables. Defaults to 'true'.
     */
    static async createServer(serverConfig: ServerConfig = {}, allowCli = true): Promise<void> {
        serverConfig = {
            ...serverConfig,
            ...this.defaultConfig
        };
        ConfigHelper.setConfig(serverConfig, allowCli);

        const controllerEndpoints: EndpointData = this.endpointsFactory.all;
        await serve(async request => await handleRequest(request, controllerEndpoints), serverConfig.port || -1);
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