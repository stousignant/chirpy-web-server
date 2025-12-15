import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export function middlewareLogResponse(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        const statusCode = res.statusCode;

        if (statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });

    next();
};

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    // Increment request count made to serve the homepage
    if (req.url === "/app/") {
        config.fileserverHits++;
    }

    next();
}