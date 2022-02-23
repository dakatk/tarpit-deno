import { RouteMetadata } from '../metadata.ts';
import { ControllerBase } from '../controller.ts';
import { Logger } from '../logger.ts';
import { 
    RouteSegment,
    isParameterizedRoute,
    compileParametrizedRoute
} from '../request/route-params.ts';

/**
 * Compiled data for mapped routes and their corresponding 
 * controller methods
 */
export interface EndpointData {
    /**
     * Controller method and allowed HTTP methods for each 
     * mapped route
     */
    routeMetadata: RouteMetadata;
    /**
     * Controller class instance for each mapped route
     */
    instances: Record<string, ControllerBase>;
    /**
     * Compiled parameterized routes, keyed by raw controller endpoint path
     */
    paramRoutes: Record<string, RouteSegment[]>;
}

/**
 * Creates correspondence between routes and controller methods
 */
export class EndpointsFactory {
    private controllers: Array<ControllerBase> = [];

    /**
     * Append controllers to the existing list.
     * @param controllers List of individual controller 
     * class instances.
     */
    addControllers(controllers: Array<ControllerBase>) {
        this.controllers.push(...controllers);
    }

    /**
     * Resolve all routes for all controllers added.
     * @returns EndpointData {@link EndpointData | object} containing 
     * information on callbacks and supported HTTP methods for all 
     * controller routes
     */
    get all(): EndpointData {
        const endpointMethods: EndpointData = {
            routeMetadata: {},
            instances: {},
            paramRoutes: {}
        };
        for (const controller of this.controllers) {
            for (const [route, routeMetadata] of Object.entries(controller._routesMetadata)) {
                const prevRouteMetadata = endpointMethods.routeMetadata[route] || {};

                if (Logger.enabled) {
                    const controllerName = controller.constructor.name;
                    const prevControllerName = endpointMethods.instances[route]?.constructor.name;

                    this.checkExisting(routeMetadata, prevRouteMetadata, controllerName, prevControllerName, route);
                }

                if (isParameterizedRoute(route)) {
                    endpointMethods.paramRoutes[route] = compileParametrizedRoute(route);
                }
                endpointMethods.routeMetadata[route] = {...prevRouteMetadata, ...routeMetadata};
                endpointMethods.instances[route] = controller;
            }
        }
        return endpointMethods;
    }

    private checkExisting(
        routeMetadata: Record<string, (...args: any[]) => Promise<Response>>, 
        prevRouteMetadata: Record<string, (...args: any[]) => Promise<Response>>, 
        controllerName: string, 
        prevControllerName: string, 
        route: string
    ) {
        const existingKeys: string[] = Object.keys(prevRouteMetadata);
        if (!existingKeys.length) {
            return;
        }

        for (const key of existingKeys) {
            if (key in routeMetadata) {
                const prevCallback: string = prevRouteMetadata[key].name;
                const callback: string = routeMetadata[key].name;

                Logger.queue(`Endpoint '${key} ${route}' has been re-mapped from '${prevControllerName}.${prevCallback}' to '${controllerName}.${callback}'.`, 'warning');
            }
        }
    }
}
