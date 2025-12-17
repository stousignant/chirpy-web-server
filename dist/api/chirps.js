import { respondWithJson } from "./json.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./errors.js";
import { createChirp, getAllChirps, getChirp, deleteChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJwt } from "../auth.js";
import { config } from "../config.js";
const MAX_CHIRP_LENGTH = 140;
const BAD_WORDS = ["kerfuffle", "sharbert", "fornax"];
const HIDDEN_WORD = "****";
export async function handlerCreateChirp(req, res) {
    const params = req.body;
    const bearerToken = getBearerToken(req);
    const userId = validateJwt(bearerToken, config.jwt.secret);
    if (!userId) {
        throw new UnauthorizedError("Valid JWT is required to post a chirp");
    }
    const cleanedBody = validateChirp(params.body);
    const chirp = await createChirp({ body: cleanedBody, userId: userId });
    if (!chirp) {
        throw new Error("Could not create chirp");
    }
    respondWithJson(res, 201, chirp);
}
export async function handlerGetAllChirps(req, res) {
    let authorId = "";
    let authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }
    let sortDirection = "asc";
    let sortDirectionQuery = req.query.sort;
    if (sortDirectionQuery === "desc") {
        sortDirection = "desc";
    }
    const result = await getAllChirps(authorId, sortDirection);
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
export async function handlerDeleteChirp(req, res) {
    const { chirpId } = req.params;
    const bearerToken = getBearerToken(req);
    const userId = validateJwt(bearerToken, config.jwt.secret);
    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError(`Chirp with ID: ${chirpId} not found`);
    }
    if (chirp.userId !== userId) {
        throw new ForbiddenError(`You can't delete this chirp`);
    }
    const deleted = await deleteChirp(chirpId);
    if (!deleted) {
        throw new Error(`Failed to delete chirp with ID: ${chirpId}`);
    }
    res.status(204).send();
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
