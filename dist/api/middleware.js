import { config } from "../config.js";
import { respondWithError } from "./json.js";
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from "./errors.js";
export function middlewareLogResponse(req, res, next) {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}
;
export function middlewareMetricsInc(_, __, next) {
    config.api.fileServerHits++;
    next();
}
export function middlewareError(err, _, res, __) {
    let message = "Something went wrong on our end";
    let statusCode = 500;
    if (err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message;
    }
    else if (err instanceof UnauthorizedError) {
        statusCode = 401;
        message = err.message;
    }
    else if (err instanceof ForbiddenError) {
        statusCode = 403;
        message = err.message;
    }
    else if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    }
    if (statusCode >= 500) {
        console.log(err.message);
    }
    respondWithError(res, statusCode, message);
}
