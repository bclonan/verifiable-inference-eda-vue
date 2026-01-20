<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>();
</script>

<template>
  <section class="panel">
    <div class="panel__hdr">
      <div class="panel__title">{{ title }}</div>
      <div v-if="subtitle" class="panel__sub">{{ subtitle }}</div>
    </div>
    <div class="panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.panel { border: 1px solid rgba(0,0,0,.08); border-radius: 14px; background: #fff; }
.panel__hdr { padding: 14px 16px; border-bottom: 1px solid rgba(0,0,0,.06); }
.panel__title { font-weight: 700; font-size: 15px; letter-spacing: .2px; }
.panel__sub { margin-top: 6px; opacity: .75; font-size: 12px; }
.panel__body { padding: 14px 16px; }
</style>
