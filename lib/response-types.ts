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