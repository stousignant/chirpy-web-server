import { checkPasswordHash, makeJwt } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { UnauthorizedError } from "./errors.js";
import { respondWithJson } from "./json.js";
import { config } from "../config.js";
export async function handlerLogin(req, res) {
    // req.body is automatically parsed from express.json()
    const params = req.body;
    const user = await getUserByEmail(params.email);
    if (!user) {
        throw new UnauthorizedError(`Incorrect email`);
    }
    const passwordMatched = await checkPasswordHash(params.password, user.hashedPassword);
    if (!passwordMatched) {
        throw new UnauthorizedError(`Incorrect password`);
    }
    let duration = config.jwt.defaultDuration;
    if (params.expiresIn && !(params.expiresIn > config.jwt.defaultDuration)) {
        duration = params.expiresIn;
    }
    const accessToken = makeJwt(user.id, duration, config.jwt.secret);
    respondWithJson(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: accessToken,
    });
}
