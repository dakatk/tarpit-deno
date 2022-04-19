import { Validator } from './validator.ts';
import { ValidationError } from './validation-error.ts';

/**
 * 
 */
 export class ArrayValidator<T> extends Validator<Array<T>> {
    constructor(
        private array?: Array<T>, 
        private exact: boolean = true, 
        private maxLength?: number, 
        private minLength?: number) {
            super();
    }

    validate(value: Array<T>): Array<T> {
        if ((this.maxLength === 0 || this.maxLength) && value.length > this.maxLength) {
            throw {
                message: `Length of ${value.length} exceeds max length of ${this.maxLength}`,
                cause: '',
                value,
                keyStack: ['length']
            } as ValidationError;
        }
        
        if ((this.minLength === 0 || this.minLength) && value.length < this.minLength) {
            throw {
                message: `Length of ${value.length} is less than min length of ${this.minLength}`,
                cause: '',
                value,
                keyStack: ['length']
            } as ValidationError;
        }

        if (this.array || this.array!.length !== undefined) {
            const error: ValidationError | null = arrayEquals(this.array, value, this.exact);
            if (error !== null) {
                throw error as ValidationError;
            }
        }
        return value;
    }
}

function arrayEquals<T>(a?: Array<T>, b?: Array<T>, checkLength = true): ValidationError | null {
    if (a === null || a === undefined) {
        return {
            message: 'Validation array is null or undefined',
            cause: '',
            value: a,
            keyStack: []
        } as ValidationError;
    }
    else if (b === null || b === undefined) {
        return {
            message: 'Input array is null or undefined',
            cause: '',
            value: b,
            keyStack: []
        } as ValidationError;
    }
    else if (checkLength && (a.length !== b.length)) {
        return {
            message: 'Arrays are not the same length',
            cause: '',
            value: {
                actual: b.length,
                expected: a.length
            },
            keyStack: ['length']
        } as ValidationError
    }

    const length = Math.min(a.length, b.length);
    for (let i = 0; i < length; i ++) {
        if (a[i] != b[i]) {
            return {
                message: `Arrays are not the same at index ${i}`,
                cause: '',
                value: {
                    actual: b[i],
                    expected: a[i]
                },
                keyStack: [i]
            };
        }
    }
    return null;
}