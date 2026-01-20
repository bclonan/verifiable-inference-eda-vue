export type PrivacyTag = "PII:none" | "PII:present";

export interface UiEventV1 {
    eventType: string;
    eventVersion: 1;
    ulid: string;
    timestamp: string; // ISO
    actorId: string | null;
    sessionId: string;
    correlationId: string;
    privacyTags: PrivacyTag[];
    payload: Record<string, any>;
}

export interface DTO<T = any> {
    schemaRef: string; // e.g. dto.sessionSummary@1
    data: T;
}

export interface ViewSpec {
    viewSpecId: string; // ux.session_summary@1
    outputSchemaRef: string;
    inputBindings: string[]; // dto refs
    deterministicDerivation: boolean;
    inferenceRequired: boolean;
    constraints: {
        piiAllowed: boolean;
        maxLatencyMs: number;
    };
}

export interface StackSpec {
    stackSpecId: string; // semantic_extract@1
    runtimeClass: "mock-llm" | "llm" | "rules" | "hybrid";
    evidencePolicy: {
        storeRawOutput: boolean;
        storePrompt: boolean;
        storeInputs: boolean;
    };
    attestationPolicy: {
        signer: "central";
    };
    cachePolicy: {
        ttlSeconds: number;
    };
}

export interface ContextEnvelope {
    viewSpecId: string;
    stackSpecId: string;
    asOf: string;
    timeWindow: { start: string; end: string };
    inputDTOs: DTO[];
    constraints: Record<string, any>;
    policyVersion: string;
}

export interface ReceiptV1 {
    receiptVersion: "1";
    receiptId: string;
    inferenceUri: string;
    viewSpecId: string;
    stackSpecId: string;
    contextHash: string;
    outputSchemaRef: string;
    outputHash: string;
    evidenceRefs: string[];
    runtimeAttestation: {
        runtimeId: string;
        signedBy: string;
        signatureHex: string;
        payloadHash: string;
    };
    timestamps: { startedAt: string; completedAt: string };
    receiptSignatureHex: string;
}
