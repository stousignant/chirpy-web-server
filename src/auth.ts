import * as argon2 from "argon2";
import * as crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "./api/errors.js";
import { config } from "./config.js"
import type { Request } from "express";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
}

export function makeJwt(userId: string, expiresIn: number, secret: string): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const payload = {
        iss: config.jwt.issuer,
        sub: userId,
        iat: issuedAt,
        exp: issuedAt + expiresIn,
    } satisfies payload;
    const token = jwt.sign(payload, secret, { algorithm: "HS256" });
    return token;
}

export function validateJwt(tokenString: string, secret: string): string {
    let decoded: payload;
    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (err) {
        throw new UnauthorizedError("Invalid JWT token");
    }

    if (decoded.iss !== config.jwt.issuer) {
        throw new UnauthorizedError("Invalid JWT issuer");
    }

    const userId = decoded.sub;
    if (!userId) {
        throw new UnauthorizedError("No user ID in token");
    }

    return userId;
}

export function getBearerToken(req: Request): string {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new UnauthorizedError("No authorization header found");
    }

    return extractBearerToken(authHeader);
}

export function extractBearerToken(header: string) {
    const splitAuth = header.split(" ");
    if (splitAuth.length < 2 || splitAuth[0] !== "Bearer") {
        throw new BadRequestError("Malformed authorization header");
    }
    return splitAuth[1];
}

export function makeRefreshToken() {
    return crypto.randomBytes(256).toString("hex");
}

export function getApiKey(req: Request) {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new UnauthorizedError("No authorization header found");
    }

    return extractApiKey(authHeader);
}

export function extractApiKey(header: string) {
    const splitAuth = header.split(" ");
    if (splitAuth.length < 2 || splitAuth[0] !== "ApiKey") {
        throw new BadRequestError("Malformed authorization header");
    }
    return splitAuth[1];
}
