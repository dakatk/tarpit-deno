import { Logger } from './logger.ts';

/**
 * 
 */
export interface Validator {
    [key: string]: (value: any) => boolean;
}

/**
 * 
 * @param obj 
 */
export function validate(obj: any, validator: Validator): boolean {
    for (const [key, validate] of Object.entries(validator)) {
        if (!(key in obj)) {
            continue;
        }

        const check = validate(obj[key]);
        if (!check) {
            Logger.queue(`Validation failed for entry '${key}'`, 'error');
            return false;
        }
    }
    return true;
}