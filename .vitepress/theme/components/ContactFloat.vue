<script setup lang="ts">
import { ref } from 'vue'
import { data as siteData } from '../../data/site.data'

const serviceUrl = siteData.service?.url || ''
const showTooltip = ref(false)
</script>

<template>
  <a
    v-if="serviceUrl"
    :href="serviceUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="contact-float"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <Transition name="contact-tooltip">
      <span v-if="showTooltip" class="contact-float__tooltip">联系客服</span>
    </Transition>
    <span class="contact-float__btn">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </span>
  </a>
</template>

<style scoped>
.contact-float {
  position: fixed;
  right: 24px;
  bottom: 80px;
  z-index: 100;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.contact-float__btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}
.contact-float:hover .contact-float__btn {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  background: var(--vp-c-brand-2);
}
.contact-float:active .contact-float__btn {
  transform: scale(0.95);
}

.contact-float__tooltip {
  position: absolute;
  right: 58px;
  white-space: nowrap;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--vp-c-divider);
  pointer-events: none;
}
.contact-float__tooltip::after {
  content: '';
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: var(--vp-c-bg-elv);
  border-right: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

.contact-tooltip-enter-active,
.contact-tooltip-leave-active {
  transition: all 0.2s ease;
}
.contact-tooltip-enter-from,
.contact-tooltip-leave-to {
  opacity: 0;
  transform: translateX(8px);
}
</style>
