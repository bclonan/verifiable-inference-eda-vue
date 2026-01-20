import type { ContextEnvelope, DTO, ReceiptV1 } from "../../core/types.js";
import { canonicalJSONStringify } from "../../core/canonicalize.js";
import { sha256Hex } from "../../core/hash.js";
import { signPayloadHex, keypairFromSeedHex } from "../../core/sign.js";

function nowIso() { return new Date().toISOString(); }

export function computeContextHash(ctx: ContextEnvelope): string {
    return sha256Hex(canonicalJSONStringify(ctx));
}

export function computeOutputHash(dto: DTO): string {
    return sha256Hex(canonicalJSONStringify(dto));
}

export function makeReceipt(params: {
    receiptId: string;
    inferenceUri: string;
    ctx: ContextEnvelope;
    output: DTO;
    evidenceRefs: string[];
    runtimeId: string;
    receiptSigningSeedHex: string;
}): ReceiptV1 {
    const startedAt = nowIso();
    const completedAt = nowIso();

    const contextHash = computeContextHash(params.ctx);
    const outputHash = computeOutputHash(params.output);

    // Runtime attestation payload (unsigned canonical string)
    const attPayload = canonicalJSONStringify({
        inferenceUri: params.inferenceUri,
        contextHash,
        outputHash,
        runtimeId: params.runtimeId,
        stackSpecId: params.ctx.stackSpecId,
        viewSpecId: params.ctx.viewSpecId,
        completedAt
    });

    const kp = keypairFromSeedHex(params.receiptSigningSeedHex);
    const att = signPayloadHex(kp.secretKey, attPayload);

    // Receipt payload for signing
    const receiptPayload = canonicalJSONStringify({
        receiptVersion: "1",
        receiptId: params.receiptId,
        inferenceUri: params.inferenceUri,
        viewSpecId: params.ctx.viewSpecId,
        stackSpecId: params.ctx.stackSpecId,
        contextHash,
        outputSchemaRef: params.output.schemaRef,
        outputHash,
        evidenceRefs: params.evidenceRefs,
        runtimeAttestation: {
            runtimeId: params.runtimeId,
            signedBy: kp.publicKeyHex,
            signatureHex: att.signatureHex,
            payloadHash: att.payloadHash
        },
        timestamps: { startedAt, completedAt }
    });

    const receiptSig = signPayloadHex(kp.secretKey, receiptPayload);

    return {
        receiptVersion: "1",
        receiptId: params.receiptId,
        inferenceUri: params.inferenceUri,
        viewSpecId: params.ctx.viewSpecId,
        stackSpecId: params.ctx.stackSpecId,
        contextHash,
        outputSchemaRef: params.output.schemaRef,
        outputHash,
        evidenceRefs: params.evidenceRefs,
        runtimeAttestation: {
            runtimeId: params.runtimeId,
            signedBy: kp.publicKeyHex,
            signatureHex: att.signatureHex,
            payloadHash: att.payloadHash
        },
        timestamps: { startedAt, completedAt },
        receiptSignatureHex: receiptSig.signatureHex
    };
}
