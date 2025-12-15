export function respondWithJson(res, errorMessage) {
    const resBody = {
        valid: true,
        statusCode: 200,
    };
    if (errorMessage) {
        resBody.valid = false;
        resBody.statusCode = 400;
        resBody.error = errorMessage;
    }
    res.header('Content-Type', 'application/json');
    res.status(resBody.statusCode).send(JSON.stringify(resBody));
}
