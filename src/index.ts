import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { handlerValidateChirp } from "./api/chirps.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";

const app = express();
const PORT = 8080;

// Built-in JSON body parsing middleware
app.use(express.json());
app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
