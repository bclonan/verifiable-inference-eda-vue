import type { IStore } from "../stores/store.js";
import { canonicalJSONStringify } from "../core/canonicalize.js";
import { sha256Hex } from "../core/hash.js";
import { verifyPayloadHex } from "../core/sign.js";

export async function verifyReceipt(store: IStore, receiptId: string): Promise<{ pass: boolean; reasons: string[] }> {
    const receipt = await store.getReceipt(receiptId);
    if (!receipt) return { pass: false, reasons: ["Receipt not found"] };

    const reasons: string[] = [];

    // Verify receipt signature: reconstruct payload used for signing (must match receipt.ts)
    const receiptPayload = canonicalJSONStringify({
        receiptVersion: "1",
        receiptId: receipt.receiptId,
        inferenceUri: receipt.inferenceUri,
        viewSpecId: receipt.viewSpecId,
        stackSpecId: receipt.stackSpecId,
        contextHash: receipt.contextHash,
        outputSchemaRef: receipt.outputSchemaRef,
        outputHash: receipt.outputHash,
        evidenceRefs: receipt.evidenceRefs,
        runtimeAttestation: receipt.runtimeAttestation,
        timestamps: receipt.timestamps
    });

    const okReceiptSig = verifyPayloadHex(
        receipt.runtimeAttestation.signedBy,
        receiptPayload,
        receipt.receiptSignatureHex
    );

    if (!okReceiptSig) reasons.push("Receipt signature invalid");

    // Verify evidence refs exist (best-effort in v0.1)
    for (const ref of receipt.evidenceRefs) {
        const m = ref.match(/^cas:\/\/([a-f0-9]+)\//);
        if (!m) { reasons.push(`Bad evidence ref: ${ref}`); continue; }
        const h = m[1];
        const blob = await store.getMaterializedView(`evidence:${h}`);
        if (!blob) reasons.push(`Missing evidence blob for ${ref}`);
    }

    return { pass: reasons.length === 0, reasons };
}
