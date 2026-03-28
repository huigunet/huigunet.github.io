<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  versions: { name: string; title?: string; latest?: boolean }[]
  current: string
  basePath: string
}>()

const emit = defineEmits<{
  change: [version: string]
}>()
</script>

<template>
  <div class="version-tabs">
    <a
      v-for="v in versions"
      :key="v.name"
      class="version-tabs__tab"
      :class="{ 'version-tabs__tab--active': current === v.name }"
      :href="`${basePath}${v.name}/`"
    >
      {{ v.title || v.name }}
      <span v-if="v.latest" class="version-tabs__badge">最新</span>
    </a>
  </div>
</template>

<style scoped>
.version-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 16px 0 24px;
}
.version-tabs__tab {
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 14px;
  text-decoration: none;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.version-tabs__tab:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.version-tabs__tab--active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}
.version-tabs__tab--active:hover {
  color: #fff;
}
.version-tabs__badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.25);
}
.version-tabs__tab:not(.version-tabs__tab--active) .version-tabs__badge {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
</style>
