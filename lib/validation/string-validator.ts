import { Validator } from './validator.ts';
import { ValidationError } from './validation-error.ts';

/**
 * 
 */
 export class StringValidator extends Validator<string> {
    constructor(
        private pattern?: string | RegExp, 
        private exact: boolean = true, 
        private maxLength?: number, 
        private minLength?: number) {
            super();
    }

    validate(value: string): string {
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

        if (this.pattern || this.pattern!.length !== undefined) {
            const error: ValidationError | null = stringMatchesOrEquals(this.pattern, value, this.exact);
            if (error !== null) {
                throw error as ValidationError;
            }
        }
        return value;
    }
}

function stringMatchesOrEquals(a?: string | RegExp, b?: string, exact = true): ValidationError | null {
    if (a === null || a === undefined) {
        return {
            message: 'Validation string is null or undefined',
            cause: '',
            value: a,
            keyStack: []
        } as ValidationError;
    }
    else if (b === null || b === undefined) {
        return {
            message: 'Input string is null or undefined',
            cause: '',
            value: b,
            keyStack: []
        } as ValidationError;
    }

    if (a.constructor.name === 'RegExp') {
        const c = a as RegExp;
        const matches = b.match(c);

        if (matches === null) {
            return {
                message: 'Input string does not not include any matches to validation regex',
                cause: '',
                value: {
                    input: b,
                    regex: c
                },
                keyStack: ['match']
            } as ValidationError;
        }
        else if (exact && b !== matches[0]) {
            return {
                message: 'Input string is not an exact match to validatio regex',
                cause: '',
                value: {
                    input: b,
                    regex: c
                },
                keyStack: ['match']
            } as ValidationError;
        }
    }
    else {
        const c = a as string;
        if (exact && b != c) {
            return {
                message: 'Input string is not equal to validation string',
                cause: '',
                value: {
                    actual: b,
                    expected: c
                },
                keyStack: []
            } as ValidationError;
        }
        else if (!b.includes(c)) {
            return {
                message: 'Input string does not include validation string',
                cause: '',
                value: {
                    actual: b,
                    expected: c
                },
                keyStack: ['includes']
            } as ValidationError;
        }
    }
    return null;
}