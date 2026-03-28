---
title: 刷单模版1
---

<script setup>
import { data as allProjects } from '../../../../.vitepress/data/project.data'
const info = allProjects['app/chat-app']
const project = info?.project
const config = info?.versions?.['v1.0'] || {}
</script>

# {{ config.title || '刷单模版1' }}

<VersionTabs
  :versions='[{"name":"v1.0","latest":true,"title":"刷单模版1"}]'
  current="v1.0"
  base-path="/demos/app/chat-app/"
/>

## 演示站点

<DemoInfo :demo="config.demo" />

<!--@include: ./intro.md-->

<ImageGallery
  v-if="config.screenshots?.length || (config.images && Object.keys(config.images).length)"
  :platforms="config.images ? Object.keys(config.images) : config.screenshots"
  :images="config.images"
  base-path="/demos/app/chat-app/v1.0/images/"
/>
