import { ConfigHelper } from '../config.ts';
import { Logger } from '../logger.ts';

// FIXME Works, but only with static members
/**
 * Populates the value for the annotated static variable
 * from the server config
 * @param propertyNames Name(s) of server config properties 
 */
export function Config(propertyNames: string | string[]) {
    if (!Array.isArray(propertyNames)) {
        propertyNames = [propertyNames.toString()];
    }
    return (target: any, key: string) => {
        if (target.constructor.name !== 'Function') {
            Logger.queue("'Config' decorator is only applicable to static members.", 'error');
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
                        for (const propName of propertyNames) {
                            if (ConfigHelper.hasKey(propName)) {
                                this[argName] = ConfigHelper.getValue(propName);
                                break;
                            }
                        }
                    }
                    return this[argName];
                }
            }
        });
    }
}