interface Line {
    message: string;
    error: boolean;
}

export class Logger {
    private static enabledFlag = true;
    private static buffer: Array<Line> = [];

    static disable() {
        this.enabledFlag = false;
        this.buffer = [];
    }

    static queue(message: string, error = false) {
        if (!this.enabledFlag) {
            return;
        }
        this.buffer.push({ message, error });
    }

    static async flush() {
        if (!this.enabledFlag) {
            return;
        }
        while (this.buffer.length) {
            const line = this.buffer.pop();
            const output = line?.error ? Deno.stderr : Deno.stdout;
            const message = new TextEncoder().encode((line?.message || '') + '\n');

            await output.write(message);
        }
    }

    static writeAndFlushSync(message = '', error = false) {
        const output = error ? Deno.stderr : Deno.stdout;
        output.writeSync(new TextEncoder().encode(message + '\n'));
    }

    static get enabled() {
        return this.enabledFlag;
    }
}