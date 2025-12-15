import { Response } from "express";

type responseData = {
    valid: boolean;
    statusCode: number;
    cleanedBody?: string;
    error?: string;
}

export function respondWithError(res: Response, errorMessage: string) {
    const resData: responseData = {
        valid: false,
        statusCode: 400,
        error: errorMessage,
    }

    respondWithJson(res, resData);
}

export function respond(res: Response, cleanedBody: string) {
    const resData: responseData = {
        valid: true,
        statusCode: 200,
        cleanedBody: cleanedBody,
    }

    respondWithJson(res, resData);
}

function respondWithJson(res: Response, resData: responseData) {
    res.header('Content-Type', 'application/json');
    res.status(resData.statusCode).send(JSON.stringify(resData));
}

