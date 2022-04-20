/**
 * 
 */
 export interface ValidationError {
    /**
     * 
     */
    message: string;

    /**
     * 
     */
    cause: string;

    /**
     * 
     */
    value: any;

    /**
     * 
     */
    keyStack: (string | number)[];
}