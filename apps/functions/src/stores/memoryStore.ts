import type { IStore } from "./store.js";
import type { UiEventV1, ReceiptV1, DTO } from "../core/types.js";

export class MemoryStore implements IStore {
    private events: UiEventV1[] = [];
    private states = new Map<string, any>();
    private views = new Map<string, DTO>();
    private cache = new Map<string, { dto: DTO; receiptId: string }>();
    private receipts = new Map<string, ReceiptV1>();

    async appendEvent(e: UiEventV1) { this.events.push(e); }
    async listEventsBySession(sessionId: string) { return this.events.filter(e => e.sessionId === sessionId); }

    async putState(sessionId: string, state: any) { this.states.set(sessionId, state); }
    async getState(sessionId: string) { return this.states.get(sessionId) ?? null; }

    async putMaterializedView(key: string, dto: DTO) { this.views.set(key, dto); }
    async getMaterializedView(key: string) { return this.views.get(key) ?? null; }

    async putCache(inferenceUri: string, dto: DTO, receiptId: string) { this.cache.set(inferenceUri, { dto, receiptId }); }
    async getCache(inferenceUri: string) { return this.cache.get(inferenceUri) ?? null; }

    async appendReceipt(r: ReceiptV1) { this.receipts.set(r.receiptId, r); }
    async getReceipt(receiptId: string) { return this.receipts.get(receiptId) ?? null; }
}
