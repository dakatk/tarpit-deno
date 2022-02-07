import { ControllerClass, DependencyClass } from './metadata.ts';
import { parseRequestUrl } from './serve-request.ts';
import { ResponseError } from './response-error.ts';
import { EndpointsFactory, EndpointData } from './endpoints-factory.ts';
import { DependencyFactory } from './dependency-factory.ts';
import { ControllerBase } from './controller.ts';
import { serve, ServeInit } from 'https://deno.land/std@0.114.0/http/server.ts';

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
     * @param port 
     */
    static createServer(port?: number) {
        const controllerEndpoints: EndpointData = this.endpointsFactory.all;
        console.log(`Listening on http://localhost:${port || 8000}`);

        const options: ServeInit | undefined = port ? { addr: `:${port}` } : undefined; 
        serve(async request => await handleRequest(request, controllerEndpoints), options);
    }
}

async function handleRequest(request: Request, controllerEndpoints: EndpointData) {
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