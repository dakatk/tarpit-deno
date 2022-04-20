import { _ENDPOINT_DECORATOR_META_KEY, DecoratorRouteMetadata } from '../main/metadata.ts';
import 'https://deno.land/x/reflection@0.0.2/mod.ts';

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET | GET} request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
 export function GetMapping(endpoint: string) {
    return request('GET', endpoint);
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD | HEAD} request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
 export function HeadMapping(endpoint: string) {
    return request('HEAD', endpoint);
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST | POST} request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function PostMapping(endpoint: string) {
    return request('POST', endpoint);
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT | PUT} request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function PutMapping(endpoint: string) {
    return request('PUT', endpoint);
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE | DELETE} request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function DeleteMapping(endpoint: string) {
    return request('DELETE', endpoint);
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT | CONNECT} request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function ConnectMapping(endpoint: string) {
    return request('CONNECT', endpoint);
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS | OPTIONS} request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function OptionsMapping(endpoint: string) {
    return request('OPTIONS', endpoint);
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE | TRACE} request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function TraceMapping(endpoint: string) {
    return request('TRACE', endpoint);
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH | PATCH} request mapping for controller methods.
 * @param endpoint URL mapped to the individual controller method
 */
export function PatchMapping(endpoint: string) {
    return request('PATCH', endpoint);
}

type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

function request(method: HttpMethod, endpoint: string) {
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