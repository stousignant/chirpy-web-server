import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./api/errors.js";
const TOKEN_ISSUER = "chirpy";
export async function hashPassword(password) {
    return argon2.hash(password);
}
export async function checkPasswordHash(password, hash) {
    return argon2.verify(hash, password);
}
export function makeJwt(userId, expiresIn, secret) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const payload = {
        iss: TOKEN_ISSUER,
        sub: userId,
        iat: issuedAt,
        exp: issuedAt + expiresIn,
    };
    const token = jwt.sign(payload, secret, { algorithm: "HS256" });
    return token;
}
export function validateJwt(tokenString, secret) {
    let decoded;
    try {
        decoded = jwt.verify(tokenString, secret);
    }
    catch (err) {
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
