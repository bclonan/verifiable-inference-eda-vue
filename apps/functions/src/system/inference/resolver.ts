import type { ContextEnvelope, DTO, ReceiptV1, StackSpec, ViewSpec } from "../../core/types.js";
import type { IStore } from "../../stores/store.js";
import { buildInferenceUri } from "../../core/uri.js";
import { canonicalJSONStringify } from "../../core/canonicalize.js";
import { sha256Hex } from "../../core/hash.js";
import { enforcePolicy } from "../../policy/policy.js";
import { makeReceipt, computeContextHash } from "./receipt.js";
import { runMockSemanticExtract } from "./runtimeMock.js";

export async function resolveInference(params: {
    store: IStore;
    view: ViewSpec;
    stack: StackSpec;
    ctx: ContextEnvelope;
    org: string;
    domain: string;
    receiptSigningSeedHex: string;
}): Promise<{ dto: DTO; receipt: ReceiptV1; receiptId: string; inferenceUri: string }> {
    enforcePolicy(params.view, params.ctx);

    const contextHash = computeContextHash(params.ctx);
    const inferenceUri = buildInferenceUri({
        org: params.org,
        domain: params.domain,
        viewSpecId: params.view.viewSpecId,
        stackSpecId: params.stack.stackSpecId,
        contextHash
    });

    const cached = await params.store.getCache(inferenceUri);
    if (cached) {
        const receipt = await params.store.getReceipt(cached.receiptId);
        if (!receipt) throw new Error("Cache entry missing receipt");
        return { dto: cached.dto, receipt, receiptId: cached.receiptId, inferenceUri };
    }

    // Execute runtime (mock)
    const exec = await runMockSemanticExtract(params.ctx);

    // Evidence refs: in v0.1 we store evidence as hashed blobs in the materialized view keyspace
    const evidenceRefs: string[] = [];
    for (const [name, blob] of Object.entries(exec.evidence)) {
        const h = sha256Hex(`${name}:${blob}`);
        evidenceRefs.push(`cas://${h}/${encodeURIComponent(name)}`);
        // store evidence blob as a "view" so it persists behind IStore
        await params.store.putMaterializedView(`evidence:${h}`, { schemaRef: "evidence@1", data: { name, blob } });
    }

    const receiptId = sha256Hex(`${inferenceUri}:${Date.now()}`).slice(0, 24);

    const receipt = makeReceipt({
        receiptId,
        inferenceUri,
        ctx: params.ctx,
        output: exec.output,
        evidenceRefs,
        runtimeId: exec.runtimeId,
        receiptSigningSeedHex: params.receiptSigningSeedHex
    });

    await params.store.appendReceipt(receipt);
    await params.store.putCache(inferenceUri, exec.output, receiptId);

    return { dto: exec.output, receipt, receiptId, inferenceUri };
}
