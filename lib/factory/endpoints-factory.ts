import { RouteMetadata } from '../metadata.ts';
import { ControllerBase } from '../controller.ts';
import { Logger } from '../logger.ts';

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
            for (const [key, routeMetadata] of Object.entries(controller._routesMetadata)) {
                const prevRouteMetadata = endpointMethods.routeMetadata[key] || {};

                if (Logger.enabled) {
                    const controllerName = controller.constructor.name;
                    const prevControllerName = endpointMethods.instances[key]?.constructor.name;

                    this.checkExisting(routeMetadata, prevRouteMetadata, controllerName, prevControllerName, key);
                }
                endpointMethods.routeMetadata[key] = {...prevRouteMetadata, ...routeMetadata};
                endpointMethods.instances[key] = controller;
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

                Logger.queue(`WARNING: Endpoint '${key} ${route}' has been re-mapped from '${prevControllerName}.${prevCallback}' to '${controllerName}.${callback}'.`, true);
            }
        }
    }
}
