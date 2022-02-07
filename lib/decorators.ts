import { 
    _ENDPOINT_DECORATOR_META_KEY, 
    _INJECTABLE_DECORATOR_META_KEY, 
    _CONTROLLER_DECORATOR_META_KEY, 
    DecoratorRouteMetadata, 
    InjectableMetadata, 
    ControllerMetadata,
    DependencyClass
} from './metadata.ts';
import "https://deno.land/x/reflection/mod.ts";

interface Type<T> {
    new (...args: any[]): T;
}

/**
 * Creates the metadata needed for auto-injection of the controller's dependencies.
 * All controller classes must have this decorator or they won't work properly.
 */
export function Controller() {
    return function <T>(target: Type<T>) {
        const params: Array<DependencyClass> = Reflect.getMetadata('design:paramtypes', target) || [];
        const metadata: ControllerMetadata = { params };

        Reflect.defineMetadata(_CONTROLLER_DECORATOR_META_KEY, metadata, target);
    }
}

/**
 * Marks a class as an injectable dependency.
 * 
 * @param singleton If true, only a single instance of the class will be created,
 * using only that one instance for each injection. Otherwise, a new instance of 
 * the class will be created for each other class that depends on it.
 */
export function Injectable(singleton = true) {
    return function <T>(target: Type<T>) {
        const params: Array<DependencyClass> = Reflect.getMetadata('design:paramtypes', target) || [];
        const metadata: InjectableMetadata = { singleton, params };

        Reflect.defineMetadata(_INJECTABLE_DECORATOR_META_KEY, metadata, target);
    };
}

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