<script setup lang="ts">
import type { ViewModel } from "@/types/view-model";
import { registry } from "./registry";

defineProps<{ models: ViewModel[] }>();

function componentFor(kind: ViewModel["kind"]) {
  return registry[kind] ?? registry.JSON;
}
</script>

<template>
  <div class="grid gap-12">
    <component
      v-for="(m, i) in models"
      :key="i"
      :is="componentFor(m.kind)"
      :model="m"
    />
  </div>
</template>
