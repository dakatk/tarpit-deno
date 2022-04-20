import * as ink from 'https://deno.land/x/ink@1.3/mod.ts';

export type Color = 'red' | 'green' | 'blue' | 'yellow' | 'magenta' | 'cyan' | 'white' | 'black';
type Tag = 'red' | 'green' | 'yellow';

interface Line {
    message: string;
    tag: Tag;
}

const tags: Record<string, Tag> = {
    'error': 'red',
    'warning': 'yellow',
    'message': 'green'
};

export class Logger {
    private static enabledFlag = true;
    private static buffer: Array<Line> = [];

    // TODO Mock output for testing

    static disable() {
        this.enabledFlag = false;
        this.buffer = [];
    }

    static queue(message: string, type: 'error' | 'warning' | 'message' = 'message') {
        if (!this.enabledFlag) {
            return;
        }

        const tag = tags[type];
        this.buffer.push({ message, tag });
    }

    static async flush() {
        if (!this.enabledFlag) {
            return;
        }
        while (this.buffer.length) {
            const line = this.buffer.pop();
            const tag = line?.tag || 'green';
            const message = ink.colorize(`<${tag}>${(line?.message || '')}</${tag}>\n`);

            await Deno.stdout.write(new TextEncoder().encode(message));
        }
    }

    static writeAndFlushSync(message: string, type: 'error' | 'warning' | 'message' = 'message') {
        const tag = tags[type];
        message = ink.colorize(`<${tag}>${(message)}</${tag}>\n`);

        Deno.stdout.writeSync(new TextEncoder().encode(message));
    }

    static writeAndFlushSyncColored(message: string, color: Color = 'white', background?: Color) {
        message = `<${color}>${(message)}</${color}>`;
        if (background) {
            message = `<bg-${background}>${(message)}</bg-${background}>`;
        }
        message = ink.colorize(message + '\n');

        Deno.stdout.writeSync(new TextEncoder().encode(message));
    }

    static get enabled() {
        return this.enabledFlag;
    }
}