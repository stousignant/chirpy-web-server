import { Request, Response } from "express";
import { respondWithJson } from "./json.js";

const MAX_CHIRP_LENGTH = 140;

export async function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    // req.body is automatically parsed from express.json()
    const params: parameters = req.body;

    if (!params.body) {
        respondWithJson(res, "Invalid JSON");
        return;
    }

    if (params.body.length > MAX_CHIRP_LENGTH) {
        respondWithJson(res, "Chirp is too long");
        return;
    }

    respondWithJson(res);
}