export class MemoryStore {
    events = [];
    states = new Map();
    views = new Map();
    cache = new Map();
    receipts = new Map();
    async appendEvent(e) { this.events.push(e); }
    async listEventsBySession(sessionId) { return this.events.filter(e => e.sessionId === sessionId); }
    async putState(sessionId, state) { this.states.set(sessionId, state); }
    async getState(sessionId) { return this.states.get(sessionId) ?? null; }
    async putMaterializedView(key, dto) { this.views.set(key, dto); }
    async getMaterializedView(key) { return this.views.get(key) ?? null; }
    async putCache(inferenceUri, dto, receiptId) { this.cache.set(inferenceUri, { dto, receiptId }); }
    async getCache(inferenceUri) { return this.cache.get(inferenceUri) ?? null; }
    async appendReceipt(r) { this.receipts.set(r.receiptId, r); }
    async getReceipt(receiptId) { return this.receipts.get(receiptId) ?? null; }
}
