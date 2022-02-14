import { ServerError } from '../response/response-error.ts';
import { 
    _BODY_DECORATOR_META_KEY,
    _QUERY_DECORATOR_META_KEY, 
    BodyMetadata, 
    QueryMetadata
} from '../metadata.ts';
import 'https://deno.land/x/reflection@0.0.2/mod.ts';

export async function parseBodyAndQuery(request: Request, searchParams: URLSearchParams, target: any, key: string, length: number): Promise<any[]> {
    const params = new Array<any>(length);
    const bodyMeta: BodyMetadata | undefined = Reflect.getMetadata(_BODY_DECORATOR_META_KEY, target, key);
    const queryMeta: QueryMetadata | undefined = Reflect.getMetadata(_QUERY_DECORATOR_META_KEY, target, key);

    if (bodyMeta) {
        params[bodyMeta.index] = await parseRequestBody(request, bodyMeta.type, bodyMeta.required);
    }
    if (queryMeta) {
        params[queryMeta.index] = parseSearchParams(searchParams);
    }
    return params;
}

async function parseRequestBody(request: Request, type: string, required: boolean) {
    if (required && !request.body) {
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
    } else {
        return null;
    }
}

function parseSearchParams(searchParams: URLSearchParams): Record<string, string> {
    const queryParamsObj: Record<string, string> = {};

    for (const param of searchParams) {
        const name: string = param[0];
        const value: string = param[1];

        queryParamsObj[name] = value;
    }
    return queryParamsObj;
}
