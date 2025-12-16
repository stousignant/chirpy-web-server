import { Request, Response } from "express";
import { respondWithJson } from "./json.js";
import { BadRequestError } from "./errors.js";
import { createChirp } from "../db/queries/chirps.js";

const MAX_CHIRP_LENGTH = 140;
const BAD_WORDS = ["kerfuffle", "sharbert", "fornax"];
const HIDDEN_WORD = "****";

export async function handlerCreateChirp(req: Request, res: Response) {
    type parameters = {
        body: string,
        userId: string,
    };

    // req.body is automatically parsed from express.json()
    const params: parameters = req.body;

    if (!params.body) {
        throw new BadRequestError(`Invalid JSON`);
    }

    if (params.body.length > MAX_CHIRP_LENGTH) {
        throw new BadRequestError(`Chirp is too long. Max length is ${MAX_CHIRP_LENGTH}`);
    }

    params.body = handleProfanity(params.body);

    const chirp = await createChirp(params);

    if (!chirp) {
        throw new Error("Could not create chirp");
    }

    respondWithJson(res, 201, chirp);
}

function handleProfanity(message: string): string {
    let words = message.split(" ");
    let cleanWords = [];

    for (const word of words) {
        let hasProfanity = BAD_WORDS.includes(word.toLowerCase());
        cleanWords.push(hasProfanity ? HIDDEN_WORD : word);
    }

    return cleanWords.join(" ");
}
