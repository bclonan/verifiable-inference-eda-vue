type ApiEnvelope<T> = {
    ok: boolean;
    viewSpecId?: string;
    view?: T;
    inference?: { used: boolean; receiptId?: string; receipt?: any; inferenceUri?: string };
    error?: string;
};

export function useApi() {
    const config = useRuntimeConfig();
    const base = config.public.apiBase as string;

    async function getJson<T>(path: string): Promise<T> {
        const res = await fetch(`${base}${path}`, { method: "GET" });
        const text = await res.text();
        try {
            return JSON.parse(text) as T;
        } catch {
            throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 200)}`);
        }
    }

    return {
        emitDemo: (sessionId: string) => getJson(`/demo/emit?sessionId=${encodeURIComponent(sessionId)}`),
        getView: (viewSpecId: string, sessionId: string) =>
            getJson<ApiEnvelope<any>>(`/views/${encodeURIComponent(viewSpecId)}?sessionId=${encodeURIComponent(sessionId)}`),
        verify: (receiptId: string) => getJson(`/verify?receiptId=${encodeURIComponent(receiptId)}`)
    };
}
