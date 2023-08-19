/**
 * Validation error exception
 */
export class ValidationError extends Error {
    /**
     * @param message Validation error message
     * @param ref Cause of the error
     * @param value Value of the error
     * @param keyStack Exception call stack
     */
    constructor(
        public message: string, 
        public ref: string, 
        public value: any, 
        public keyStack: (string | number)[]
    ) {
        super(message);
    }
}
