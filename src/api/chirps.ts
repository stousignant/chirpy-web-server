import { Request, Response } from "express";
import { respondWithJson } from "./json.js";

const MAX_CHIRP_LENGTH = 140;

export async function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    let params: parameters;
    req.on("end", () => {
        try {
            params = JSON.parse(body);
            if (!params.body) {
                respondWithJson(res, "Invalid JSON");
                return;
            }
        } catch (e) {
            respondWithJson(res, "Invalid JSON");
            return;
        }

        if (params.body.length > MAX_CHIRP_LENGTH) {
            respondWithJson(res, "Chirp is too long");
            return;
        }

        respondWithJson(res);
    });
}