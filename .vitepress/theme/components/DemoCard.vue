<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  desc?: string
  icon?: string
  logo?: string
  link: string
  tags?: string[]
  count?: number
}>()

const isImage = computed(() => {
  return props.logo || (props.icon && (props.icon.startsWith('/') || props.icon.startsWith('http') || props.icon.endsWith('.png') || props.icon.endsWith('.svg') || props.icon.endsWith('.webp')))
})

const imageSrc = computed(() => props.logo || props.icon)
</script>

<template>
  <a :href="link" class="demo-card">
    <div v-if="logo || icon" class="demo-card__icon">
      <img v-if="isImage" :src="imageSrc" :alt="title" class="demo-card__logo" />
      <span v-else>{{ icon }}</span>
    </div>
    <div class="demo-card__title">{{ title }}</div>
    <div v-if="desc" class="demo-card__desc">{{ desc }}</div>
    <div v-if="tags?.length" class="demo-card__tags">
      <span v-for="tag in tags" :key="tag" class="demo-tag">{{ tag }}</span>
    </div>
    <div v-if="count" class="demo-card__count">{{ count }} 个版本</div>
  </a>
</template>
