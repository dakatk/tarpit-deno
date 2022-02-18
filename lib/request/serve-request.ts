import { MethodNotAllowedError, BadGatewayError } from '../response/response-error.ts';
import { FileResponse } from '../response/response-types.ts';
import { EndpointData } from '../factory/endpoints-factory.ts';
import { ControllerBase } from '../controller.ts';
import { parseBodyAndQuery } from './parse-request.ts';
import { RouteParams, checkParameterizedRoute } from './route-params.ts';

type RouteActions = Record<string, (...args: any[]) => Promise<Response>>;

/**
 * Resolves the {@link Request.url | url} from the given request from either
 * the corresponding controller method, or a static file response if no
 * mapped controller method is found
 * 
 * @param request Object containing {@link Request} data
 * @param controllerEndpoints Mapping between routes and controller methods
 * @returns The {@link Response | response} data returned from the controller
 * method if the route was resolved to a controller method, otherwise a 
 * {@link FileResponse} with a static file matching the given path
 */
export async function parseRequestUrl(request: Request, controllerEndpoints: EndpointData): Promise<Response> {
    const { pathname, searchParams } = new URL(request.url);
    const controllerResponse: Response | undefined = await checkControllerEndpoint(pathname, searchParams, request, controllerEndpoints);
    if (controllerResponse !== undefined) {
        return controllerResponse;
    }

    return await new Promise(resolve => 
        resolve(new FileResponse(pathname))
    );
}

async function checkControllerEndpoint(route: string, searchParams: URLSearchParams, request: Request, controllerEndpoints: EndpointData): Promise<Response | undefined> {
    let routeParams: RouteParams | undefined = undefined;
    for (const [fullRoute, splitRoute] of Object.entries(controllerEndpoints.paramRoutes)) {
        routeParams = checkParameterizedRoute(route, splitRoute);
        if (routeParams) {
            route = fullRoute;
            break;
        }
    }

    const routeActions: RouteActions = controllerEndpoints.routeMetadata[route];
    if (!routeActions) {
        return undefined;
    }

    const method: string = request.method;
    const instance: ControllerBase = controllerEndpoints.instances[route];

    if (!(method in routeActions)) {
        throw new MethodNotAllowedError(`Invalid request method for '${route}': '${method}'`);
    }
    return await responseFromController(method, routeActions, instance, request, searchParams, routeParams || {});
}

/**
 * Attempt to call a controller method for given route and HTTP method
 * 
 * @param method The {@link Request | request's} HTTP method
 * @param route The URL that was used to make the request
 * @param routeActions Mapping between allowed HTTP methofs for the given
 * route, and the controller method that should be called for each one
 * @param instance The {@link ControllerBase | controller} instance where the 
 * ontroller method should be called from
 * @param requestData The {@link Request | request} object if it contained 
 * a body, otherwise `undefined`
 * @returns The {@link Response | response} data returned from the controller method
 */
async function responseFromController(method: string, routeActions: RouteActions, instance: ControllerBase, requestData: Request, searchParams: URLSearchParams, routeParams: RouteParams): Promise<Response> {
    const callback: (...args: any[]) => Promise<Response> = routeActions[method];
    
    const classConstructor = instance.constructor;
    const length = callback.length;
    const name = callback.name;

    const params: any[] = await parseBodyAndQuery(requestData, searchParams, routeParams, classConstructor, name, length);
    const responseValue = await callback.call(instance, ...params);

    if (!(responseValue instanceof Response)) {
        throw new BadGatewayError(`Invalid response type returned from '${classConstructor.name}.${name}' (expected: Response, got: ${responseValue['constructor']['name']})`)
    }
    return responseValue;
}


