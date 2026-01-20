import { VIEW_SPECS } from "../contracts/viewSpecs.js";
import { STACK_SPECS } from "../contracts/stackSpecs.js";
import { needsInference } from "./inference/gate.js";
import { resolveInference } from "./inference/resolver.js";
function viewKey(viewSpecId, sessionId) {
    return `${viewSpecId}::session=${sessionId}`;
}
export async function buildView(params) {
    const viewSpec = VIEW_SPECS[params.viewSpecId];
    if (!viewSpec)
        throw new Error(`Unknown ViewSpec: ${params.viewSpecId}`);
    const existing = await params.store.getMaterializedView(viewKey(viewSpec.viewSpecId, params.sessionId));
    if (existing)
        return { view: existing };
    const events = await params.store.listEventsBySession(params.sessionId);
    const state = (await params.store.getState(params.sessionId)) ?? null;
    const ctx = {
        viewSpecId: viewSpec.viewSpecId,
        stackSpecId: "semantic_extract@1",
        asOf: new Date().toISOString(),
        timeWindow: {
            start: events[0]?.timestamp ?? new Date().toISOString(),
            end: new Date().toISOString()
        },
        inputDTOs: [
            { schemaRef: "dto.sessionEvents@1", data: { sessionId: params.sessionId, events } },
            { schemaRef: "dto.sessionState@1", data: state ?? { sessionId: params.sessionId, totalEvents: 0, counts: {} } }
        ],
        constraints: { piiAllowed: viewSpec.constraints.piiAllowed, maxLatencyMs: viewSpec.constraints.maxLatencyMs },
        policyVersion: "policy@1"
    };
    if (!needsInference(viewSpec)) {
        // Deterministic view: session_activity@1
        const dto = {
            schemaRef: "dto.sessionActivity@1",
            data: {
                sessionId: params.sessionId,
                totalEvents: events.length,
                lastAction: state?.lastAction ?? null,
                topActions: Object.entries(state?.counts ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 5)
            }
        };
        await params.store.putMaterializedView(viewKey(viewSpec.viewSpecId, params.sessionId), dto);
        return { view: dto };
    }
    const stack = STACK_SPECS["semantic_extract@1"];
    const resolved = await resolveInference({
        store: params.store,
        view: viewSpec,
        stack,
        ctx,
        org: params.org,
        domain: params.domain,
        receiptSigningSeedHex: params.receiptSigningSeedHex
    });
    await params.store.putMaterializedView(viewKey(viewSpec.viewSpecId, params.sessionId), resolved.dto);
    return { view: resolved.dto, receiptId: resolved.receiptId, receipt: resolved.receipt };
}
