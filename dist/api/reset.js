import { config } from "../config.js";
export async function handlerReset(_, res) {
    config.api.fileServerHits = 0;
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send("Metrics hits have been reset to 0.");
}
