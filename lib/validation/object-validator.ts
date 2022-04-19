import { Validator } from './validator.ts';
import { ValidationError } from './validation-error.ts';
import { SchemaObject } from 'https://deno.land/x/value_schema@v3.1.0/dist-deno/libs/types.ts';
import vs from 'https://deno.land/x/value_schema@v3.1.0/mod.ts';

/**
 * 
 */
 export class ObjValidator extends Validator<any> {
    constructor(private schema: SchemaObject) {
        super();
    }

    /**
     * 
     * @param obj 
     * @returns 
     */
    validate(obj: any): any {
        try {
            const validated: any = vs.applySchemaObject(this.schema, obj);
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