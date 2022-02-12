import { _BODY_DECORATOR_META_KEY, BodyMetadata } from '../metadata.ts';
import "https://deno.land/x/reflection/mod.ts";

// TODO Required versus optional body annotations

export function ArrayBody(target: any, key: string, index: number) {
    defineBodyMetadata(target, key, index, 'arrayBuffer');
}

export function RequestBody(target: any, key: string, index: number) {
    defineBodyMetadata(target, key, index, 'blob');
}

export function FormDataBody(target: any, key: string, index: number) {
    defineBodyMetadata(target, key, index, 'formData');
}

export function JsonBody(target: any, key: string, index: number)  {
    defineBodyMetadata(target, key, index, 'json');
}

export function TextBody(target: any, key: string, index: number) {
    defineBodyMetadata(target, key, index, 'text');
}

function defineBodyMetadata(target: any, key: string, index: number, type: string) {
    const bodyMetadata: BodyMetadata = { type, index };
    Reflect.defineMetadata(_BODY_DECORATOR_META_KEY, bodyMetadata, target.constructor, key);
}