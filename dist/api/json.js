export function respondWithError(res, code, message) {
    respondWithJson(res, code, message);
}
export function respondWithJson(res, code, payload) {
    res.header('Content-Type', 'application/json');
    const body = JSON.stringify(payload);
    res.status(code).send(body);
}
