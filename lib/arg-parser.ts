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