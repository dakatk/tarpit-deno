type JsonValidType = string | number | Record<string, unknown> | Array<unknown> | boolean | null; 

export type RequestData = RequestBodyData | QueryParamData | RouteParamData;

/**
 * Request data for current request
 */
export interface RequestContext {
    /**
     * Request body
     */
    body?: any;

    /**
     * Request query params
     */
    query?: any;

    /**
     * Request route params
     */
    route?: any;
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
