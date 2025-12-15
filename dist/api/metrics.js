import { config } from "../config.js";
export async function handlerMetrics(_, res) {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(`Hits: ${config.fileserverHits}`);
}
