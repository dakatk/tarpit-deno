import { Validator } from '../validation/mod.ts';
import { Logger } from '../main/logger.ts';
import { 
    _QUERY_DECORATOR_META_KEY,
    _PARAM_ROUTE_DECORATOR_META_KEY,
    QueryMetadata,
    ParamRouteMetadata
} from '../main/metadata.ts';
import 'https://deno.land/x/reflection@0.0.2/mod.ts';

export function QueryParams(validator?: Validator) {
    return (target: any, key: string, index: number) => {
        if (Reflect.hasMetadata(_QUERY_DECORATOR_META_KEY, target.constructor, key)) {
            Logger.queue("Only one '@QueryParams' annotation allowed per controller method. All others after the first one will be ignored.", 'warning');
            return;
        }

        const queryMetadata: QueryMetadata = { index, validator };
        Reflect.defineMetadata(_QUERY_DECORATOR_META_KEY, queryMetadata, target.constructor, key);
    }
}

export function RouteParams(validator?: Validator) {
    return (target: any, key: string, index: number) => {
        if (Reflect.hasMetadata(_PARAM_ROUTE_DECORATOR_META_KEY, target.constructor, key)) {
            Logger.queue("Only one '@RouteParams' annotation allowed per controller method. All others after the first one will be ignored.", 'warning');
            return;
        }

        const paramRouteMetadata: ParamRouteMetadata = { index, validator };
        Reflect.defineMetadata(_PARAM_ROUTE_DECORATOR_META_KEY, paramRouteMetadata, target.constructor, key);
    }
}