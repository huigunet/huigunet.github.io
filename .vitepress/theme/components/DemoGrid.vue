<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div>
    <h2 v-if="title" class="home-categories__title">{{ title }}</h2>
    <div class="demo-grid">
      <slot />
    </div>
  </div>
</template>
