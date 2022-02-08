// https://deno.land/manual/examples/http_server
type Callback = (request: Request) => Promise<Response>;

export async function serve(callback: Callback, port: number) {
    const server = Deno.listen({ 
        transport: "tcp", 
        port
    });
    console.log(`Tarpit server running at http://localhost:${port}`);

    for await (const conn of server) {
        serveHttp(callback, conn);
    }
}

async function serveHttp(callback: Callback, conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn);

    for await (const requestEvent of httpConn) {
        const request: Request = requestEvent.request;
        const response: Response = await callback(request);

        requestEvent.respondWith(response);
    }
}