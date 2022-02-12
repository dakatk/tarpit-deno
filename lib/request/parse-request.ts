import { ServerError } from '../response/response-error.ts';
import { BodyMetadata, _BODY_DECORATOR_META_KEY } from '../metadata.ts';
import "https://deno.land/x/reflection/mod.ts";

// TODO Type validation for queryParams and (?) request body
export async function parseBodyAndQuery(request: Request, queryParams: Record<string, string>, target: any, key: string, length: number): Promise<any[]> {
    const params = new Array<any>(length);
    const meta: BodyMetadata | undefined = Reflect.getMetadata(_BODY_DECORATOR_META_KEY, target, key);
    if (meta) {
        params[meta.index] = await parseRequestBody(request, meta.type);
    }

    let nextParamIndex = -1;
    for (let i = 0; i < length; i ++) {
        if (params[i] === undefined) {
            nextParamIndex = i;
            break;
        }
    }

    if (nextParamIndex !== -1) {
        params[nextParamIndex] = queryParams;
    } else {
        params.push(queryParams);
    }
    return params;
}

async function parseRequestBody(request: Request, type: string) {
    if (!request.body) {
        throw new ServerError('Empty request body');
    }

    let parsedBody: Promise<any> | null = null;
    switch (type) {
        case 'arrayBuffer':
            parsedBody = request.arrayBuffer();
            break;
        
        case 'blob':
            parsedBody = request.blob();
            break;

        case 'formData':
            parsedBody = request.formData();
            break;

        case 'json':
            parsedBody = request.json();
            break;

        case 'text':
            parsedBody = request.text();
            break;
    }

    if (parsedBody !== null) {
        return await parsedBody.catch(_ => {
            throw new ServerError(`Request body could not be parsed as type '${type}'`);
        });
    }
}