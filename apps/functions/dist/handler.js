import { json, badRequest } from "./http.js";
import { MemoryStore } from "./stores/memoryStore.js";
import { UpstashStore } from "./stores/upstashStore.js";
import { ingestEvent } from "./system/eventIngest.js";
import { deriveSessionState } from "./system/stateDeriver.js";
import { buildView } from "./system/viewBuilder.js";
import { verifyReceipt } from "./system/verify.js";
import { randomUUID } from "node:crypto";
function getStore() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token)
        return new UpstashStore({ url, token });
    return new MemoryStore();
}
function ulidLike() {
    // Not a real ULID; sufficient for demo v0.1
    return randomUUID().replace(/-/g, "").slice(0, 26).toUpperCase();
}
export const handler = async (event) => {
    try {
        const store = getStore();
        const org = process.env.ORG || "acme";
        const domain = process.env.DOMAIN || "ux";
        const seed = process.env.RECEIPT_SIGNING_SEED_HEX || "00".repeat(32);
        const path = (event.path || "").replace(/^\/\.netlify\/functions\/handler/, "");
        const method = event.httpMethod || "GET";
        const qs = event.queryStringParameters || {};
        // Demo emit
        if (method === "GET" && path.startsWith("/demo/emit")) {
            const sessionId = qs.sessionId || "S123";
            const now = new Date().toISOString();
            const demoEvents = [
                { eventType: "ui.event", eventVersion: 1, ulid: ulidLike(), timestamp: now, actorId: null, sessionId, correlationId: sessionId, privacyTags: ["PII:none"], payload: { actionType: "page_view", page: "/pricing" } },
                { eventType: "ui.event", eventVersion: 1, ulid: ulidLike(), timestamp: now, actorId: null, sessionId, correlationId: sessionId, privacyTags: ["PII:none"], payload: { actionType: "click", page: "/pricing", buttonId: "buy" } },
                { eventType: "ui.event", eventVersion: 1, ulid: ulidLike(), timestamp: now, actorId: null, sessionId, correlationId: sessionId, privacyTags: ["PII:none"], payload: { actionType: "checkout_step", step: "shipping" } }
            ];
            for (const e of demoEvents)
                await ingestEvent(store, e);
            await deriveSessionState(store, sessionId);
            return json(200, { ok: true, emitted: demoEvents.length, sessionId });
        }
        // POST /events
        if (method === "POST" && path === "/events") {
            if (!event.body)
                return badRequest("Missing body");
            const e = JSON.parse(event.body);
            await ingestEvent(store, e);
            await deriveSessionState(store, e.sessionId);
            return json(200, { ok: true });
        }
        // GET /views/:viewSpecId?sessionId=
        if (method === "GET" && path.startsWith("/views/")) {
            const viewSpecId = decodeURIComponent(path.replace("/views/", ""));
            const sessionId = qs.sessionId;
            if (!sessionId)
                return badRequest("Missing sessionId");
            await deriveSessionState(store, sessionId);
            const out = await buildView({ store, viewSpecId, sessionId, org, domain, receiptSigningSeedHex: seed });
            // For deterministic views, return DTO directly; for inference views, return extra receipt info
            if (out.receiptId)
                return json(200, {
                    ok: true,
                    viewSpecId,
                    view: out.view,
                    inference: { used: true, receiptId: out.receiptId, receipt: out.receipt, inferenceUri: out.inferenceUri }
                });
            return json(200, out.view);
        }
        // GET /verify?receiptId=
        if (method === "GET" && path === "/verify") {
            const receiptId = qs.receiptId;
            if (!receiptId)
                return badRequest("Missing receiptId");
            const out = await verifyReceipt(store, receiptId);
            return json(200, out);
        }
        return json(404, { ok: false, error: "Not found", path, method });
    }
    catch (err) {
        return json(500, { ok: false, error: err?.message || String(err) });
    }
};
