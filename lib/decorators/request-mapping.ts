import { _ENDPOINT_DECORATOR_META_KEY, DecoratorRouteMetadata } from '../metadata.ts';
import "https://deno.land/x/reflection/mod.ts";

/**
 * HTTP 'GET' request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
 export function GetMapping(endpoint: string) {
    return request('GET', endpoint);
}

/**
 * HTTP 'HEAD' request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
 export function HeadMapping(endpoint: string) {
    return request('HEAD', endpoint);
}

/**
 * HTTP 'POST' request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function PostMapping(endpoint: string) {
    return request('POST', endpoint);
}

/**
 * HTTP 'PUT' request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function PutMapping(endpoint: string) {
    return request('PUT', endpoint);
}

/**
 * HTTP 'DELETE' request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function DeleteMapping(endpoint: string) {
    return request('DELETE', endpoint);
}

/**
 * HTTP 'CONNECT' request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function ConnectMapping(endpoint: string) {
    return request('CONNECT', endpoint);
}

/**
 * HTTP 'OPTIONS' request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function OptionsMapping(endpoint: string) {
    return request('OPTIONS', endpoint);
}

/**
 * HTTP 'TRACE' request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function TraceMapping(endpoint: string) {
    return request('TRACE', endpoint);
}

/**
 * HTTP 'PATCH' request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function PatchMapping(endpoint: string) {
    return request('PATCH', endpoint);
}

// TODO Function argumentes should be taken into account for route and query params
function request(method: string, endpoint: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const classConstructor = target.constructor;
        const metadata: DecoratorRouteMetadata = {
            method,
            endpoint,
            callback: descriptor.value
        };
        Reflect.defineMetadata(_ENDPOINT_DECORATOR_META_KEY, metadata, classConstructor, key);
        return descriptor;
    }
}