import { upgradeUserToChirpyRed } from "../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "./errors.js";
import { config } from "../config.js";
import { getApiKey } from "../auth.js";
export var Event;
(function (Event) {
    Event["USER_UPGRADED"] = "user.upgraded";
})(Event || (Event = {}));
export async function handlerWebhook(req, res) {
    const params = req.body;
    if (params.event !== Event.USER_UPGRADED) {
        res.status(204).send();
        return;
    }
    const headerApiKey = getApiKey(req);
    if (headerApiKey !== config.api.polkaApiKey) {
        throw new UnauthorizedError("Invalid API key");
    }
    const result = await upgradeUserToChirpyRed(params.data.userId);
    if (!result) {
        throw new NotFoundError("Could not find user");
    }
    res.status(204).send();
}
