import { RequestData } from '../request/request-payload.ts'; 
import { ValidationError } from './validation-error.ts';
import { SchemaObject } from 'https://deno.land/x/value_schema@v3.1.0/dist-deno/libs/types.ts';
import vs from 'https://deno.land/x/value_schema@v3.1.0/mod.ts';

/**
 * Validate request objects using JSON schemas
 */
export class Validator {
    /**
     * @param schema https://deno.land/x/value_schema@v3.1.0
     */
    constructor(private schema: SchemaObject) {}

    /**
     * @param value Request body, query param, or route param object
     * @returns Validated object. Throws ValidationError if validation fails
     */
    validate(value: RequestData): RequestData { 
        return vs.applySchemaObject(this.schema, value, e => {
            throw new ValidationError(
                e.message,
                e.cause,
                e.value,
                e.keyStack
            );
        }) as RequestData;
    }
}