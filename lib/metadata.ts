import { ControllerBase, RequestBody } from './controller.ts';

export const _ENDPOINT_DECORATOR_META_KEY = '_ENDPOINT_DECORATOR_META_KEY';
export const _INJECTABLE_DECORATOR_META_KEY = '_INJECTABLE_DECORATOR_META_KEY';
export const _CONTROLLER_DECORATOR_META_KEY = '_CONTROLLER_DECORATOR_META_KEY';

export type RouteMetadata = Record<string, Record<string, (body?: RequestBody) => Promise<Response>>>;
export type ControllerClass = new (...a: any[]) => ControllerBase;
export type DependencyClass = new (...a: any[]) => any;

export interface DecoratorRouteMetadata {
    method: string,
    endpoint: string,
    callback: (body?: RequestBody) => Promise<Response>
}

export interface ControllerMetadata {
    params: Array<DependencyClass>;
}

export interface InjectableMetadata {
    params: Array<DependencyClass>;
    singleton: boolean;
}