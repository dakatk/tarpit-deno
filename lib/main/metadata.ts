import { ControllerBase } from './controller.ts';
import { Validator } from '../validation/mod.ts';

export const _ENDPOINT_DECORATOR_META_KEY = '_ENDPOINT_DECORATOR_META_KEY';
export const _INJECTABLE_DECORATOR_META_KEY = '_INJECTABLE_DECORATOR_META_KEY';
export const _CONTROLLER_DECORATOR_META_KEY = '_CONTROLLER_DECORATOR_META_KEY';
export const _BODY_DECORATOR_META_KEY = '_BODY_DECORATOR_META_KEY';
export const _QUERY_DECORATOR_META_KEY = '_QUERY_DECORATOR_META_KEY';
export const _PARAM_ROUTE_DECORATOR_META_KEY = '_PARAM_ROUTE_DECORATOR_META_KEY';
export const _REQUEST_PROP_DECORATOR_MET_KEY = '_REQUEST_PROP_DECORATOR_MET_KEY';

export type RouteMetadata = Record<string, Record<string, (...args: any[]) => Promise<Response>>>;
export type ControllerClass = new (...args: any[]) => ControllerBase;
export type DependencyClass = new (...args: any[]) => any;
export type ValidationMethod = (value: any) => string[];

export interface DecoratorRouteMetadata {
    method: string;
    endpoint: string;
    callback: (...args: any[]) => Promise<Response>;
}

export interface RequestPropertyMetadata {
    propertyName: string;
    callback: ValidationMethod;
}

export interface ControllerMetadata {
    params: Array<DependencyClass>;
}

export interface InjectableMetadata {
    params: Array<DependencyClass>;
    singleton: boolean;
}

export interface BodyMetadata {
    type: string;
    index: number;
    required: boolean;
    validator?: Validator;
}

export interface QueryMetadata {
    index: number;
    validator?: Validator;
}

export interface ParamRouteMetadata {
    index: number;
    validator?: Validator;
}