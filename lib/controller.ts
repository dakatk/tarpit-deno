import { _ENDPOINT_DECORATOR_META_KEY, RouteMetadata, DecoratorRouteMetadata } from './metadata.ts';
import { Logger } from './logger.ts';
import 'https://deno.land/x/reflection@0.0.2/mod.ts';

/**
 * Initial logic needed for a controller class to resolve it's mapped routes.
 * All controller classes must extends this class, or they won't work work properly
 */
export class ControllerBase {
    private routesMeta: RouteMetadata = {};

    /**
     * @argument parentPath Path that prepends to each controller method's mapped route
     */
    constructor(protected parentPath: string = '') {
        this.extractRoutesFromPrototype();
    }

    private extractRoutesFromPrototype() {
        const classConstructor = this.constructor;
        const prototype = classConstructor.prototype;

        for (const functionName of Object.getOwnPropertyNames(prototype)) {
            const metadata: DecoratorRouteMetadata | undefined = Reflect.getMetadata(_ENDPOINT_DECORATOR_META_KEY, classConstructor, functionName);
            if (!metadata) {
                continue;
            }

            let endpoint: string = (this.parentPath + metadata.endpoint).replaceAll('//', '/');
            if (!endpoint.startsWith('/')) {
                endpoint = '/' + endpoint;
            }

            const method = metadata.method;
            const callback = metadata.callback;

            if (!(endpoint in this.routesMeta)) {
                this.routesMeta[endpoint] = {};
            } else if (Logger.enabled && method in this.routesMeta[endpoint]) {
                const prevCallback = this.routesMeta[endpoint][method];
                Logger.writeAndFlushSync(`'${method} ${endpoint}' exists on '${prevCallback.name}' and is being overwritten by '${callback.name}'`, 'warning');
            }
            this.routesMeta[endpoint][method] = callback;
        }
    }

    /**
     * Containes all data needed for the Tarpit server to 
     * resolve the controller's endpoints upon request
     */
    get _routesMetadata(): RouteMetadata {
        return this.routesMeta;
    }
}