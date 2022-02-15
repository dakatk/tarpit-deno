import { _QUERY_DECORATOR_META_KEY, QueryMetadata } from '../metadata.ts';
import { Logger } from '../logger.ts';
import 'https://deno.land/x/reflection@0.0.2/mod.ts';

export function QueryParams() {
    return (target: any, key: string, index: number) => {
        if (Reflect.hasMetadata(_QUERY_DECORATOR_META_KEY, target.constructor, key)) {
            Logger.queue("WARNING: Only one '@QueryParams' annotation allowed per controller method. All others after the first one will be ignored.", true);
            return;
        }
        const bodyMetadata: QueryMetadata = { index };
        Reflect.defineMetadata(_QUERY_DECORATOR_META_KEY, bodyMetadata, target.constructor, key);
    }
}