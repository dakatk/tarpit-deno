import { _BODY_DECORATOR_META_KEY, BodyMetadata } from '../metadata.ts';
import { Validator, ObjValidator, StringValidator, ArrayValidator } from '../validation/mod.ts';
import { Logger } from '../logger.ts';
import 'https://deno.land/x/reflection@0.0.2/mod.ts';

/**
 * Populates with the {@link Request | request} body as {@link ArrayBuffer | an array buffer}.
 * 
 * @param required If `true`, an error is thrown when the {@link Request | request} 
 * has no {@link Request.body | body}. Defaults to `false`. 
 */
export function ArrayBody<T>(required = false, validator?: ArrayValidator<T>) {
    return (target: any, key: string, index: number) => {
        defineBodyMetadata(target, key, index, 'arrayBuffer', required, validator);
    }
}

/**
 * Populates with the {@link Request | request} body as {@link Blob | raw data}.
 * 
 * @param required If `true`, an error is thrown when the {@link Request | request} 
 * has no {@link Request.body | body}. Defaults to `false`. 
 */
export function RawDataBody(required = false) {
    return (target: any, key: string, index: number) => {
        defineBodyMetadata(target, key, index, 'blob', required);
    }
}

/**
 * Populates with the {@link Request | request} body as {@link FormData | form data}.
 * 
 * @param required If `true`, an error is thrown when the {@link Request | request} 
 * has no {@link Request.body | body}. Defaults to `false`. 
 */
export function FormDataBody(required = false) {
    return (target: any, key: string, index: number) => {
        defineBodyMetadata(target, key, index, 'formData', required);
    }
}

/**
 * Populates with the {@link Request | request} body as a JSON object (`any` type).
 * 
 * @param required If `true`, an error is thrown when the {@link Request | request} 
 * has no {@link Request.body | body}. Defaults to `false`. 
 */
export function JsonBody(required = false, validator?: ObjValidator) {
    return (target: any, key: string, index: number) => {
        defineBodyMetadata(target, key, index, 'json', required, validator);
    }
}

/**
 * Populates with the {@link Request | request} body as a string.
 * 
 * @param required If `true`, an error is thrown when the {@link Request | request} 
 * has no {@link Request.body | body}. Defaults to `false`. 
 */
export function TextBody(required = false, validator?: StringValidator) {
    return (target: any, key: string, index: number) => {
        defineBodyMetadata(target, key, index, 'text', required, validator);
    }
}

function defineBodyMetadata<T>(target: any, key: string, index: number, type: string, required: boolean, validator?: Validator<T>) {
    if (Reflect.hasMetadata(_BODY_DECORATOR_META_KEY, target.constructor, key)) {
        Logger.queue("Only one '@*Body' annotation allowed per controller method. All others after the first one will be ignored.", 'warning');
        return;
    }
    
    const bodyMetadata: BodyMetadata = { type, index, required, validator };
    Reflect.defineMetadata(_BODY_DECORATOR_META_KEY, bodyMetadata, target.constructor, key);
}