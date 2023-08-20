import { MethodNotAllowedError, BadGatewayError } from '../response/response-error.ts';
import { FileResponse } from '../response/response-types.ts';
import { EndpointData } from '../factory/endpoints-factory.ts';
import { ControllerBase } from '../main/controller.ts';
import { parseBodyAndQuery } from './parse-request.ts';
import { checkParameterizedRoute } from './route-params.ts';
import { RequestContext, RequestData, RouteParamData } from './request-payload.ts';
import { Middleware } from "../main/tarpit.ts";

type RouteActions = Record<string, (...args: any[]) => Promise<Response>>;

/**
 * Resolves the {@link Request.url url} from the given request from either
 * the corresponding controller method, or a static file response if no
 * mapped controller method is found
 * 
 * @param request Object containing {@link Request} data
 * @param controllerEndpoints Mapping between routes and controller methods
 * @param middleware List of middleware callbacks
 * @returns The {@link Response response} data returned from the controller
 * method if the route was resolved to a controller method, otherwise a 
 * {@link FileResponse} with a static file matching the given path
 */
export async function parseRequestUrl(request: Request, controllerEndpoints: EndpointData, middleware: Middleware[]): Promise<Response> {
    const { pathname, searchParams } = new URL(request.url);
    const controllerResponse: Response | undefined = await checkControllerEndpoint(
        pathname,
        searchParams,
        request,
        controllerEndpoints,
        middleware
    );
    
    if (controllerResponse !== undefined) {
        return controllerResponse;
    }

    return await new FileResponse(pathname).async();
}

async function checkControllerEndpoint(
    route: string,
    searchParams: URLSearchParams,
    request: Request,
    controllerEndpoints: EndpointData,
    middleware: Middleware[]
): Promise<Response | undefined> {
    let routeParams: RouteParamData | undefined = undefined;
    let routeActions: RouteActions = controllerEndpoints.routeMetadata[route];

    if (!routeActions) {
        for (const [fullRoute, splitRoute] of Object.entries(controllerEndpoints.paramRoutes)) {
            routeParams = checkParameterizedRoute(route, splitRoute);
            if (routeParams) {
                routeActions = controllerEndpoints.routeMetadata[fullRoute];
                route = fullRoute;
                break;
            }
        }
        
        if (!routeActions || routeParams === undefined) {
            return undefined;
        }
    }

    const method: string = request.method;
    const instance: ControllerBase = controllerEndpoints.instances[route];

    if (!(method in routeActions)) {
        throw new MethodNotAllowedError(`Invalid request method for '${route}': '${method}'`);
    }
    return await responseFromController(
        method,
        routeActions,
        instance,
        request,
        searchParams,
        routeParams || {},
        middleware);
}

/**
 * Attempt to call a controller method for given route and HTTP method
 * 
 * @param method The {@link Request request's} HTTP method
 * @param routeActions Mapping between allowed HTTP methofs for the given
 * route, and the controller method that should be called for each one
 * @param instance The {@link ControllerBase controller} instance where the 
 * ontroller method should be called from
 * @param requestData The {@link Request request} object if it contained 
 * a body, otherwise `undefined`
 * @returns The {@link Response response} data returned from the controller method
 */
async function responseFromController(
    method: string,
    routeActions: RouteActions,
    instance: ControllerBase,
    requestData: Request,
    searchParams: URLSearchParams,
    routeParams: RouteParamData,
    middleware: Middleware[]
): Promise<Response> {
    const callback: (...args: any[]) => Promise<Response> = routeActions[method];
    
    const classConstructor = instance.constructor;
    const length = callback.length;
    const name = callback.name;

    const callbackParams = await parseBodyAndQuery(requestData, searchParams, routeParams, classConstructor, name);
    
    let context: RequestContext = {
        body: callbackParams.body?.value?.value,
        query: callbackParams.queryParams?.value,
        route: callbackParams.routeParams?.value
    };

    for (const middlewareCallback of middleware) {
        context = await middlewareCallback(context);
    }

    const params = new Array<RequestData | null | undefined>(length);

    if (callbackParams.body) {
        params[callbackParams.body.index] = context.body;
    }

    if (callbackParams.queryParams) {
        params[callbackParams.queryParams.index] = context.query;
    }

    if (callbackParams.routeParams) {
        params[callbackParams.routeParams.index] = context.route;
    }

    let responseValue: any;
    try {
        responseValue = callback.call(instance, ...params);
    } catch (e) {
        throw e;
    }

    if (responseValue instanceof Promise) {
        return await responseValue.catch(e => { throw e; });
    } else if (!(responseValue instanceof Response)) {
        throw new BadGatewayError(`Invalid response type returned from '${classConstructor.name}.${name}' (expected: Response, got: ${responseValue['constructor']['name']})`)
    } else {
        return responseValue;
    }
}


