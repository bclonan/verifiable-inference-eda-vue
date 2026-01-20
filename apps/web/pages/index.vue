<script setup lang="ts">
import { useApi } from "@/composables/useApi";
import { adapt } from "@/adapters";
import SemanticRenderer from "@/components/semantic/SemanticRenderer.vue";

const api = useApi();

const sessionId = ref("S123");
const viewSpecId = ref<"ux.session_activity@1" | "ux.session_summary@1">("ux.session_activity@1");

const busy = ref(false);
const status = ref<string>("");

const blocks = ref<any[]>([]);
const lastReceiptId = ref<string>("");
const lastVerify = ref<any>(null);

async function emitDemo() {
  busy.value = true;
  status.value = "Emitting demo events…";
  try {
    const res = await api.emitDemo(sessionId.value);
    status.value = `Emitted ${res.emitted} events for ${res.sessionId}`;
  } catch (e: any) {
    status.value = `Error: ${e.message}`;
  } finally {
    busy.value = false;
  }
}

async function fetchView() {
  busy.value = true;
  status.value = `Fetching ${viewSpecId.value}…`;
  try {
    const res = await api.getView(viewSpecId.value, sessionId.value);

    if (!res.ok) throw new Error(res.error || "Unknown error");
    const dto = res.view ?? res; // tolerate older envelopes

    const inference = res.inference || (res.receiptId ? { used: true, receiptId: res.receiptId, receipt: res.receipt } : { used: false });

    // store receiptId for verify
    if (inference.used && inference.receiptId) lastReceiptId.value = inference.receiptId;

    blocks.value = adapt(viewSpecId.value, dto, inference);
    status.value = `Loaded ${viewSpecId.value}`;
  } catch (e: any) {
    status.value = `Error: ${e.message}`;
  } finally {
    busy.value = false;
  }
}

async function verifyLast() {
  if (!lastReceiptId.value) {
    status.value = "No receiptId yet. Fetch an inference view first.";
    return;
  }
  busy.value = true;
  status.value = `Verifying ${lastReceiptId.value}…`;
  try {
    lastVerify.value = await api.verify(lastReceiptId.value);
    status.value = lastVerify.value?.pass ? "VERIFY: PASS ✅" : "VERIFY: FAIL ❌";
  } catch (e: any) {
    status.value = `Error: ${e.message}`;
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="wrap">
    <header class="hdr">
      <div class="brand">
        <div class="title">Verifiable Inference EDA</div>
        <div class="sub">
          Events → State → Views • Inference URI • Receipt + Evidence • Verify & Replay
        </div>
      </div>

      <div class="controls">
        <div class="field">
          <div class="lbl">sessionId</div>
          <input v-model="sessionId" class="inp" placeholder="S123" />
        </div>

        <div class="field">
          <div class="lbl">viewSpecId</div>
          <select v-model="viewSpecId" class="inp">
            <option value="ux.session_activity@1">ux.session_activity@1 (deterministic)</option>
            <option value="ux.session_summary@1">ux.session_summary@1 (inference + receipt)</option>
          </select>
        </div>

        <div class="btns">
          <button class="btn" :disabled="busy" @click="emitDemo">Emit Demo Events</button>
          <button class="btn primary" :disabled="busy" @click="fetchView">Get View</button>
          <button class="btn" :disabled="busy" @click="verifyLast">Verify Last Receipt</button>
        </div>
      </div>

      <div class="status">
        <div class="pill" :class="{ busy }">
          <span class="dot" />
          <span>{{ status || "Ready" }}</span>
        </div>
        <div v-if="lastReceiptId" class="mini">
          Last receiptId: <code>{{ lastReceiptId }}</code>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="left">
        <SemanticRenderer v-if="blocks.length" :models="blocks" />
        <div v-else class="empty">
          <div class="empty__title">No view loaded yet</div>
          <div class="empty__sub">
            Start with “Emit Demo Events”, then “Get View”.
            The UI is semantic + adapter-driven (not hardcoded).
          </div>
        </div>
      </div>

      <aside class="right">
        <section class="side">
          <div class="side__title">System Power</div>
          <ul class="side__list">
            <li><b>Adapter Pattern</b>: DTO → ViewModel → Semantic Components</li>
            <li><b>Semantic UI</b>: renders by data shape + contract</li>
            <li><b>Responsive</b>: KPIs collapse from 4→2→1 columns</li>
            <li><b>Receipts</b>: inference output has proof artifacts</li>
          </ul>
        </section>

        <section class="side" v-if="lastVerify">
          <div class="side__title">Verify Result</div>
          <pre class="pre">{{ JSON.stringify(lastVerify, null, 2) }}</pre>
        </section>

        <section class="side">
          <div class="side__title">Quick Links</div>
          <div class="links">
            <a class="link" :href="`/api/demo/emit?sessionId=${encodeURIComponent(sessionId)}`" target="_blank">/api/demo/emit</a>
            <a class="link" :href="`/.netlify/functions/handler`" target="_blank">/.netlify/functions/handler</a>
          </div>
        </section>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.wrap { max-width: 1200px; margin: 0 auto; padding: 18px; }
.hdr { display: grid; gap: 14px; }
.brand .title { font-size: 20px; font-weight: 900; letter-spacing: .2px; }
.brand .sub { margin-top: 6px; opacity: .75; }

.controls { display: grid; gap: 12px; border: 1px solid rgba(0,0,0,.08); background: #fff; border-radius: 16px; padding: 14px; }
.field { display: grid; gap: 6px; }
.lbl { font-size: 12px; opacity: .7; }
.inp { padding: 10px 12px; border: 1px solid rgba(0,0,0,.12); border-radius: 12px; outline: none; }
.inp:focus { border-color: rgba(0,0,0,.35); }

.btns { display: flex; flex-wrap: wrap; gap: 10px; }
.btn { padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(0,0,0,.12); background: #fff; cursor: pointer; font-weight: 700; }
.btn.primary { background: #111; color: #fff; border-color: #111; }
.btn:disabled { opacity: .5; cursor: not-allowed; }

.status { display: grid; gap: 8px; }
.pill { display: inline-flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 999px; border: 1px solid rgba(0,0,0,.10); background: #fff; width: fit-content; }
.pill .dot { width: 10px; height: 10px; border-radius: 999px; background: #2f855a; }
.pill.busy .dot { background: #b7791f; }
.mini { opacity: .75; font-size: 12px; }
code { background: rgba(0,0,0,.06); padding: 2px 6px; border-radius: 8px; }

.main { display: grid; grid-template-columns: 1fr 360px; gap: 16px; margin-top: 14px; }
@media (max-width: 980px) { .main { grid-template-columns: 1fr; } }

.left { min-width: 0; }
.right { display: grid; gap: 12px; }

.empty { border: 1px dashed rgba(0,0,0,.18); background: #fff; border-radius: 16px; padding: 20px; }
.empty__title { font-weight: 900; }
.empty__sub { margin-top: 8px; opacity: .75; }

.side { border: 1px solid rgba(0,0,0,.08); background: #fff; border-radius: 16px; padding: 14px; }
.side__title { font-weight: 900; margin-bottom: 8px; }
.side__list { margin: 0; padding-left: 18px; opacity: .9; display: grid; gap: 8px; }
.pre { background: #f6f7f9; border-radius: 12px; padding: 10px; overflow: auto; font-size: 12px; }
.links { display: grid; gap: 8px; }
.link { padding: 10px 12px; border: 1px solid rgba(0,0,0,.08); border-radius: 12px; text-decoration: none; background: #fafafa; }
</style>
