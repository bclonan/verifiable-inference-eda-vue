<script setup lang="ts">
import BasePanel from "./BasePanel.vue";
import type { ViewModel } from "@/types/view-model";

defineProps<{ model: Extract<ViewModel, { kind: "RECEIPT" }> }>();
</script>

<template>
  <BasePanel :title="model.title" subtitle="Proof artifacts: receipt + evidence refs">
    <div class="rid">
      <span class="k">receiptId</span>
      <span class="v">{{ model.receiptId }}</span>
    </div>
    <details open class="meta">
      <summary>receipt</summary>
      <pre>{{ JSON.stringify(model.receipt, null, 2) }}</pre>
    </details>
  </BasePanel>
</template>

<style scoped>
.rid { display: flex; gap: 10px; align-items: baseline; margin-bottom: 10px; }
.k { font-size: 12px; opacity: .7; }
.v { font-weight: 800; word-break: break-word; }
pre { background: #f6f7f9; border-radius: 10px; padding: 10px; overflow: auto; }
</style>
