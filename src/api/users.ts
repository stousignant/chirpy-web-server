import { Request, Response } from "express";
import { respondWithJson } from "./json.js";
import { createUser, updateUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { getBearerToken, hashPassword, validateJwt } from "../auth.js";
import { NewUser } from "../db/schema.js";
import { config } from "../config.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        password: string,
        email: string,
    };

    const params: parameters = req.body;

    if (!params.password || !params.email) {
        throw new BadRequestError("Missing required fields (password and/or email)");
    }

    const hashedPassword = await hashPassword(params.password);
    const user = await createUser({
        hashedPassword,
        email: params.email,
    } satisfies NewUser);

    if (!user) {
        throw new Error("Could not create user");
    }

    respondWithJson(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.isChirpyRed,
    } satisfies UserResponse);
}

export async function handlerUpdateUser(req: Request, res: Response) {
    type parameters = {
        password: string,
        email: string,
    };

    const bearerToken = getBearerToken(req);
    const userId = validateJwt(bearerToken, config.jwt.secret);

    const params: parameters = req.body;

    if (!params.password || !params.email) {
        throw new BadRequestError("Missing required fields");
    }

    const hashedPassword = await hashPassword(params.password);
    const updatedUser = await updateUser(userId, params.email, hashedPassword);

    respondWithJson(res, 200, {
        id: updatedUser.id,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
    } satisfies UserResponse);
}