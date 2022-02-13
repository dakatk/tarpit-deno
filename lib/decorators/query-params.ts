import { _QUERY_DECORATOR_META_KEY, QueryMetadata } from '../metadata.ts';
import "https://deno.land/x/reflection/mod.ts";

export function QueryParams() {
    return (target: any, key: string, index: number) => {
        if (Reflect.hasMetadata(_QUERY_DECORATOR_META_KEY, target.constructor, key)) {
            console.error("WARNING: Only one '@QueryParams' annotation allowed per controller method. All others after the first one will be ignored.");
            return;
        }
        const bodyMetadata: QueryMetadata = { index };
        Reflect.defineMetadata(_QUERY_DECORATOR_META_KEY, bodyMetadata, target.constructor, key);
    }
}