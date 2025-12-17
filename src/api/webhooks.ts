import { Request, Response } from "express";
import { upgradeUserToChirpyRed } from "../db/queries/users.js";
import { NotFoundError } from "./errors.js";

export enum Event {
    USER_UPGRADED = "user.upgraded",
}

export async function handlerWebhook(req: Request, res: Response) {
    type parameters = {
        event: string,
        data: { userId: string },
    }

    const params: parameters = req.body;

    if (params.event !== Event.USER_UPGRADED) {
        res.status(204).send();
        return;
    }

    const result = await upgradeUserToChirpyRed(params.data.userId);
    if (!result) {
        throw new NotFoundError("Could not find user");
    }

    res.status(204).send();
} 