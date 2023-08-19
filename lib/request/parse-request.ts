import { ServerError } from '../response/response-error.ts';
import { Validator } from '../validation/mod.ts';
import { RequestBodyData, QueryParamData, RouteParamData } from './request-payload.ts';
import { 
    _BODY_DECORATOR_META_KEY,
    _QUERY_DECORATOR_META_KEY,
    _PARAM_ROUTE_DECORATOR_META_KEY,
    BodyMetadata,
    QueryMetadata,
    ParamRouteMetadata
} from '../main/metadata.ts';
import 'https://deno.land/x/reflection@0.0.2/mod.ts';

export interface ControllerCallbackParams {
    body?: { value: RequestBodyData | null, index: number };
    queryParams?: { value: QueryParamData, index: number };
    routeParams?: { value: RouteParamData, index: number };
}

export async function parseBodyAndQuery(request: Request, searchParams: URLSearchParams, routeParams: RouteParamData, target: any, key: string): Promise<ControllerCallbackParams> {
    const callbackParams: ControllerCallbackParams = {}; 
    const bodyMeta: BodyMetadata | undefined = Reflect.getMetadata(_BODY_DECORATOR_META_KEY, target, key);
    const queryMeta: QueryMetadata | undefined = Reflect.getMetadata(_QUERY_DECORATOR_META_KEY, target, key);
    const routeMeta: ParamRouteMetadata | undefined = Reflect.getMetadata(_PARAM_ROUTE_DECORATOR_META_KEY, target, key);

    const url: string = new URL(request.url).pathname;

    if (bodyMeta) {
        let requestBody: RequestBodyData | null = await parseRequestBody(request, bodyMeta.type, bodyMeta.required);
        if (requestBody !== null) {
            requestBody = validate(url, 'request body', requestBody as RequestBodyData, bodyMeta.validator) as RequestBodyData;
        }

        callbackParams.body = {
            value: requestBody,
            index: bodyMeta.index
        };
    }

    if (queryMeta) {
        let requestParams: QueryParamData = parseSearchParams(searchParams);
        requestParams = validate(url, 'query params', requestParams, queryMeta.validator) as QueryParamData;

        callbackParams.queryParams = {
            value: requestParams,
            index: queryMeta.index
        };
    }

    if (routeMeta) {
        routeParams = validate(url, 'route params', routeParams, routeMeta.validator) as RouteParamData;

        callbackParams.routeParams = {
            value: routeParams,
            index: routeMeta.index
        };
    }
    return callbackParams;
}

function validate(url: string, type: string, value: RequestBodyData | QueryParamData | RouteParamData, validator?: Validator): RequestBodyData | QueryParamData | RouteParamData {
    if (!validator) {
        return value;
    }
    try {
        return validator.validate(value);
    } catch (e) {
        throw new ServerError(`Validation error (parsing ${type} for ${url}):\n${JSON.stringify(e, null, 4)}`);
    }
} 

async function parseRequestBody(request: Request, type: string, required: boolean): Promise<RequestBodyData | null> {
    if (required && !request.body) {
        throw new ServerError(`Empty request body (${request.url})`);
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
        const body = await parsedBodyPromise.catch(_ => {
            throw new ServerError(`Request body could not be parsed as ${type}`);
        });
        return new RequestBodyData(type, body);
    } else {
        return null;
    }
}

function parseSearchParams(searchParams: URLSearchParams): QueryParamData {
    const queryParamsObj: QueryParamData = new QueryParamData();

    for (const param of searchParams) {
        const name: string = param[0];
        const value: string = param[1];

        queryParamsObj[name] = value;
    }
    return queryParamsObj;
}
