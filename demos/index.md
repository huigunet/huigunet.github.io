---
title: 全部分类
---

<script setup>
import { data as categories } from '../.vitepress/data/categories.data'
</script>

# 全部分类

<DemoGrid>
  <DemoCard
    v-for="cat in categories"
    :key="cat.name"
    :title="cat.text"
    :icon="cat.icon"
    :logo="cat.logo"
    :desc="cat.desc"
    :link="'/demos/' + cat.name + '/'"
    :count="cat.projects.length"
  />
</DemoGrid>
