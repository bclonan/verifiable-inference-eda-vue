import type { UiEventV1, ReceiptV1, DTO } from "../core/types.js";

export interface IStore {
    appendEvent(e: UiEventV1): Promise<void>;
    listEventsBySession(sessionId: string): Promise<UiEventV1[]>;

    putState(sessionId: string, state: any): Promise<void>;
    getState(sessionId: string): Promise<any | null>;

    putMaterializedView(key: string, dto: DTO): Promise<void>;
    getMaterializedView(key: string): Promise<DTO | null>;

    putCache(inferenceUri: string, dto: DTO, receiptId: string): Promise<void>;
    getCache(inferenceUri: string): Promise<{ dto: DTO; receiptId: string } | null>;

    appendReceipt(r: ReceiptV1): Promise<void>;
    getReceipt(receiptId: string): Promise<ReceiptV1 | null>;
}
