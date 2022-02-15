interface Line {
    message: string;
    error: boolean;
}

export class Logger {
    private static enabled = true;
    private static buffer: Array<Line> = [];

    static disable() {
        this.enabled = false;
        this.buffer = [];
    }

    static queue(message: string, error = false) {
        if (!this.enabled) {
            return;
        }
        this.buffer.push({ message, error });
    }

    static async flush() {
        if (!this.enabled) {
            return;
        }
        while (this.buffer.length) {
            const line = this.buffer.pop();
            const output = line?.error ? Deno.stderr : Deno.stdout;
            const message = new TextEncoder().encode(line?.message || '');

            await output.write(message);
        }
    }
}