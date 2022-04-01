import { Logger } from './logger.ts';

/**
 * 
 */
export class Validator {
    /**
     * 
     * @param _value 
     * @returns 
     */
    validate(_value: any): boolean { return true; }
}

/**
 * 
 */
export class ObjValidator extends Validator {
    constructor(private fns: { [key: string]: (value: any) => boolean }) {
        super();
    }

    /**
     * 
     * @param obj 
     * @returns 
     */
    validate(obj: any): boolean {
        for (const [key, validate] of Object.entries(this.fns)) {
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
}

/**
 * 
 */
export class ArrayValidator<T> extends Validator {
    constructor(
        private array?: Array<T>, 
        private exact: boolean = true, 
        private maxLength?: number, 
        private minLength?: number) {
            super();
    }

    validate(value: Array<T>): boolean {
        if ((this.maxLength === 0 || this.maxLength) && value.length > this.maxLength) {
            Logger.queue(`Length of ${value.length} exceeds max length of ${this.maxLength}`);
            return false;
        }
        
        if ((this.minLength === 0 || this.minLength) && value.length < this.minLength) {
            Logger.queue(`Length of ${value.length} is less than min length of ${this.minLength}`);
            return false;
        }

        if (this.array || this.array!.length !== undefined) {

            const equals = arrayEquals(value, this.array, this.exact);
            if (!equals) {
                Logger.queue(`Array ${value} does not match ${this.exact ? 'exact pattern' : 'pattern'} ${this.array}`);
            }
            return equals;
        }
        return true;
    }
}

function arrayEquals<T>(a?: Array<T>, b?: Array<T>, checkLength = true): boolean {
    if (a === null || a === undefined) {
        return false;
    }
    else if (b === null || b === undefined) {
        return false;
    }
    else if (checkLength && (a.length !== b.length)) {
        return false;
    }

    for (let i = 0; i < a.length; i ++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}

/**
 * 
 */
export class StringValidator extends Validator {

}
