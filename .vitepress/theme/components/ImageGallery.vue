<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  platforms: string[]
  basePath: string
  images?: Record<string, string[]>
}>()

const platformLabels: Record<string, string> = {
  pc: 'PC 端',
  mobile: '移动端',
  admin: '管理后台',
  agent: '代理后台',
}

const activePlatform = ref(props.platforms[0] || 'pc')
const lightboxSrc = ref('')
const lightboxVisible = ref(false)

function openLightbox(src: string) {
  lightboxSrc.value = src
  lightboxVisible.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxVisible.value = false
  document.body.style.overflow = ''
  setTimeout(() => { lightboxSrc.value = '' }, 200)
}
</script>

<template>
  <div class="gallery">
    <h3 class="gallery__title">界面截图</h3>

    <div class="gallery__tabs">
      <button
        v-for="p in platforms"
        :key="p"
        class="gallery__tab"
        :class="{ 'gallery__tab--active': activePlatform === p }"
        @click="activePlatform = p"
      >
        {{ platformLabels[p] || p }}
      </button>
    </div>

    <div class="gallery__grid">
      <template v-if="images && images[activePlatform]?.length">
        <div
          v-for="(img, i) in images[activePlatform]"
          :key="i"
          class="gallery__item"
          :class="{ 'gallery__item--mobile': activePlatform === 'mobile' }"
          @click="openLightbox(img)"
        >
          <img :src="img" :alt="`${platformLabels[activePlatform]} 截图 ${i + 1}`" loading="lazy" />
          <div class="gallery__zoom">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </div>
        </div>
      </template>
      <div v-else class="gallery__empty">
        暂无 {{ platformLabels[activePlatform] || activePlatform }} 截图，请在
        <code>images/{{ activePlatform }}/</code> 目录下放置图片
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div v-if="lightboxVisible" class="gallery__lightbox" @click.self="closeLightbox">
          <button class="gallery__lightbox-close" @click="closeLightbox">&times;</button>
          <img :src="lightboxSrc" alt="预览" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery {
  margin: 24px 0;
}
.gallery__title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--vp-c-text-1);
}
.gallery__tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}
.gallery__tab {
  padding: 5px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: none;
  cursor: pointer;
  font-size: 13px;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}
.gallery__tab:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.gallery__tab--active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

/* 缩略图网格 - 小图 */
.gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}
.gallery__item {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  cursor: zoom-in;
  transition: all 0.2s;
  position: relative;
  aspect-ratio: 16 / 10;
}
.gallery__item--mobile {
  aspect-ratio: 9 / 14;
}
.gallery__item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
}
.gallery__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 放大图标 */
.gallery__zoom {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.2s;
}
.gallery__item:hover .gallery__zoom {
  opacity: 1;
}

/* 空状态 */
.gallery__empty {
  grid-column: 1 / -1;
  padding: 40px;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}
.gallery__empty code {
  background: var(--vp-c-bg);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

/* Lightbox 弹窗 */
.gallery__lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  cursor: zoom-out;
  padding: 40px;
}
.gallery__lightbox img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
  object-fit: contain;
}
.gallery__lightbox-close {
  position: fixed;
  top: 16px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 1000;
  line-height: 1;
}
.gallery__lightbox-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

</style>

<style>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-active img,
.lightbox-leave-active img {
  transition: transform 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
.lightbox-enter-from img {
  transform: scale(0.9);
}
.lightbox-leave-to img {
  transform: scale(0.9);
}
</style>
