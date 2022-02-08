import { ResponseError } from './response/response-error.ts';
import { parseRequestUrl } from './request/serve-request.ts';
import { EndpointsFactory, EndpointData } from './factory/endpoints-factory.ts';
import { DependencyFactory } from './factory/dependency-factory.ts';
import { ControllerClass, DependencyClass } from './metadata.ts';
import { ControllerBase } from './controller.ts';
import { serve } from './server.ts';

/**
 * 
 */
export interface TarpitServerOptions {
    /**
     * 
     */
    port?: number;
}

/**
 * 
 */
export class Tarpit {
    private static endpointsFactory: EndpointsFactory = new EndpointsFactory();

    /**
     * @param module 
     */
    static injectModule(module: { controllers: Array<ControllerClass>, dependencies: Array<DependencyClass> }) {
        const factory: DependencyFactory = new DependencyFactory(module.dependencies);
        const controllers: Array<ControllerBase> = factory.createControllers(module.controllers);

        this.endpointsFactory.addControllers(controllers);
    }

    /**
     * @param serverOptions 
     */
    static async createServer(serverOptions: TarpitServerOptions = {}): Promise<void> {
        const controllerEndpoints: EndpointData = this.endpointsFactory.all;
        const port = serverOptions.port || 8080;
        
        await serve(async request => await handleRequest(request, controllerEndpoints), port);
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