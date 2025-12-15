export function respondWithError(res, errorMessage) {
    const resData = {
        valid: false,
        statusCode: 400,
        error: errorMessage,
    };
    respondWithJson(res, resData);
}
export function respond(res, cleanedBody) {
    const resData = {
        valid: true,
        statusCode: 200,
        cleanedBody: cleanedBody,
    };
    respondWithJson(res, resData);
}
function respondWithJson(res, resData) {
    res.header('Content-Type', 'application/json');
    res.status(resData.statusCode).send(JSON.stringify(resData));
}
