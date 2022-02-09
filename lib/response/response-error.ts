// 400 Response errors:

/**
 * Generic response error
 */
export class ResponseError extends Error {
    /**
     * @param message Text returned as error response body
     * @param code HTTP error code
     */
    constructor(message: string, public code: number) {
        super(message);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400 | 400} "Bad Request" error
 */
export class BadRequestError extends ResponseError {
    constructor(message?: string) {
        super(message || '(400) BAD REQUEST', 400);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401 | 401} "Unauthorized" error
 */
export class UnauthorizedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(401) UNAUTHORIZED', 401);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402 | 402} "Payment Required" error
 */
export class PaymentRequiredError extends ResponseError {
    constructor(message?: string) {
        super(message || '(402) PAYMENT REQUIRED', 402);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403 | 403} "Forbidden" error
 */
export class ForbiddenError extends ResponseError {
    constructor(message?: string) {
        super(message || '(403) FORBIDDEN', 403);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404 | 404} "Not Found" error
 */
export class NotFoundError extends ResponseError {
    constructor(message?: string) {
        super(message || '(404) NOT FOUND', 404);
    }
}

//===============================================================
// 500 Response errors:

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500 | 500} "Internal Server" error
 */
export class ServerError extends ResponseError {
    constructor(message?: string) {
        super(message || '(500) INTERNAL SERVER ERROR', 500);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501 | 501} "Not Implemented" error
 */
export class NotImplementedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(501) NOT IMPLENTED', 501);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502 | 502} "Bad Gateway" error
 */
export class BadGatewayError extends ResponseError {
    constructor(message?: string) {
        super(message || '(502) BAD GATEWAY', 502);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503 | 503} "Service Unavailable" error
 */
export class ServiceUnavailableError extends ResponseError {
    constructor(message?: string) {
        super(message || '(503) SERVICE UNAVAILABLE', 503);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504 | 504} "Gateway Timeout" error
 */
export class GatewayTimeoutError extends ResponseError {
    constructor(message?: string) {
        super(message || '(504) GATEWAY TIMEOUT', 504);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505 | 505} "HTTP Version Not Supported" error
 */
export class HTTPVersionNotSupportedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(505) HTTP VERSION NOT SUPPORTED', 505);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/506 | 506} "Variant Also Negotiates" error
 */
export class VariantAlsoNegotiatesError extends ResponseError {
    constructor(message?: string) {
        super(message || '(506) VARIANT ALSO NEGOTIATES', 506);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/507 | 507} "Insufficient Storage" error
 */
export class InsufficientStorageError extends ResponseError {
    constructor(message?: string) {
        super(message || '(507) INSUFFICIENT STORAGE', 507);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508 | 508} "Loop Detected" error
 */
export class LoopDetectedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(508) LOOP DETECTED', 508);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510 | 510} "Not Extended" error
 */
export class NotExtendedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(510) NOT EXTENDED', 510);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511 | 511} "Network Authentication" error
 */
export class NetworkAuthenticationError extends ResponseError {
    constructor(message?: string) {
        super(message || '(511) NETWORK AUTHENTICATION REQUIRED', 511);
    }
}

//===============================================================