import { Response } from "express";

export function respondWithError(res: Response, code: number, message: string) {
    respondWithJson(res, code, message);
}

export function respondWithJson(res: Response, code: number, payload: any) {
    res.header('Content-Type', 'application/json');
    const body = JSON.stringify(payload);
    res.status(code).send(body);
}