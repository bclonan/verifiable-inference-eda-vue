export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const config = useRuntimeConfig()
    const base = config.public.apiBase
    const res = await fetch(`${base}${path}`, {
        headers: { "content-type": "application/json", ...(init?.headers || {}) },
        ...init
    })
    if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`API ${res.status}: ${text}`)
    }
    return res.json() as Promise<T>
}
