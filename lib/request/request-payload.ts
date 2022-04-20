type JsonValidType = string | number | Record<string, unknown> | Array<any> | boolean | null; 

/**
 * 
 */
export interface RequestBody {
    type: string;
    value: { [key: string]: JsonValidType; }
}

/**
 * 
 */
export interface RequestQueryParams {
    [key: string]: JsonValidType;
}

/**
 * 
 */
export interface RequestRouteParams {
    [key: string]: JsonValidType;
}