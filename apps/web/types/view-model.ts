export type KPIItem = { label: string; value: string | number; hint?: string };

export type ViewModel =
    | { kind: "KPI_SET"; title: string; items: KPIItem[] }
    | { kind: "TIMELINE"; title: string; events: { at: string; label: string; meta?: Record<string, any> }[] }
    | { kind: "CARD"; title: string; body: string; meta?: Record<string, any> }
    | { kind: "RECEIPT"; title: string; receiptId: string; receipt: any }
    | { kind: "JSON"; title: string; data: any };
