import {
    checkPasswordHash,
    getBearerToken,
    makeJwt,
    makeRefreshToken
} from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { saveRefreshToken, userForRefreshToken, revokeRefreshToken } from "../db/queries/refreshTokens.js";
import { UnauthorizedError } from "./errors.js";
import { respondWithJson } from "./json.js";

import type { Request, Response } from "express";
import type { UserResponse } from "./users.js";
import { config } from "../config.js";

type LoginResponse = UserResponse & {
    token: string;
    refreshToken: string,
};

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string,
        email: string,
    };

    // req.body is automatically parsed from express.json()
    const params: parameters = req.body;

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
        token: accessToken,
        refreshToken: refreshToken,
    } satisfies LoginResponse);
}

export async function handlerRefreshToken(req: Request, res: Response) {
    const bearerToken = getBearerToken(req);

    const result = await userForRefreshToken(bearerToken);
    if (!result) {
        throw new UnauthorizedError("Invalid refresh token");
    }

    const user = result.user;
    const accessToken = makeJwt(user.id, config.jwt.accessTokenDuration, config.jwt.secret);

    type response = {
        token: string;
    };

    respondWithJson(res, 200, {
        token: accessToken
    } satisfies response);
}

export async function handlerRevokeToken(req: Request, res: Response) {
    const bearerToken = getBearerToken(req);
    await revokeRefreshToken(bearerToken);
    res.status(204).send();
}