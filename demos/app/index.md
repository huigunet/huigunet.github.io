---
title: app
---

<script setup>
import { data as categories } from '../../.vitepress/data/categories.data'
const category = categories.find(c => c.name === 'app')
</script>

# {{ category?.text }}

{{ category?.desc }}

<DemoGrid>
  <DemoCard
    v-for="proj in category?.projects"
    :key="proj.slug"
    :title="proj.config.title"
    :desc="proj.config.desc"
    :link="'/demos/app/' + proj.slug + '/'"
    :tags="proj.config.tags"
    :count="proj.config.versions.length"
  />
</DemoGrid>
