import { NotFoundError } from './response-error.ts';
import { contentType } from './content-type.ts';
import { ConfigHelper } from '../main/config.ts';
import * as path from 'https://deno.land/std@0.124.0/path/mod.ts';

class AsyncResponse extends Response {
    protected init: ResponseInit = {};
    
    constructor(body: BodyInit | null, contentType: string | undefined, status: number, statusText: string, headers?: HeadersInit) {
        headers = headers ?? {};
        if (contentType) {
            headers = {
                'Content-Type': contentType,
                ...headers
            };
        }

        const init: ResponseInit = {
            headers,
            status,
            statusText
        };
        super(body, init);

        this.init = init;
    }

    async async(): Promise<Response> {
        return await new Promise<void>(resolve => resolve())
            .then(() => this);
    }
}

/**
 * Creates a {@link Response response} object with a JSON body and 
 * with the `"Content-Type"` header set to `"application/json"`
 */
export class JsonResponse extends AsyncResponse {

    /**
     * @param jsonBody JSON response body
     */
    constructor(jsonBody: any, status: number = 200, statusText: string = 'Ok', headers?: HeadersInit) {
        super(JSON.stringify(jsonBody), 'application/json', status, statusText, headers);
    }
}

/**
 * Creates a {@link Response response} object with a plain text body and 
 * with the `"Content-Type"` header set to `"text/plain"`
 */
export class TextResponse extends AsyncResponse {

    /**
     * @param text Plain text response body
     */
    constructor(text: string, status: number = 200, statusText: string = 'Ok', headers?: HeadersInit) {
        super(text, 'text/plain', status, statusText, headers);
    }
}

/**
 * Creates a {@link Response response} object with a static file as the body and 
 * with the `"Content-Type"` header set to `"text/plain"`. File contents are resolved 
 * only when the `.async()` is called.
 */
export class FileResponse extends AsyncResponse {

    private filePath: string;

    /**
     * @param filePath Full file path relative the configured 
     * static directory
     */
    constructor(filePath: string, mimeTypeOverride?: string, status: number = 204, statusText: string = 'No Content', headers?: HeadersInit) {
        filePath = resolveStaticFilePath(filePath);

        const extension: string = path.extname(filePath);
        const mimeType: string = mimeTypeOverride ?? (
            contentType[extension] || 'application/octet-stream'
        );

        super(null, mimeType, status, statusText, {
            'Location': filePath,
            ...(headers ?? {})
        });

        this.filePath = filePath;
    }

    async async(): Promise<Response> {
        return await this.loadFile()
            .catch(e => {
                this.init.status = 404;
                this.init.statusText = 'File Not Found';

                throw e;
            })
            .then(filePath => {
                this.init.status = 200;
                this.init.statusText = 'Ok';

                return new Response(filePath, this.init);
            });
    }

    private async loadFile(): Promise<Uint8Array> {
        const stat = await Deno.stat(this.filePath);
        if (!stat.isFile) {
            throw new NotFoundError(`File does not exist: ${this.filePath}`);
        }

        return await Deno.readFile(this.filePath);
    }
}

const resolveStaticFilePath = (filePath: string): string => {
    if (filePath.startsWith('file://') || filePath.startsWith('http://') || filePath.startsWith('https://')) {
        return filePath;
    }

    if (filePath === '/') {
        filePath = '/index.html';
    } else if (!filePath.startsWith('/')) {
        filePath = '/' + filePath;
    }

    let staticFileRoot = '.';
    if (ConfigHelper.hasKey('staticDir')) {
        staticFileRoot += `/${ConfigHelper.getValue('staticDir')}`;
    }
    return `${staticFileRoot}${filePath}`;
}

/**
 * 
 */
export class NoContentResponse extends AsyncResponse {

    /**
     * @param headers 
     */
    constructor(headers?: HeadersInit) {
        super(null, undefined, 204, 'No Content', headers);
    }
}

/**
 * 
 */
export class CreatedResponse extends AsyncResponse {

    /**
     * @param jsonBody 
     * @param location 
     * @param headers 
     */
    constructor(jsonBody: any, location: string, headers?: HeadersInit) {
        super(JSON.stringify(jsonBody), 'application/json', 201, 'Created', {
            'Location': location,
            ...(headers ?? {})
        });
    }
}