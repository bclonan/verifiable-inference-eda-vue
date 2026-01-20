import type { StackSpec } from "../core/types.js";

export const STACK_SPECS: Record<string, StackSpec> = {
    "semantic_extract@1": {
        stackSpecId: "semantic_extract@1",
        runtimeClass: "mock-llm",
        evidencePolicy: {
            storeRawOutput: true,
            storePrompt: true,
            storeInputs: true
        },
        attestationPolicy: { signer: "central" },
        cachePolicy: { ttlSeconds: 3600 }
    }
};
