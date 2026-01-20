<script setup lang="ts">
import BasePanel from "./BasePanel.vue";
import type { ViewModel } from "@/types/view-model";

const props = defineProps<{ model: Extract<ViewModel, { kind: "KPI_SET" }> }>();
</script>

<template>
  <BasePanel :title="model.title" subtitle="Semantic block: KPI_SET">
    <div class="kpis">
      <div v-for="(it, i) in model.items" :key="i" class="kpi">
        <div class="kpi__label">{{ it.label }}</div>
        <div class="kpi__value">{{ it.value }}</div>
        <div v-if="it.hint" class="kpi__hint">{{ it.hint }}</div>
      </div>
    </div>
  </BasePanel>
</template>

<style scoped>
.kpis {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
@media (max-width: 960px) {
  .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .kpis { grid-template-columns: 1fr; }
}
.kpi { border: 1px solid rgba(0,0,0,.06); border-radius: 12px; padding: 12px; }
.kpi__label { font-size: 12px; opacity: .7; }
.kpi__value { font-size: 18px; font-weight: 800; margin-top: 6px; }
.kpi__hint { font-size: 12px; opacity: .7; margin-top: 6px; }
</style>
