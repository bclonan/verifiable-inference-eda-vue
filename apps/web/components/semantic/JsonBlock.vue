<script setup lang="ts">
import BasePanel from "./BasePanel.vue";
import type { ViewModel } from "@/types/view-model";

defineProps<{ model: Extract<ViewModel, { kind: "JSON" }> }>();
</script>

<template>
  <BasePanel :title="model.title" subtitle="Semantic block: JSON (fallback)">
    <details open>
      <summary>data</summary>
      <pre>{{ JSON.stringify(model.data, null, 2) }}</pre>
    </details>
  </BasePanel>
</template>

<style scoped>
pre { background: #f6f7f9; border-radius: 10px; padding: 10px; overflow: auto; }
</style>
