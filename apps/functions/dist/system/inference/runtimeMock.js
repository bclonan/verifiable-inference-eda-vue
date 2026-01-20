import { canonicalJSONStringify } from "../../core/canonicalize.js";
import { sha256Hex } from "../../core/hash.js";
export async function runMockSemanticExtract(ctx) {
    const runtimeId = "mock-llm@1";
    // crude “semantic” behavior: summarize recent actions deterministically from input data
    const eventsDto = ctx.inputDTOs.find(d => d.schemaRef === "dto.sessionEvents@1");
    const events = (eventsDto?.data?.events || []);
    const actions = events.slice(-10).map(e => e.payload?.actionType || e.eventType).filter(Boolean);
    const unique = Array.from(new Set(actions));
    const output = {
        schemaRef: "dto.sessionSummary@1",
        data: {
            headline: unique.includes("checkout_step") ? "High intent checkout session" : "Active browsing session",
            keyActions: unique.slice(0, 5),
            confidence: unique.includes("checkout_step") ? 0.86 : 0.62
        }
    };
    const prompt = `Summarize session actions into headline + keyActions (schema dto.sessionSummary@1).`;
    const rawOutput = canonicalJSONStringify(output);
    const evidence = {
        "prompt.txt": prompt,
        "rawOutput.json": rawOutput,
        "contextEnvelope.json": canonicalJSONStringify(ctx),
        "contextEnvelope.hash": sha256Hex(canonicalJSONStringify(ctx))
    };
    return { output, evidence, runtimeId };
}
