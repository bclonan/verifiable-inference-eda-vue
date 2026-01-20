<script setup lang="ts">
import BasePanel from "./BasePanel.vue";
import type { ViewModel } from "@/types/view-model";

defineProps<{ model: Extract<ViewModel, { kind: "TIMELINE" }> }>();
</script>

<template>
  <BasePanel :title="model.title" subtitle="Semantic block: TIMELINE">
    <div class="tl">
      <div v-for="(e, i) in model.events" :key="i" class="row">
        <div class="dot"></div>
        <div class="main">
          <div class="top">
            <div class="label">{{ e.label }}</div>
            <div class="at" v-if="e.at">{{ e.at }}</div>
          </div>
          <details v-if="e.meta" class="meta">
            <summary>meta</summary>
            <pre>{{ JSON.stringify(e.meta, null, 2) }}</pre>
          </details>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<style scoped>
.tl { display: grid; gap: 14px; }
.row { display: grid; grid-template-columns: 16px 1fr; gap: 10px; align-items: start; }
.dot { width: 10px; height: 10px; border-radius: 999px; background: #111; margin-top: 6px; }
.top { display: flex; gap: 12px; align-items: baseline; justify-content: space-between; }
.label { font-weight: 700; }
.at { font-size: 12px; opacity: .7; }
.meta { margin-top: 8px; }
pre { background: #f6f7f9; border-radius: 10px; padding: 10px; overflow: auto; }
</style>
