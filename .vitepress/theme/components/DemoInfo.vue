<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{
  demo?: Record<string, any>[]
}>()

// platform 中文映射
const platformLabels: Record<string, string> = {
  pc: 'PC 端',
  mobile: '移动端',
  agent: '代理端',
  admin: '后台',
}

// 这些是元信息字段，不作为凭证显示
const metaKeys = new Set(['platform', 'url'])

function getCredentials(acc: Record<string, any>): { label: string; value: string }[] {
  return Object.entries(acc)
    .filter(([key]) => !metaKeys.has(key))
    .map(([key, value]) => ({ label: key, value: String(value) }))
}

function getAccountTitle(acc: Record<string, any>): string {
  if (acc.platform) return platformLabels[acc.platform] || acc.platform
  if (acc.url) {
    try { return new URL(acc.url).hostname } catch {}
  }
  return '演示'
}

const copied = ref('')

async function copy(text: string, field: string) {
  await navigator.clipboard.writeText(text)
  copied.value = field
  setTimeout(() => { copied.value = '' }, 1500)
}
</script>

<template>
  <div v-if="demo?.length" class="demo-info">
    <div class="demo-info__header">
      <svg class="demo-info__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <h3 class="demo-info__title">演示账号</h3>
    </div>
    <div class="demo-info__accounts">
      <div v-for="(acc, idx) in demo" :key="idx" class="demo-info__account">
        <div class="demo-info__account-header">
          <span class="demo-info__account-name">
            <span class="demo-info__account-dot" />
            {{ getAccountTitle(acc) }}
          </span>
          <a v-if="acc.url" :href="acc.url" target="_blank" class="demo-info__account-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            打开演示
          </a>
        </div>
        <div class="demo-info__creds">
          <div
            v-for="cred in getCredentials(acc)"
            :key="cred.label"
            class="demo-info__row"
          >
            <span class="demo-info__label">{{ cred.label }}</span>
            <div class="demo-info__value-group">
              <code class="demo-info__value">{{ cred.value }}</code>
              <button
                class="demo-info__copy"
                :class="{ 'demo-info__copy--done': copied === idx + '-' + cred.label }"
                @click="copy(cred.value, idx + '-' + cred.label)"
              >
                <svg v-if="copied !== idx + '-' + cred.label" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {{ copied === idx + '-' + cred.label ? '已复制' : '复制' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-info {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* 标题栏 */
.demo-info__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.demo-info__icon {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
}
.demo-info__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

/* 账号网格 */
.demo-info__accounts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  padding: 16px 20px;
}

/* 单个账号卡片 */
.demo-info__account {
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  padding: 16px;
  border: 1px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.demo-info__account:hover {
  border-color: var(--vp-c-brand-soft);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 账号头部 */
.demo-info__account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--vp-c-divider);
}
.demo-info__account-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 8px;
}
.demo-info__account-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-green-2, #52c41a);
  flex-shrink: 0;
  box-shadow: 0 0 0 3px var(--vp-c-green-soft, rgba(82, 196, 26, 0.15));
}
.demo-info__account-link {
  font-size: 12px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  transition: all 0.2s;
  white-space: nowrap;
}
.demo-info__account-link:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

/* 凭证区域 */
.demo-info__creds {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.demo-info__row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}
.demo-info__label {
  color: var(--vp-c-text-3);
  min-width: 40px;
  flex-shrink: 0;
  font-size: 12px;
  text-transform: capitalize;
}
.demo-info__value-group {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 4px 4px 4px 10px;
  transition: border-color 0.2s;
}
.demo-info__value-group:hover {
  border-color: var(--vp-c-brand-soft);
}
.demo-info__value {
  flex: 1;
  font-size: 13px;
  color: var(--vp-c-text-1);
  background: none;
  font-family: var(--vp-font-family-mono);
  letter-spacing: 0.02em;
  user-select: all;
}

/* 复制按钮 */
.demo-info__copy {
  border: none;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  white-space: nowrap;
}
.demo-info__copy:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.demo-info__copy--done {
  background: var(--vp-c-green-soft, rgba(82, 196, 26, 0.1));
  color: var(--vp-c-green-2, #52c41a);
}
</style>
