type JsonValidType = string | number | Record<string, unknown> | Array<any> | boolean | null; 

export type RequestData = RequestBodyData | QueryParamData | RouteParamData;

export interface RequestContext {
    body?: RequestBodyData | null;
    query?: QueryParamData;
    route?: RouteParamData;
}

/**
 * Data for request body
 */
export class RequestBodyData {
    constructor(public type: string, public value: { [key: string]: JsonValidType; }) {}
}

/**
 * Data for request query param object
 */
export class QueryParamData {
    [key: string]: JsonValidType;
}

/**
 * Data for request route param object
 */
export class RouteParamData {
    [key: string]: JsonValidType;
}
