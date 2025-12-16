import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "./api/errors.js";

const TOKEN_ISSUER = "chirpy";

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
        iss: TOKEN_ISSUER,
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

    if (decoded.iss !== TOKEN_ISSUER) {
        throw new UnauthorizedError("Invalid JWT issuer");
    }

    const userId = decoded.sub;
    if (!userId) {
        throw new UnauthorizedError("No user ID in token");
    }

    return userId;
}