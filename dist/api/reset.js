import { config, Platform } from "../config.js";
import { deleteAllUsers } from "../db/queries/users.js";
import { ForbiddenError } from "./errors.js";
export async function handlerReset(_, res) {
    if (config.api.platform != Platform.DEV) {
        throw new ForbiddenError("The reset action is forbidden on non-dev environment.");
    }
    config.api.fileServerHits = 0;
    deleteAllUsers();
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send("Metrics hits have been reset to 0 and all users have been deleted.");
}
