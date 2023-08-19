import { RouteParamData } from './request-payload.ts';

const paramRegex = /^{[A-Za-z_-]+}$/;
const subRouteRegex = /\/{[A-Za-z_-]+}/;

/**
 * Individual route segment
 */
export interface RouteSegment {
    /**
     * Raw value of segment (ex: for /hello/world, value 
     * would be 'hello' or 'world')
     */
    value: string;
    /**
     * Name of param if applicable, `undefined` otherwise 
     * (ex: param for '{hello}' would be 'hello')
     */
    param: string | undefined;
}

/**
 * Checks if a route has any parameterized segments. For example,
 * '/user/{id}` has a parameter but '/user/name/' does not
 * 
 * @param route Full path of request route
 * @returns `true` if route has routing parameters, `false` otherwise
 */
export function isParameterizedRoute(route: string): boolean {
    return !!route.match(subRouteRegex)?.length;
}

/**
 * @param route Full path of request route
 * @returns Array of {@link RouteSegment route segments}
 */
export function compileParametrizedRoute(route: string): RouteSegment[] {
    return route.split('/').filter((value: string) => value !== '').map((value: string) => {
        let param: string | undefined = undefined;
        if (paramRegex.test(value)) {
            param = value.slice(1, -1);
        }

        return { value, param };
    });
}

/**
 * 
 * @param route 
 * @param compiled 
 * @returns 
 */
export function checkParameterizedRoute(route: string, compiled: RouteSegment[]): RouteParamData | undefined {
    const params: RouteParamData = new RouteParamData();
    const routeParts: string[] = route.split('/').filter((value: string) => value !== '');
    if (routeParts.length !== compiled.length) {
        return undefined;
    }

    for (const index in compiled) {
        const value = routeParts[index];
        const subRoute = compiled[index];

        if (subRoute.param === undefined && subRoute.value !== value) {
            return undefined;
        } else if (subRoute.param !== undefined) {
            params[subRoute.param] = value;
        }
    }
    return params;
}