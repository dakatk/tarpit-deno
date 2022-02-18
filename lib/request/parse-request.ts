import { ServerError } from '../response/response-error.ts';
import { RouteParams } from './route-params.ts';
import { 
    _BODY_DECORATOR_META_KEY,
    _QUERY_DECORATOR_META_KEY, 
    _PARAM_ROUTE_DECORATOR_META_KEY,
    BodyMetadata, 
    QueryMetadata,
    ParamRouteMetadata
} from '../metadata.ts';
import 'https://deno.land/x/reflection@0.0.2/mod.ts';

export async function parseBodyAndQuery(request: Request, searchParams: URLSearchParams, routeParams: RouteParams, target: any, key: string, length: number): Promise<any[]> {
    const callbackParams = new Array<any>(length);
    const bodyMeta: BodyMetadata | undefined = Reflect.getMetadata(_BODY_DECORATOR_META_KEY, target, key);
    const queryMeta: QueryMetadata | undefined = Reflect.getMetadata(_QUERY_DECORATOR_META_KEY, target, key);
    const paramRouteMeta: ParamRouteMetadata | undefined = Reflect.getMetadata(_PARAM_ROUTE_DECORATOR_META_KEY, target, key);

    if (bodyMeta) {
        callbackParams[bodyMeta.index] = await parseRequestBody(request, bodyMeta.type, bodyMeta.required);
    }
    if (queryMeta) {
        callbackParams[queryMeta.index] = parseSearchParams(searchParams);
    }
    if (paramRouteMeta) {
        callbackParams[paramRouteMeta.index] = routeParams;
    }
    return callbackParams;
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
