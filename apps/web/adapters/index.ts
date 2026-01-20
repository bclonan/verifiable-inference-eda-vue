import type { ViewModel } from "@/types/view-model";

export function adapt(viewSpecId: string, dto: any, inference?: any): ViewModel[] {
    const blocks: ViewModel[] = [];

    // Always show receipt block if present (architecture power)
    if (inference?.used && inference?.receiptId && inference?.receipt) {
        blocks.push({
            kind: "RECEIPT",
            title: "Receipt (Proof Artifact)",
            receiptId: inference.receiptId,
            receipt: inference.receipt
        });
    }

    if (viewSpecId === "ux.session_activity@1") {
        return blocks.concat(adaptSessionActivity(dto));
    }

    if (viewSpecId === "ux.session_summary@1") {
        return blocks.concat(adaptSessionSummary(dto, inference?.inferenceUri));
    }

    // default fallback
    blocks.push({ kind: "JSON", title: "Raw DTO", data: dto });
    return blocks;
}

function adaptSessionActivity(dto: any): ViewModel[] {
    const items = [
        { label: "Session", value: dto.sessionId ?? "—" },
        { label: "Event Count", value: dto.eventCount ?? dto.count ?? 0 },
        { label: "Last Action", value: dto.lastAction ?? "—" }
    ];

    const events = (dto.recentEvents ?? dto.events ?? []).map((e: any) => ({
        at: e.timestamp ?? e.at ?? "",
        label: e.payload?.actionType ?? e.actionType ?? e.eventType ?? "event",
        meta: e.payload ?? e
    }));

    return [
        { kind: "KPI_SET", title: "Deterministic View: Session Activity", items },
        { kind: "TIMELINE", title: "Recent Events (Derived/Bounded)", events },
        { kind: "JSON", title: "DTO (session_activity@1)", data: dto }
    ];
}

function adaptSessionSummary(dto: any, inferenceUri?: string): ViewModel[] {
    const blocks: ViewModel[] = [];

    if (inferenceUri) {
        blocks.push({
            kind: "CARD",
            title: "Inference URI (Stable Address)",
            body: inferenceUri,
            meta: { note: "Bound to ViewSpec + StackSpec + ContextHash" }
        });
    }

    blocks.push({ kind: "CARD", title: "Headline", body: dto.headline ?? "—" });

    blocks.push({
        kind: "KPI_SET",
        title: "Inference Summary (Structured DTO)",
        items: [
            { label: "Confidence", value: dto.confidence ?? "—" },
            { label: "Key Actions", value: (dto.keyActions?.length ?? 0) }
        ]
    });

    if (Array.isArray(dto.keyActions) && dto.keyActions.length) {
        blocks.push({
            kind: "TIMELINE",
            title: "Key Actions",
            events: dto.keyActions.map((k: any, i: number) => ({
                at: "",
                label: typeof k === "string" ? k : k.label ?? `Action ${i + 1}`,
                meta: typeof k === "string" ? { action: k } : k
            }))
        });
    }

    blocks.push({ kind: "JSON", title: "DTO (session_summary@1)", data: dto });
    return blocks;
}
