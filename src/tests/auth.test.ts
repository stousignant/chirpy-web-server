import { describe, it, expect, beforeAll } from "vitest";
import {
    checkPasswordHash,
    hashPassword,
    makeJwt,
    validateJwt,
    extractBearerToken,
    extractApiKey,
} from "../auth.js";
import { BadRequestError, UnauthorizedError } from "../api/errors.js";

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

describe("extractBearerToken", () => {
    it("should extract the token from a valid header", () => {
        const token = "mySecretToken";
        const header = `Bearer ${token}`;
        expect(extractBearerToken(header)).toBe(token);
    });

    it("should extract the token even if there are extra parts", () => {
        const token = "mySecretToken";
        const header = `Bearer ${token} extra-data`;
        expect(extractBearerToken(header)).toBe(token);
    });

    it("should throw a BadRequestError if the header does not contain at least two parts", () => {
        const header = "Bearer";
        expect(() => extractBearerToken(header)).toThrow(BadRequestError);
    });

    it('should throw a BadRequestError if the header does not start with "Bearer"', () => {
        const header = "Basic mySecretToken";
        expect(() => extractBearerToken(header)).toThrow(BadRequestError);
    });

    it("should throw a BadRequestError if the header is an empty string", () => {
        const header = "";
        expect(() => extractBearerToken(header)).toThrow(BadRequestError);
    });
});

describe("extractApiKey", () => {
    it("should extract the API Key from a valid header", () => {
        const apiKey = "myApiKey";
        const header = `ApiKey ${apiKey}`;
        expect(extractApiKey(header)).toBe(apiKey);
    });

    it("should extract the token even if there are extra parts", () => {
        const apiKey = "myApiKey";
        const header = `ApiKey ${apiKey} extra-data`;
        expect(extractApiKey(header)).toBe(apiKey);
    });

    it("should throw a BadRequestError if the header does not contain at least two parts", () => {
        const header = "";
        expect(() => extractApiKey(header)).toThrow(BadRequestError);
    });

    it('should throw a BadRequestError if the header does not start with "ApiKey"', () => {
        const header = "Basic mySecretApiKey";
        expect(() => extractApiKey(header)).toThrow(BadRequestError);
    });

    it("should throw a BadRequestError if the header is an empty string", () => {
        const header = "";
        expect(() => extractApiKey(header)).toThrow(BadRequestError);
    });
});