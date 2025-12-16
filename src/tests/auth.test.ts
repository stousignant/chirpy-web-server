import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJwt, validateJwt } from "../auth.js";
import { UnauthorizedError } from "../api/errors.js";

describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });

    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });

    it("should return false for the incorrect password", async () => {
        const result = await checkPasswordHash("wrong_password", hash1);
        expect(result).toBe(false);
    });

    it("should return false when password doesn't match a different hash", async () => {
        const result = await checkPasswordHash(password1, hash2);
        expect(result).toBe(false);
    });

    it("should return false for an empty password", async () => {
        const result = await checkPasswordHash("", hash1);
        expect(result).toBe(false);
    });

    it("should return false for an invalid hash", async () => {
        const result = await checkPasswordHash(password1, "$argon2id$v=19$m=65536,t=3,p=4$SangIWHWZqKIjJLpxdpIdQ$Vx/n52X67VqY32rAursF3ukxjBYGY4FgpevoU+MsTHX");
        expect(result).toBe(false);
    });
});

describe("JWT Functions", () => {
    const userId = "some-unique-user-id";
    const secret = "secret";
    let validToken: string;
    let expiredToken: string;

    beforeAll(async () => {
        validToken = makeJwt(userId, 10000, secret);
        expiredToken = makeJwt(userId, 0, secret);
    });

    it("should validate a valid token", async () => {
        const result = validateJwt(validToken, secret);
        expect(result).toBe(userId);
    });

    it("should throw an error when the token is signed with a wrong secret", async () => {
        expect(() => validateJwt(validToken, "wrong_secret")).toThrow(UnauthorizedError);
    });

    it("should throw an error for an invalid token string", () => {
        expect(() => validateJwt("invalid.token.string", secret)).toThrow(UnauthorizedError);
    });

    it("should throw an error for an expired token", async () => {
        expect(() => validateJwt(expiredToken, secret)).toThrowError(UnauthorizedError);
    });
});