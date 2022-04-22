import { RequestBodyData, QueryParamData, RouteParamData } from '../request/request-payload.ts'; 
import { ValidationError } from './validation-error.ts';
import { SchemaObject } from 'https://deno.land/x/value_schema@v3.1.0/dist-deno/libs/types.ts';
import vs from 'https://deno.land/x/value_schema@v3.1.0/mod.ts';

/**
 * 
 */
 export class Validator {
    constructor(private schema: SchemaObject) {}

    /**
     * 
     * @param value 
     * @returns 
     */
    validate(value: RequestBodyData | QueryParamData | RouteParamData): RequestBodyData | QueryParamData | RouteParamData { 
        try {
            const validated: any = vs.applySchemaObject(this.schema, value);
            return validated;
        } catch (e) {
            throw {
                message: e.message,
                cause: e.cause,
                value: e.value,
                keyStack: e.keyStack
            } as ValidationError;
        } 
    }
}