import { respondWithJson } from "./json.js";
const MAX_CHIRP_LENGTH = 140;
export async function handlerValidateChirp(req, res) {
    // req.body is automatically parsed from express.json()
    const params = req.body;
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
