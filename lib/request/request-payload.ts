type JsonValidType = string | number | Record<string, unknown> | Array<any> | boolean | null; 

/**
 * 
 */
export class RequestBodyData {
    constructor(public type: string, public value: { [key: string]: JsonValidType; }) {}
}

/**
 * 
 */
export class QueryParamData {
    [key: string]: JsonValidType;
}

/**
 * 
 */
export class RouteParamData {
    [key: string]: JsonValidType;
}