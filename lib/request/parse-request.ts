import { ServerError } from '../response/response-error.ts';
import { RouteParams } from './route-params.ts';
import { Validator, ObjValidator } from '../validation.ts';
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
        callbackParams[bodyMeta.index] = await parseRequestBody(request, bodyMeta.type, bodyMeta.required, bodyMeta.validator);
    }
    if (queryMeta) {
        callbackParams[queryMeta.index] = parseSearchParams(searchParams, queryMeta!.validator);
    }
    if (paramRouteMeta) {
        if (paramRouteMeta.validator) {
            if (!paramRouteMeta.validator.validate(routeParams)) {
                throw new ServerError(''); // TODO Validation error message
            }
        }
        callbackParams[paramRouteMeta.index] = routeParams;
    }
    return callbackParams;
}

async function parseRequestBody(request: Request, type: string, required: boolean, validator?: Validator) {
    if (required && !request.body) {
        throw new ServerError('Empty request body'); // TODO Better error message (?)
    }

    let parsedBodyPromise: Promise<any> | null = null;
    switch (type) {
        case 'arrayBuffer':
            parsedBodyPromise = request.arrayBuffer();
            break;
        
        case 'blob':
            parsedBodyPromise = request.blob();
            break;

        case 'formData':
            parsedBodyPromise = request.formData();
            break;

        case 'json':
            parsedBodyPromise = request.json();
            break;

        case 'text':
            parsedBodyPromise = request.text();
            break;
    }

    if (parsedBodyPromise !== null) {
        let parsedBody = await parsedBodyPromise.catch(_ => {
            throw new ServerError(`Request body could not be parsed as type '${type}'`);
        });

        if (validator) {
            if (!validator.validate(parsedBody)) {
                throw new ServerError('') // TODO Error message
            }
        }
        return parsedBody;
    } else {
        return null;
    }
}

function parseSearchParams(searchParams: URLSearchParams, validator?: ObjValidator): Record<string, string> {
    const queryParamsObj: Record<string, string> = {};

    for (const param of searchParams) {
        const name: string = param[0];
        const value: string = param[1];

        queryParamsObj[name] = value;
    }

    if (validator) {
        if (!validator.validate(queryParamsObj)) {
            throw new ServerError(''); // TODO Error message
        }
    }
    return queryParamsObj;
}
