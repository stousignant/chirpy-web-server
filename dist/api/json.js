export function respondWithError(res, statusCode, errorMessage) {
    const resData = {
        valid: false,
        statusCode: statusCode,
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
