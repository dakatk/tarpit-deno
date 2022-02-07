import * as path from 'https://deno.land/std/path/mod.ts';

import { ResponseError, NotFoundError, ServerError, NotImplementedError, BadGatewayError } from './response-error.ts';
import { contentType } from './content-type.ts';
import { EndpointData } from './endpoints-factory.ts';
import { ControllerBase } from './controller.ts';

type RouteActions = Record<string, (body?: Request) => Promise<Response>>;

/**
 * 
 * @param request 
 * @param controllerEndpoints 
 * @returns 
 */
export async function parseRequestUrl(request: Request, controllerEndpoints: EndpointData): Promise<Response> {
    let { pathname } = new URL(request.url);

    const actions: RouteActions = controllerEndpoints.routeMetadata[pathname];
    if (actions) {
        const method: string = request.method;
        const instance: ControllerBase = controllerEndpoints.instances[pathname];
        const requestValue = request.body ? request : undefined;

        return await responseFromRoute(method, pathname, actions, instance, requestValue);
    }

    if (pathname === '/') {
        pathname = '/index.html';
    } else if (!pathname.startsWith('/')) {
        pathname = '/' + pathname;
    }
    return await serveStaticFile('./public' + pathname);
}

/**
 * 
 * @param method 
 * @param route 
 * @param routeActions 
 * @param routeInstance 
 * @param requestValue 
 * @returns 
 */
async function responseFromRoute(method: string, route: string, routeActions: RouteActions, routeInstance: ControllerBase, requestValue: any | undefined) {
    if (!(method in routeActions)) {
        throw new NotImplementedError(`Invalid request method for '${route}': '${method}'`);
    }
    const callback: (body?: Request | undefined) => Promise<Response> = routeActions[method];

    let responseValue: Response = new Response();
    try {
        responseValue = await callback.call(routeInstance, requestValue);
    } catch (e: any) {
        if (e.code) {
            throw new ResponseError(e.message, e.code);
        } else {
            throw new ServerError(e.message);
        }
    }
    if (!(responseValue instanceof Response)) {
        throw new BadGatewayError(`Invalid response type returned from '${route}' (expected: Response, got: ${responseValue['constructor']['name']})`)
    }
    return responseValue;
}

/**
 * 
 * @param pathname 
 * @returns 
 */
async function serveStaticFile(pathname: string): Promise<Response> {
    const extension: string = path.extname(pathname);
    const mimeType: string = contentType[extension] || 'application/octet-stream';

    const stat = await Deno.stat(pathname);
    if (!stat.isFile) {
        throw new NotFoundError(`File does not exist: ${pathname}`);
    }

    const file: Uint8Array = await Deno.readFile(pathname);
    return new Response(file, { 
        headers: { 'Content-Type': mimeType }
    });
}
