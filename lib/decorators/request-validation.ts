import { _REQUEST_PROP_DECORATOR_MET_KEY, RequestPropertyMetadata } from '../main/metadata.ts';

export function CustomValidation(callback: (field: any) => string[]) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const classConstructor = target.constructor;
        const metadata: RequestPropertyMetadata = {
            propertyName: key,
            callback
        };
        Reflect.defineMetadata(_REQUEST_PROP_DECORATOR_MET_KEY, metadata, classConstructor, key);
        return descriptor;
    }
}