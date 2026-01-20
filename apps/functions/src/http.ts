export function json(statusCode: number, body: any) {
    return {
        statusCode,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body, null, 2)
    };
}

export function badRequest(msg: string) {
    return json(400, { ok: false, error: msg });
}
