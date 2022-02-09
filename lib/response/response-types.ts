import { NotFoundError } from './response-error.ts';
import { contentType } from './content-type.ts';
import { ConfigHelper } from '../config.ts';
import * as path from 'https://deno.land/std/path/mod.ts';

/**
 * Creates a Response object with a JSON body and 
 * with the 'Content-Type' header set to 'application/json'
 */
export class JsonResponse extends Response {
    /**
     * @param jsonObject JSON object for response body
     */
    constructor(jsonObject: any) {
        super(JSON.stringify(jsonObject), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

/**
 * Creates a Response object with a plain text body and 
 * with the 'Content-Type' header set to 'text/plain'
 */
export class TextResponse extends Response {
    /**
     * @param text Plain text for response body
     */
    constructor(text: string) {
        super(text, {
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }
}

/**
 * Creates a Response object with a static file as the body and 
 * with the 'Content-Type' header set to 'text/plain'
 */
export class FileResponse extends Response {
    /**
     * @param filePath Full file path relative the configured 
     * static directory
     */
    constructor(filePath: string) {
        filePath = resolveStaticFilePath(filePath);

        const extension: string = path.extname(filePath);
        const mimeType: string = contentType[extension] || 'application/octet-stream';

        const stat = Deno.statSync(filePath);
        if (!stat.isFile) {
            throw new NotFoundError(`File does not exist: ${filePath}`);
        }

        const file: Uint8Array = Deno.readFileSync(filePath);
        super(file, {
            headers: {
                'Content-Type': mimeType
            }
        })
    }
}

function resolveStaticFilePath(filePath: string) {
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