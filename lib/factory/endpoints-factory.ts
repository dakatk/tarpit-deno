import { RouteMetadata } from '../metadata.ts';
import { ControllerBase } from '../controller.ts';

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
            instances: {}
        };
        for (const controller of this.controllers) {
            for (const [key, routeMeta] of Object.entries(controller._routesMetadata)) {
                const prevRouteMetadata = endpointMethods.routeMetadata[key] || {};
                endpointMethods.routeMetadata[key] = {...prevRouteMetadata, ...routeMeta};
                endpointMethods.instances[key] = controller;
            }
        }
        return endpointMethods;
    }
}
