import { _BODY_DECORATOR_META_KEY, BodyMetadata } from '../metadata.ts';
import 'https://deno.land/x/reflection@0.0.2/mod.ts';

/**
 * Populates with the {@link Request | request} body as {@link ArrayBuffer | an array buffer}.
 * 
 * @param required If `true`, an error is thrown when the {@link Request | request} 
 * has no {@link Request.body | body}. Defaults to `false`. 
 */
export function ArrayBody(required = false) {
    return (target: any, key: string, index: number) => {
        defineBodyMetadata(target, key, index, 'arrayBuffer', required);
    }
}

/**
 * Populates with the {@link Request | request} body as {@link Blob | raw data}.
 * 
 * @param required If `true`, an error is thrown when the {@link Request | request} 
 * has no {@link Request.body | body}. Defaults to `false`. 
 */
export function RequestBody(required = false) {
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
export function JsonBody(required = false) {
    return (target: any, key: string, index: number) => {
        defineBodyMetadata(target, key, index, 'json', required);
    }
}

/**
 * Populates with the {@link Request | request} body as a string.
 * 
 * @param required If `true`, an error is thrown when the {@link Request | request} 
 * has no {@link Request.body | body}. Defaults to `false`. 
 */
export function TextBody(required = false) {
    return (target: any, key: string, index: number) => {
        defineBodyMetadata(target, key, index, 'text', required);
    }
}

function defineBodyMetadata(target: any, key: string, index: number, type: string, required: boolean) {
    if (Reflect.hasMetadata(_BODY_DECORATOR_META_KEY, target.constructor, key)) {
        console.error("WARNING: Only one '@*Body' annotation allowed per controller method. All others after the first one will be ignored.");
        return;
    }
    const bodyMetadata: BodyMetadata = { type, index, required };
    Reflect.defineMetadata(_BODY_DECORATOR_META_KEY, bodyMetadata, target.constructor, key);
}