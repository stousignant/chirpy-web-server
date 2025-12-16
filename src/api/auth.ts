import { checkPasswordHash } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { UnauthorizedError } from "./errors.js";
import { respondWithJson } from "./json.js";

import type { Request, Response } from "express";
import type { UserResponse } from "./users.js";

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

    respondWithJson(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } satisfies UserResponse);
}