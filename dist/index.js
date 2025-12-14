import express from "express";
const app = express();
const PORT = 8080;
//app.use(express.static("."));
app.use("/app", express.static("./src/app"));
app.get("/healthz", handlerReadiness);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
function handlerReadiness(req, res) {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    // TODO :: missing body text?
    console.log(`req.body = ${req.body}`);
    res.send("OK");
}
