import { checkPasswordHash, getBearerToken, makeJwt, makeRefreshToken } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { saveRefreshToken, userForRefreshToken, revokeRefreshToken } from "../db/queries/refreshTokens.js";
import { UnauthorizedError } from "./errors.js";
import { respondWithJson } from "./json.js";
import { config } from "../config.js";
export async function handlerLogin(req, res) {
    const params = req.body;
    const user = await getUserByEmail(params.email);
    if (!user) {
        throw new UnauthorizedError(`Incorrect email`);
    }
    const passwordMatched = await checkPasswordHash(params.password, user.hashedPassword);
    if (!passwordMatched) {
        throw new UnauthorizedError(`Incorrect password`);
    }
    const accessToken = makeJwt(user.id, config.jwt.accessTokenDuration, config.jwt.secret);
    const refreshToken = makeRefreshToken();
    const saved = await saveRefreshToken(user.id, refreshToken);
    if (!saved) {
        throw new UnauthorizedError("Could not save refresh token");
    }
    respondWithJson(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.isChirpyRed,
        token: accessToken,
        refreshToken: refreshToken,
    });
}
export async function handlerRefreshToken(req, res) {
    const bearerToken = getBearerToken(req);
    const result = await userForRefreshToken(bearerToken);
    if (!result) {
        throw new UnauthorizedError("Invalid refresh token");
    }
    const user = result.user;
    const accessToken = makeJwt(user.id, config.jwt.accessTokenDuration, config.jwt.secret);
    respondWithJson(res, 200, {
        token: accessToken
    });
}
export async function handlerRevokeToken(req, res) {
    const bearerToken = getBearerToken(req);
    await revokeRefreshToken(bearerToken);
    res.status(204).send();
}
