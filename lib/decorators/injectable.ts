import {
    _INJECTABLE_DECORATOR_META_KEY, 
    _CONTROLLER_DECORATOR_META_KEY,
    InjectableMetadata, 
    ControllerMetadata,
    DependencyClass
} from '../metadata.ts';
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
 * @param singleton If `true`, only a single instance of the class will be created,
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