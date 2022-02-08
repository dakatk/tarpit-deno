import { RouteMetadata } from '../metadata.ts';
import { ControllerBase } from '../controller.ts';

export interface EndpointData {
    routeMetadata: RouteMetadata;
    instances: Record<string, ControllerBase>;
}

/**
 * 
 */
export class EndpointsFactory {
    private controllers: Array<ControllerBase> = [];

    /**
     * 
     * @param controllers 
     */
    addControllers(controllers: Array<ControllerBase>) {
        this.controllers.push(...controllers);
    }

    /**
     * 
     */
    get all(): EndpointData {
        const endpointMethods: EndpointData = {
            routeMetadata: {},
            instances: {}
        };
        for (const controller of this.controllers) {
            for (const [key, routeMeta] of Object.entries(controller.routesMetadata)) {
                const prevRouteMetadata = endpointMethods.routeMetadata[key] || {};
                endpointMethods.routeMetadata[key] = {...prevRouteMetadata, ...routeMeta};
                endpointMethods.instances[key] = controller;
            }
        }
        return endpointMethods;
    }
}
