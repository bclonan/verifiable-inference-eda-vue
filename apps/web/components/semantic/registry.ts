import KpiSet from "./KpiSet.vue";
import Timeline from "./Timeline.vue";
import CardBlock from "./CardBlock.vue";
import JsonBlock from "./JsonBlock.vue";
import ReceiptBlock from "./ReceiptBlock.vue";

export const registry: Record<string, any> = {
    KPI_SET: KpiSet,
    TIMELINE: Timeline,
    CARD: CardBlock,
    JSON: JsonBlock,
    RECEIPT: ReceiptBlock
};
