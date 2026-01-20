<script setup lang="ts">
import BasePanel from "./BasePanel.vue";
import type { ViewModel } from "@/types/view-model";

defineProps<{ model: Extract<ViewModel, { kind: "CARD" }> }>();
</script>

<template>
  <BasePanel :title="model.title" subtitle="Semantic block: CARD">
    <div class="body">{{ model.body }}</div>
    <details v-if="model.meta" class="meta">
      <summary>meta</summary>
      <pre>{{ JSON.stringify(model.meta, null, 2) }}</pre>
    </details>
  </BasePanel>
</template>

<style scoped>
.body { font-size: 14px; line-height: 1.45; white-space: pre-wrap; word-break: break-word; }
.meta { margin-top: 10px; }
pre { background: #f6f7f9; border-radius: 10px; padding: 10px; overflow: auto; }
</style>
