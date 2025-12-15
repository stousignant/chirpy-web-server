import { Request, Response } from "express";
import { respond } from "./json.js";
import { BadRequestError } from "./errors.js"

const MAX_CHIRP_LENGTH = 140;
const BAD_WORDS = ["kerfuffle", "sharbert", "fornax"];
const HIDDEN_WORD = "****";

export async function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    // req.body is automatically parsed from express.json()
    const params: parameters = req.body;

    if (!params.body) {
        throw new BadRequestError(`Invalid JSON`);
    }

    if (params.body.length > MAX_CHIRP_LENGTH) {
        throw new BadRequestError(`Chirp is too long. Max length is ${MAX_CHIRP_LENGTH}`);
    }

    const cleanedBody = handleProfanity(params.body);
    respond(res, cleanedBody);
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