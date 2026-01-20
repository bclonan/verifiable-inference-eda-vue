<template>
  <main style="max-width: 980px; margin: 0 auto; padding: 24px; font-family: ui-sans-serif, system-ui;">
    <h1>Verifiable Inference EDA — v0.1</h1>
    <p>
      Deterministic core (events→state→views) with a bounded inference plane (Inference URI + receipts).
    </p>

    <section style="display:flex; gap:12px; flex-wrap:wrap; margin:16px 0;">
      <button @click="emitDemo" :disabled="busy">Emit Demo Events</button>
      <button @click="getActivity" :disabled="busy">Get session_activity@1</button>
      <button @click="getSummary" :disabled="busy">Get session_summary@1 (inference)</button>
      <button @click="verifyLast" :disabled="busy || !lastReceiptId">Verify last receipt</button>
    </section>

    <section style="display:grid; grid-template-columns: 1fr; gap: 16px;">
      <div>
        <h3>Session</h3>
        <label>sessionId:</label>
        <input v-model="sessionId" style="width: 260px; margin-left: 8px;" />
      </div>

      <div v-if="activity">
        <h3>Deterministic View Output (session_activity@1)</h3>
        <pre>{{ activity }}</pre>
      </div>

      <div v-if="summary">
        <h3>Inference View Output (session_summary@1)</h3>
        <pre>{{ summary }}</pre>
      </div>

      <div v-if="lastReceipt">
        <h3>Receipt</h3>
        <pre>{{ lastReceipt }}</pre>
      </div>

      <div v-if="verifyResult">
        <h3>Verify Result</h3>
        <pre>{{ verifyResult }}</pre>
      </div>

      <div v-if="error" style="color: #b91c1c;">
        <h3>Error</h3>
        <pre>{{ error }}</pre>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { apiFetch } from "../utils/api"

const sessionId = ref("S123")
const busy = ref(false)
const error = ref<string | null>(null)

const activity = ref<any>(null)
const summary = ref<any>(null)
const lastReceiptId = ref<string | null>(null)
const lastReceipt = ref<any>(null)
const verifyResult = ref<any>(null)

async function run(fn: () => Promise<void>) {
  busy.value = true
  error.value = null
  try { await fn() } catch (e: any) { error.value = e?.message || String(e) }
  finally { busy.value = false }
}

async function emitDemo() {
  await run(async () => {
    const out = await apiFetch<{ ok: boolean; emitted: number }>(`/demo/emit?sessionId=${encodeURIComponent(sessionId.value)}`)
    activity.value = null
    summary.value = null
    lastReceiptId.value = null
    lastReceipt.value = null
    verifyResult.value = out
  })
}

async function getActivity() {
  await run(async () => {
    activity.value = await apiFetch(`/views/ux.session_activity@1?sessionId=${encodeURIComponent(sessionId.value)}`)
  })
}

async function getSummary() {
  await run(async () => {
    const out = await apiFetch<any>(`/views/ux.session_summary@1?sessionId=${encodeURIComponent(sessionId.value)}`)
    summary.value = out.view
    lastReceiptId.value = out.receiptId
    lastReceipt.value = out.receipt
  })
}

async function verifyLast() {
  await run(async () => {
    if (!lastReceiptId.value) return
    verifyResult.value = await apiFetch(`/verify?receiptId=${encodeURIComponent(lastReceiptId.value)}`)
  })
}
</script>
