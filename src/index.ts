import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { handlerValidateChirp } from "./api/chirps.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { middlewareLogResponse, middlewareMetricsInc, middlewareError } from "./api/middleware.js";

const app = express();
const PORT = 8080;

// Built-in JSON body parsing middleware
app.use(express.json());
app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.post("/api/validate_chirp", (req, res, next) => {
    Promise.resolve(handlerValidateChirp(req, res)).catch(next);
});

app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerReset(req, res)).catch(next);
});

// IMPORTANT - Error handling middleware needs to be defined last, after other app.use() and routes
app.use(middlewareError);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
