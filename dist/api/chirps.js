import { respondWithJson } from "./json.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { createChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
const MAX_CHIRP_LENGTH = 140;
const BAD_WORDS = ["kerfuffle", "sharbert", "fornax"];
const HIDDEN_WORD = "****";
export async function handlerCreateChirp(req, res) {
    // req.body is automatically parsed from express.json()
    const params = req.body;
    const cleanedBody = validateChirp(params.body);
    const chirp = await createChirp({ body: cleanedBody, userId: params.userId });
    if (!chirp) {
        throw new Error("Could not create chirp");
    }
    respondWithJson(res, 201, chirp);
}
export async function handlerGetAllChirps(req, res) {
    const result = await getAllChirps();
    respondWithJson(res, 200, result);
}
export async function handlerGetChirp(req, res) {
    const { chirpId } = req.params;
    const result = await getChirp(chirpId);
    if (!result) {
        throw new NotFoundError(`Chirp with ID: ${chirpId} not found`);
    }
    respondWithJson(res, 200, result);
}
function validateChirp(body) {
    if (!body) {
        throw new BadRequestError(`Invalid JSON`);
    }
    if (body.length > MAX_CHIRP_LENGTH) {
        throw new BadRequestError(`Chirp is too long. Max length is ${MAX_CHIRP_LENGTH}`);
    }
    return handleProfanity(body);
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
