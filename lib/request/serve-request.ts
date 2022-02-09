import { NotImplementedError, BadGatewayError } from '../response/response-error.ts';
import { FileResponse } from '../response/response-types.ts';
import { EndpointData } from '../factory/endpoints-factory.ts';
import { ControllerBase } from '../controller.ts';

type RouteActions = Record<string, (body?: Request) => Promise<Response>>;

/**
 * 
 * @param request 
 * @param controllerEndpoints 
 * @returns 
 */
export async function parseRequestUrl(request: Request, controllerEndpoints: EndpointData): Promise<Response> {
    const { pathname } = new URL(request.url);
    const actions: RouteActions = controllerEndpoints.routeMetadata[pathname];

    if (actions) {
        const method: string = request.method;
        const instance: ControllerBase = controllerEndpoints.instances[pathname];
        const requestValue = request.body ? request : undefined;

        return await responseFromRoute(method, pathname, actions, instance, requestValue);
    }

    return await new Promise(resolve => 
        resolve(new FileResponse(pathname))
    );
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
    const responseValue = await callback.call(routeInstance, requestValue);

    if (!(responseValue instanceof Response)) {
        throw new BadGatewayError(`Invalid response type returned from '${route}' (expected: Response, got: ${responseValue['constructor']['name']})`)
    }
    return responseValue;
}
