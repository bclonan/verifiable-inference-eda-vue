// Optional: persistence on Netlify via Upstash REST API.
// Keep behind interface so architecture stays agnostic.

import type { IStore } from "./store.js";
import type { UiEventV1, ReceiptV1, DTO } from "../core/types.js";

type UpstashCfg = { url: string; token: string };

async function upstash<T>(cfg: UpstashCfg, command: any[]): Promise<T> {
    const res = await fetch(cfg.url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${cfg.token}`
        },
        body: JSON.stringify(command)
    });
    if (!res.ok) throw new Error(`Upstash error ${res.status}`);
    const json = await res.json();
    return json.result as T;
}

export class UpstashStore implements IStore {
    constructor(private cfg: UpstashCfg) { }

    private k(prefix: string, id: string) { return `${prefix}:${id}`; }

    async appendEvent(e: UiEventV1) {
        await upstash(this.cfg, ["RPUSH", this.k("events", e.sessionId), JSON.stringify(e)]);
    }

    async listEventsBySession(sessionId: string) {
        const arr = await upstash<string[]>(this.cfg, ["LRANGE", this.k("events", sessionId), "0", "-1"]);
        return (arr || []).map(s => JSON.parse(s));
    }

    async putState(sessionId: string, state: any) {
        await upstash(this.cfg, ["SET", this.k("state", sessionId), JSON.stringify(state)]);
    }

    async getState(sessionId: string) {
        const s = await upstash<string | null>(this.cfg, ["GET", this.k("state", sessionId)]);
        return s ? JSON.parse(s) : null;
    }

    async putMaterializedView(key: string, dto: DTO) {
        await upstash(this.cfg, ["SET", this.k("view", key), JSON.stringify(dto)]);
    }

    async getMaterializedView(key: string) {
        const s = await upstash<string | null>(this.cfg, ["GET", this.k("view", key)]);
        return s ? JSON.parse(s) : null;
    }

    async putCache(inferenceUri: string, dto: DTO, receiptId: string) {
        await upstash(this.cfg, ["SET", this.k("cache", inferenceUri), JSON.stringify({ dto, receiptId })]);
    }

    async getCache(inferenceUri: string) {
        const s = await upstash<string | null>(this.cfg, ["GET", this.k("cache", inferenceUri)]);
        return s ? JSON.parse(s) : null;
    }

    async appendReceipt(r: ReceiptV1) {
        await upstash(this.cfg, ["SET", this.k("receipt", r.receiptId), JSON.stringify(r)]);
    }

    async getReceipt(receiptId: string) {
        const s = await upstash<string | null>(this.cfg, ["GET", this.k("receipt", receiptId)]);
        return s ? JSON.parse(s) : null;
    }
}
