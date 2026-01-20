// Optional: persistence on Netlify via Upstash REST API.
// Keep behind interface so architecture stays agnostic.
async function upstash(cfg, command) {
    const res = await fetch(cfg.url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${cfg.token}`
        },
        body: JSON.stringify(command)
    });
    if (!res.ok)
        throw new Error(`Upstash error ${res.status}`);
    const json = await res.json();
    return json.result;
}
export class UpstashStore {
    cfg;
    constructor(cfg) {
        this.cfg = cfg;
    }
    k(prefix, id) { return `${prefix}:${id}`; }
    async appendEvent(e) {
        await upstash(this.cfg, ["RPUSH", this.k("events", e.sessionId), JSON.stringify(e)]);
    }
    async listEventsBySession(sessionId) {
        const arr = await upstash(this.cfg, ["LRANGE", this.k("events", sessionId), "0", "-1"]);
        return (arr || []).map(s => JSON.parse(s));
    }
    async putState(sessionId, state) {
        await upstash(this.cfg, ["SET", this.k("state", sessionId), JSON.stringify(state)]);
    }
    async getState(sessionId) {
        const s = await upstash(this.cfg, ["GET", this.k("state", sessionId)]);
        return s ? JSON.parse(s) : null;
    }
    async putMaterializedView(key, dto) {
        await upstash(this.cfg, ["SET", this.k("view", key), JSON.stringify(dto)]);
    }
    async getMaterializedView(key) {
        const s = await upstash(this.cfg, ["GET", this.k("view", key)]);
        return s ? JSON.parse(s) : null;
    }
    async putCache(inferenceUri, dto, receiptId) {
        await upstash(this.cfg, ["SET", this.k("cache", inferenceUri), JSON.stringify({ dto, receiptId })]);
    }
    async getCache(inferenceUri) {
        const s = await upstash(this.cfg, ["GET", this.k("cache", inferenceUri)]);
        return s ? JSON.parse(s) : null;
    }
    async appendReceipt(r) {
        await upstash(this.cfg, ["SET", this.k("receipt", r.receiptId), JSON.stringify(r)]);
    }
    async getReceipt(receiptId) {
        const s = await upstash(this.cfg, ["GET", this.k("receipt", receiptId)]);
        return s ? JSON.parse(s) : null;
    }
}
