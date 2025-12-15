import { Response } from "express";

type responseData = {
    valid: boolean;
    statusCode: number;
    error?: string;
}

export function respondWithJson(res: Response, errorMessage?: string) {
    const resBody: responseData = {
        valid: true,
        statusCode: 200,
    }

    if (errorMessage) {
        resBody.valid = false;
        resBody.statusCode = 400;
        resBody.error = errorMessage;
    }

    res.header('Content-Type', 'application/json');
    res.status(resBody.statusCode).send(JSON.stringify(resBody));
}