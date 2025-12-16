import { Request, Response } from "express";
import { respondWithJson } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { hashPassword } from "../auth.js";
import { NewUser } from "src/db/schema.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        password: string,
        email: string,
    };

    // req.body is automatically parsed from express.json()
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
    } satisfies UserResponse);
}