import { HttpsConfig } from './config.ts';
import { Logger } from './logger.ts';

type Callback = (request: Request) => Promise<Response>;

/**
 * {@link https://deno.land/manual/examples/http_server}
 */
export async function serve(callback: Callback, port: number, httpsConfig?: HttpsConfig) {
    if (port <= 0) {
        throw new Error("'port' value must be a positive integer");
    }
    const server = createServer(port, httpsConfig);
    console.log(`Tarpit server running at ${httpsConfig ? 'https' : 'http'}://localhost:${port}`);

    for await (const conn of server) {
        serveHttp(callback, conn);
    }
}

function createServer(port: number, httpsConfig?: HttpsConfig): Deno.Listener | Deno.TlsListener {
    if (httpsConfig) {
        return Deno.listenTls({
            certFile: httpsConfig.certFile,
            keyFile: httpsConfig.keyFile,
            transport: 'tcp',
            port
        });
    } 
    return Deno.listen({
        transport: 'tcp',
        port
    });
}

async function serveHttp(callback: Callback, conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn);

    // TODO Request rate/size limiter
    for await (const requestEvent of httpConn) {
        const start = Date.now();
        const request: Request = requestEvent.request;
        const response: Response = await callback(request);

        if (Logger.enabled) {
            Logger.queue(`Response took ${Date.now() - start} ms`);
            await Logger.flush();
        }
        requestEvent.respondWith(response);
    }
}