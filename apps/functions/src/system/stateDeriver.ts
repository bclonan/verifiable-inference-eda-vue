import type { IStore } from "../stores/store.js";

export async function deriveSessionState(store: IStore, sessionId: string): Promise<any> {
    const events = await store.listEventsBySession(sessionId);
    const counts: Record<string, number> = {};
    let lastAction: string | null = null;

    for (const e of events) {
        const a = e.payload?.actionType || e.eventType;
        counts[a] = (counts[a] || 0) + 1;
        lastAction = a;
    }

    const state = {
        sessionId,
        totalEvents: events.length,
        counts,
        lastAction,
        updatedAt: new Date().toISOString()
    };

    await store.putState(sessionId, state);
    return state;
}
