import { NotImplementedError, BadGatewayError } from '../response/response-error.ts';
import { FileResponse } from '../response/response-types.ts';
import { EndpointData } from '../factory/endpoints-factory.ts';
import { ControllerBase, RequestBody } from '../controller.ts';

type RouteActions = Record<string, (body?: RequestBody) => Promise<Response>>;

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
    const { pathname } = new URL(request.url);
    const routeActions: RouteActions = controllerEndpoints.routeMetadata[pathname];

    if (routeActions) {
        const method: string = request.method;
        const instance: ControllerBase = controllerEndpoints.instances[pathname];
        const requestBody = request.body ? extractRequestBody(request) : undefined;

        return await responseFromController(method, pathname, routeActions, instance, requestBody);
    }

    return await new Promise(resolve => 
        resolve(new FileResponse(pathname))
    );
}

function extractRequestBody(request: Request): RequestBody {
    return {
        body: request.body,
        bodyUsed: request.bodyUsed,
        arrayBuffer: request.arrayBuffer,
        blob: request.blob,
        formData: request.formData,
        json: request.json,
        text: request.text
    };
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
 * @param requestBody The {@link Request | request} object if it contained 
 * a body, otherwise `undefined`
 * @returns The {@link Response | response} data returned from the controller method
 */
async function responseFromController(method: string, route: string, routeActions: RouteActions, instance: ControllerBase, requestBody: RequestBody | undefined) {
    if (!(method in routeActions)) {
        throw new NotImplementedError(`Invalid request method for '${route}': '${method}'`);
    }
    const callback: (body?: RequestBody | undefined) => Promise<Response> = routeActions[method];
    const responseValue = await callback.call(instance, requestBody);

    if (!(responseValue instanceof Response)) {
        throw new BadGatewayError(`Invalid response type returned from '${route}' (expected: Response, got: ${responseValue['constructor']['name']})`)
    }
    return responseValue;
}
