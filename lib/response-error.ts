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
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
 */
export class BadRequestError extends ResponseError {
    constructor(message?: string) {
        super(message || '(400) BAD REQUEST', 400);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
 */
 export class UnauthorizedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(401) UNAUTHORIZED', 401);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402
 */
 export class PaymentRequiredError extends ResponseError {
    constructor(message?: string) {
        super(message || '(402) PAYMENT REQUIRED', 402);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
 */
 export class ForbiddenError extends ResponseError {
    constructor(message?: string) {
        super(message || '(403) FORBIDDEN', 403);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
 */
export class NotFoundError extends ResponseError {
    constructor(message?: string) {
        super(message || '(404) NOT FOUND', 404);
    }
}

//===============================================================
// 500 Response errors:

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
 */
export class ServerError extends ResponseError {
    constructor(message?: string) {
        super(message || '(500) INTERNAL SERVER ERROR', 500);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501
 */
export class NotImplementedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(501) NOT IMPLENTED', 501);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502
 */
export class BadGatewayError extends ResponseError {
    constructor(message?: string) {
        super(message || '(502) BAD GATEWAY', 502);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503
 */
export class ServiceUnavailableError extends ResponseError {
    constructor(message?: string) {
        super(message || '(503) SERVICE UNAVAILABLE', 503);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
 */
export class GatewayTimeoutError extends ResponseError {
    constructor(message?: string) {
        super(message || '(504) GATEWAY TIMEOUT', 504);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505
 */
export class HTTPVersionNotSupportedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(505) HTTP VERSION NOT SUPPORTED', 505);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/506
 */
export class VariantAlsoNegotiatesError extends ResponseError {
    constructor(message?: string) {
        super(message || '(506) VARIANT ALSO NEGOTIATES', 506);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/507
 */
export class InsufficientStorageError extends ResponseError {
    constructor(message?: string) {
        super(message || '(507) INSUFFICIENT STORAGE', 507);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
 */
export class LoopDetectedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(508) LOOP DETECTED', 508);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510
 */
export class NotExtendedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(510) NOT EXTENDED', 510);
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511
 */
export class NetworkAuthenticationError extends ResponseError {
    constructor(message?: string) {
        super(message || '(511) NETWORK AUTHENTICATION REQUIRED', 511);
    }
}

//===============================================================