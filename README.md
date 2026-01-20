# Verifiable Inference EDA (Vue/Nuxt + Netlify Functions) — v0.1

This repository is a runnable demo of a **deterministic enterprise AI architecture**:

- **Deterministic core:** **Events → State → Views**
- **Bounded inference plane:** inference only happens when a view cannot be deterministically derived
- **Inference URI:** every inference is **addressable** by a URI derived from a versioned **ViewSpec**, versioned **StackSpec**, and a hashed **Context Envelope**
- **Receipts + Evidence:** every inference returns structured output **DTOs** plus **receipts** written to an append-only audit log, with integrity-protected evidence references
- **Verification:** a verifier recomputes hashes and validates signatures/receipt integrity

This design makes AI usable in regulated environments (finance/health/gov/insurance) by enforcing:
- **strong contracts** (DTOs + ViewSpecs + StackSpecs),
- **explicit inference boundaries**, and
- **audit-ready proof artifacts** (receipts + evidence).

---

## Architecture at a Glance

**What it is**  
A deterministic, event-driven system with a bounded, verifiable inference plane. Business runs on state/policies by default; AI is used only when required and always in a provable way.

**Design rule**
> If inference matters, it gets a URI.  
> If it has a URI, it has a view, a context, and a process.

**Why it scales**  
As **token prices** and **observability requirements** rise:
- deterministic computation wins (cheap, replayable),
- inference becomes metered and cacheable (reused via Inference URIs),
- inference usage naturally declines (engineers shift views to deterministic derivations).

---

## What’s in v0.1

### Implemented
- Nuxt 3 (Vue) UI for demo actions
- Netlify Function API for:
  - emit demo events
  - build deterministic view (`ux.session_activity@1`)
  - build inference view (`ux.session_summary@1`) → produces Inference URI + receipt
  - verify receipt (v0.1 checks signatures + evidence presence)
- Memory store + optional Upstash Redis store adapter (persistence on Netlify)
- Mock inference runtime (model-agnostic interface)

### Known limitations (intentional for v0.1)
- Persistence on Netlify requires Upstash (serverless instances are stateless)
- Evidence store is demo-level (stored via store keys rather than a durable CAS like S3/R2)
- Mock runtime stands in for LLM/tool chains (interfaces are ready to swap)

---

## Quickstart (Local)

### Requirements
- Node 20+
- pnpm

### Install + run
```bash
pnpm install
pnpm dev
```

* Web (Nuxt): [http://localhost:3000](http://localhost:3000)
* API: proxied by Netlify redirects as `/api/*`

---

## Deploy to Netlify

1. Push this repo to GitHub
2. Create a new Netlify site from the repo
3. Add environment variables:

**Required**

* `RECEIPT_SIGNING_SEED_HEX` (64 hex chars recommended; demo accepts shorter and pads)

**Optional (recommended for persistence)**

* `UPSTASH_REDIS_REST_URL`
* `UPSTASH_REDIS_REST_TOKEN`

Without Upstash: data may reset on cold starts (fine for demo).
With Upstash: events/receipts/views persist across invocations.

---

## Demo Flow (UI)

1. Click **Emit Demo Events**
2. Click **Get session_activity@1** → deterministic view
3. Click **Get session_summary@1 (inference)** → inference URI + receipt returned
4. Click **Verify last receipt** → verifier validates receipt signature + evidence presence

---

## Demo Flow (API / Curl)

### Emit demo events

```bash
curl -s "http://localhost:3000/api/demo/emit?sessionId=S123" | jq
```

### Get deterministic view

```bash
curl -s "http://localhost:3000/api/views/ux.session_activity@1?sessionId=S123" | jq
```

### Get inference view (returns view + receipt)

```bash
curl -s "http://localhost:3000/api/views/ux.session_summary@1?sessionId=S123" | jq
```

### Verify last receipt (use receiptId from previous response)

```bash
curl -s "http://localhost:3000/api/verify?receiptId=<RECEIPT_ID>" | jq
```

---

## Specs: How the system works

### Events → State → Views

* Producers emit immutable events.
* State is derived deterministically from events.
* Views are materialized outputs (DTOs) built from state.

### Inference boundary

* A decision gate determines whether a view is fully derivable deterministically.
* If not, the system generates:

  * a canonical context envelope,
  * a `contextHash`,
  * an **Inference URI**.

### Inference URI

A stable address for inference:

```
infer://<org>/<domain>/<viewSpecId>/<stackSpecId>/<contextHash>
```

### Receipt

Every inference produces a receipt binding:

* viewSpecId + stackSpecId
* contextHash
* outputHash
* evidenceRefs
* runtime attestation
* receipt signature

### Verification

Verification recomputes:

* receipt signature validity
* evidence presence / integrity (best-effort in v0.1)

---

## Regulated Environments: What challenges this solves

**Problem:** AI outputs are hard to audit in regulated domains because:

* inference is non-deterministic,
* prompts/config drift,
* missing lineage from input → output,
* high cost + opaque error modes.

**This architecture solves it by enforcing:**

* Strong contracts (view specs, stack specs, DTO schemas)
* Explicit inference boundaries (no hidden AI calls)
* Receipts + append-only audit log (tamper evidence)
* Evidence references (what inputs/config were used)

**Result:** AI becomes an auditable infrastructure capability—safe for regulated workflows.

---

## Token pricing goes up → inference usage goes down

Because inference is:

* addressable (URI),
* governed (resolver),
* cached (reuse),
* audited (receipt).

As cost and oversight increase, teams naturally:

* shift more views to deterministic derivation,
* shrink context envelopes,
* reuse cached receipts/results.

---

## Repo layout

* `apps/web` — Nuxt 3 (Vue) UI
* `apps/functions` — Netlify function API implementing the architecture
* `docs/diagrams.md` — mermaid diagrams (7–9 included)

---

## Next steps (v0.2+)

* Add durable evidence store adapter (S3/R2) behind interface
* Add full attestation verification (att payload reconstruction + signature)
* Add policy demos (PII rejection, residency constraints)
* Add budgets/rate limiting per view/stack
* Add a real LLM runtime adapter behind the runtime interface

````



