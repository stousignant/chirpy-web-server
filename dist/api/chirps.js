import { respondWithJson } from "./json.js";
import { BadRequestError } from "./errors.js";
import { createChirp, getAllChirps } from "../db/queries/chirps.js";
const MAX_CHIRP_LENGTH = 140;
const BAD_WORDS = ["kerfuffle", "sharbert", "fornax"];
const HIDDEN_WORD = "****";
export async function handlerCreateChirp(req, res) {
    // req.body is automatically parsed from express.json()
    const params = req.body;
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
export async function handlerGetAllChirps(req, res) {
    const result = await getAllChirps();
    respondWithJson(res, 200, result);
}
function handleProfanity(message) {
    let words = message.split(" ");
    let cleanWords = [];
    for (const word of words) {
        let hasProfanity = BAD_WORDS.includes(word.toLowerCase());
        cleanWords.push(hasProfanity ? HIDDEN_WORD : word);
    }
    return cleanWords.join(" ");
}
