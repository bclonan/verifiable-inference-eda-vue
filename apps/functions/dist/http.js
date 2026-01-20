export function json(statusCode, body) {
    return {
        statusCode,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body, null, 2)
    };
}
export function badRequest(msg) {
    return json(400, { ok: false, error: msg });
}
