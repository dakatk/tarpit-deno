import { parse, Args } from 'https://deno.land/std/flags/mod.ts';

export class ArgParser {
    private static args: Args;

    static firstOf(...argNames: string[]) {
        if (!this.args) {
            this.args = parse(Deno.args);
        }

        for (const argName of argNames) {
            if (argName in this.args) {
                return this.args[argName];
            }
        }
        return undefined;
    }
}

// TODO Works, but only with static members
export function FromArg(propertyNames: string | string[]) {
    return (target: any, key: string) => {
        if (target.constructor.name !== 'Function') {
            console.error("'FromArg' decorator is only applicable to static members");
            return;
        }
        const name = key.toString();
        const argName = `__${name}__cli_arg`;

        Object.defineProperties(target, {
            [argName]: {
                writable: true,
                enumerable: false,
                configurable: true
            },
            [name]: {
                configurable: true,
                enumerable: true,
                get () {
                    if (!this[argName]) {
                        if (Array.isArray(propertyNames)) {
                            this[argName] = ArgParser.firstOf(...propertyNames);
                        } else {
                            this[argName] = ArgParser.firstOf(propertyNames.toString());
                        }
                    }
                    return this[argName];
                }
            }
        });
    }
}