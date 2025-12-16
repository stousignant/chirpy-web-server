import { Request, Response } from "express";
import { respondWithJson } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string
    };

    // req.body is automatically parsed from express.json()
    const params: parameters = req.body;

    if (!params.email) {
        throw new BadRequestError("Missing required fields");
    }

    const user = await createUser({ email: params.email });

    if (!user) {
        throw new Error("Could not create user");
    }

    respondWithJson(res, 201, user);
}