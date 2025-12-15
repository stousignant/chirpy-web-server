import { config } from "../config.js";
export async function handlerReset(_, res) {
    config.fileserverHits = 0;
    res.send("Metrics hits have been reset to 0.");
}
