import type { SiteConfig, CategoryDef, ProjectConfig, VersionRef } from './shared'

export function categoryPageMd(name: string): string {
  return `---
title: ${name}
---

<script setup>
import { data as categories } from '../../.vitepress/data/categories.data'
const category = categories.find(c => c.name === '${name}')
</script>

# {{ category?.text }}

{{ category?.desc }}

<DemoGrid>
  <DemoCard
    v-for="proj in category?.projects"
    :key="proj.slug"
    :title="proj.config.title"
    :desc="proj.config.desc"
    :link="'/demos/${name}/' + proj.slug + '/'"
    :tags="proj.config.tags"
    :count="proj.config.versions.length"
  />
</DemoGrid>
`
}

export function categoriesOverviewMd(): string {
  return `---
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
`
}

export function homepageMd(site: SiteConfig, categories: CategoryDef[]): string {
  const featureIcon = (c: CategoryDef) =>
    c.logo ? `\n      src: ${c.logo}\n      width: 48\n      height: 48` : ` ${c.icon || '📁'}`

  return `---
layout: home
hero:
  name: ${site.title || 'CodeView'}
  text: ${site.description || '源码演示展示平台'}
  tagline: ${site.tagline || '浏览源码项目、查看在线演示、快速体验各版本功能'}
  actions:
    - theme: brand
      text: 浏览全部项目
      link: /demos/
features:
${categories.map((c) => `  - icon:${featureIcon(c)}\n    title: ${c.text}\n    details: ${c.desc || ''}\n    link: /demos/${c.name}/`).join('\n')}
---
`
}

export function projectPageMd(config: ProjectConfig, basePath: string): string {
  return `---
title: ${config.title}
---

# ${config.title}

${config.desc || ''}

${config.tags?.length ? config.tags.map((t) => `<span class="demo-tag">${t}</span>`).join(' ') : ''}

## 版本列表

<VersionTabs
  :versions='${JSON.stringify(config.versions)}'
  current=""
  base-path="${basePath}/"
/>
`
}

interface VersionPageOpts {
  title: string
  upPath: string
  label: string
  vName: string
  versions: VersionRef[]
  basePath: string
  hasIntro: boolean
}

export function versionPageMd(opts: VersionPageOpts): string {
  return `---
title: ${opts.title}
---

<script setup>
import { data as allProjects } from '${opts.upPath}/.vitepress/data/project.data'
const info = allProjects['${opts.label}']
const project = info?.project
const config = info?.versions?.['${opts.vName}'] || {}
</script>

# {{ config.title || '${opts.title}' }}

<VersionTabs
  :versions='${JSON.stringify(opts.versions)}'
  current="${opts.vName}"
  base-path="${opts.basePath}/"
/>

## 演示站点

<DemoInfo :demo="config.demo" />
${opts.hasIntro ? '\n<!--@include: ./intro.md-->\n' : ''}
<ImageGallery
  v-if="config.screenshots?.length || (config.images && Object.keys(config.images).length)"
  :platforms="config.images ? Object.keys(config.images) : config.screenshots"
  :images="config.images"
  base-path="${opts.basePath}/${opts.vName}/images/"
/>
`
}
