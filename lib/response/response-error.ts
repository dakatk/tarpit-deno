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
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400 400} "Bad Request" error
 */
export class BadRequestError extends ResponseError {
    constructor(message?: string) {
        super(message || '(400) BAD REQUEST', 400);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401 401} "Unauthorized" error
 */
export class UnauthorizedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(401) UNAUTHORIZED', 401);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402 402} "Payment Required" error
 */
export class PaymentRequiredError extends ResponseError {
    constructor(message?: string) {
        super(message || '(402) PAYMENT REQUIRED', 402);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403 403} "Forbidden" error
 */
export class ForbiddenError extends ResponseError {
    constructor(message?: string) {
        super(message || '(403) FORBIDDEN', 403);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404 404} "Not Found" error
 */
export class NotFoundError extends ResponseError {
    constructor(message?: string) {
        super(message || '(404) NOT FOUND', 404);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405 405} "Method Not Allowed" error
 */
export class MethodNotAllowedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(405) METHOD NOT ALLOWED', 405);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406 406} "Not Acceptable" error
 */
export class NotAcceptableError extends ResponseError {
    constructor(message?: string) {
        super(message || '(406) NOT ACCEPTABLE', 406);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407 407} "Proxy Authentication Required" error
 */
export class ProxyAuthenticationRequiredError extends ResponseError {
    constructor(message?: string) {
        super(message || '(407) PROXY AUTHENTICATION REQUIRED', 407);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408 408} "Request Timeout" error
 */
export class RequestTimeoutError extends ResponseError {
    constructor(message?: string) {
        super(message || '(408) REQUEST TIMEOUT', 408);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409 409} "Conflict" error
 */
export class ConflictError extends ResponseError {
    constructor(message?: string) {
        super(message || '(409) CONFLICT', 409);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410 410} "Gone" error
 */
export class GoneError extends ResponseError {
    constructor(message?: string) {
        super(message || '(410) NOW I ONLY WANT YOU GONE', 410);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/411 411} "Length Required" error
 */
export class LengthRequiredError extends ResponseError {
    constructor(message?: string) {
        super(message || '(411) LENGTH REQUIRED', 411);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412 412} "Precondition Failed" error
 */
export class PreconditionFailedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(412) PRECONDITION FAILED', 412);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413 413} "Payload Too Large" error
 */
export class PayloadTooLargeError extends ResponseError {
    constructor(message?: string) {
        super(message || '(413) PAYLOAD TOO LARGE', 413);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414 414} "URI Too Long" error
 */
export class URITooLongError extends ResponseError {
    constructor(message?: string) {
        super(message || '(414) URI TOO LONG', 414);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415 415} "Unsupported Media Type" error
 */
export class UnsupportedMediaTypeError extends ResponseError {
    constructor(message?: string) {
        super(message || '(415) UNSUPPORTED MEDIA TYPE', 415);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416 416} "Range Not Satisfiable" error
 */
export class RangeNotSatisfiableError extends ResponseError {
    constructor(message?: string) {
        super(message || '(416) RANGE NOT SATISFIABLE', 416);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417 417} "Expectation Failed" error
 */
export class ExpectationFailedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(417) EXPECTATION FAILED', 417);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418 418} "I'm a teapot" error
 */
export class ImATeapotError extends ResponseError {
    constructor(message?: string) {
        super(message || "(418) i'm a little teapot", 418);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422 422} "Unprocessable Entity" error
 */
export class UnprocessableError extends ResponseError {
    constructor(message?: string) {
        super(message || '(422) UNPROCESSABLE ENTITY', 422);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425 425} "Too Early" error
 */
export class TooEarlyError extends ResponseError {
    constructor(message?: string) {
        super(message || '(425) TOO EARLY', 425);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426 426} "Upgrade Required" error
 */
export class UpgradeRequiredError extends ResponseError {
    constructor(message?: string) {
        super(message || '(426) UPGRADE REQUIRED', 426);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/428 428} "Precondition Required" error
 */
export class PreconditionRequiredError extends ResponseError {
    constructor(message?: string) {
        super(message || '(428) PRECONDITION REQUIRED', 428);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429 429} "Too Many Requests" error
 */
export class TooManyRequestsError extends ResponseError {
    constructor(message?: string) {
        super(message || '(429) TOO MANY REQUESTS', 429);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431 431} "Request Header Fields Too Large" error
 */
export class RequestHeaderFieldsTooLargeError extends ResponseError {
    constructor(message?: string) {
        super(message || '(431) REQUEST HEADER FIELDS TOO LARGE', 431);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451 451} "Unavailable For Legal Reasons" error
 */
export class UnavailableForLegalReasonsError extends ResponseError {
    constructor(message?: string) {
        super(message || '(451) UNAVAILABLE FOR LEGAL REASONS', 451);
    }
}

//===============================================================
// 500 Response errors:

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500 500} "Internal Server" error
 */
export class ServerError extends ResponseError {
    constructor(message?: string) {
        super(message || '(500) INTERNAL SERVER ERROR', 500);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501 501} "Not Implemented" error
 */
export class NotImplementedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(501) NOT IMPLENTED', 501);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502 502} "Bad Gateway" error
 */
export class BadGatewayError extends ResponseError {
    constructor(message?: string) {
        super(message || '(502) BAD GATEWAY', 502);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503 503} "Service Unavailable" error
 */
export class ServiceUnavailableError extends ResponseError {
    constructor(message?: string) {
        super(message || '(503) SERVICE UNAVAILABLE', 503);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504 504} "Gateway Timeout" error
 */
export class GatewayTimeoutError extends ResponseError {
    constructor(message?: string) {
        super(message || '(504) GATEWAY TIMEOUT', 504);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505 505} "HTTP Version Not Supported" error
 */
export class HTTPVersionNotSupportedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(505) HTTP VERSION NOT SUPPORTED', 505);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/506 506} "Variant Also Negotiates" error
 */
export class VariantAlsoNegotiatesError extends ResponseError {
    constructor(message?: string) {
        super(message || '(506) VARIANT ALSO NEGOTIATES', 506);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/507 507} "Insufficient Storage" error
 */
export class InsufficientStorageError extends ResponseError {
    constructor(message?: string) {
        super(message || '(507) INSUFFICIENT STORAGE', 507);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508 508} "Loop Detected" error
 */
export class LoopDetectedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(508) LOOP DETECTED', 508);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510 510} "Not Extended" error
 */
export class NotExtendedError extends ResponseError {
    constructor(message?: string) {
        super(message || '(510) NOT EXTENDED', 510);
    }
}

/**
 * HTTP {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511 511} "Network Authentication" error
 */
export class NetworkAuthenticationError extends ResponseError {
    constructor(message?: string) {
        super(message || '(511) NETWORK AUTHENTICATION REQUIRED', 511);
    }
}

//===============================================================