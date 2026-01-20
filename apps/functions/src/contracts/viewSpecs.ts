import type { ViewSpec } from "../core/types.js";

export const VIEW_SPECS: Record<string, ViewSpec> = {
    "ux.session_activity@1": {
        viewSpecId: "ux.session_activity@1",
        outputSchemaRef: "dto.sessionActivity@1",
        inputBindings: ["dto.sessionEvents@1", "dto.sessionState@1"],
        deterministicDerivation: true,
        inferenceRequired: false,
        constraints: { piiAllowed: false, maxLatencyMs: 200 }
    },
    "ux.session_summary@1": {
        viewSpecId: "ux.session_summary@1",
        outputSchemaRef: "dto.sessionSummary@1",
        inputBindings: ["dto.sessionEvents@1", "dto.sessionState@1"],
        deterministicDerivation: false,
        inferenceRequired: true,
        constraints: { piiAllowed: false, maxLatencyMs: 800 }
    }
};
