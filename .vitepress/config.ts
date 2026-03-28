import { defineConfig } from 'vitepress'
import {
  readFileSync, writeFileSync, readdirSync, copyFileSync,
  existsSync, rmSync, utimesSync, mkdirSync, statSync,
  watch as fsWatch,
} from 'node:fs'
import { resolve, dirname } from 'node:path'
import { stringify as toYaml } from 'yaml'
import type { Plugin } from 'vite'
import {
  rootDir, demosDir, IMG_EXTS,
  readYml, dirs, findLogo, isImageFile, isDir,
  scanImagePlatforms, versionSort,
} from './utils/shared'
import type { SiteConfig, ProjectConfig, CategoryDef } from './utils/shared'
import {
  categoryPageMd, categoriesOverviewMd, homepageMd,
  projectPageMd, versionPageMd,
} from './utils/templates'

// ---- 路径常量 ----

const __dir = dirname(new URL(import.meta.url).pathname)
const configFilePath = resolve(__dir, 'config.ts')

// ---- 站点配置 ----

const siteConfigPath = resolve(rootDir, 'site.config.yml')
const site: SiteConfig = readYml<SiteConfig>(siteConfigPath) ?? {}

// ---- 写入工具 ----

function writeYml(path: string, data: unknown): void {
  writeFileSync(path, toYaml(data, { lineWidth: 0 }), 'utf-8')
}

function syncFile(path: string, content: string): void {
  const old = existsSync(path) ? readFileSync(path, 'utf-8') : ''
  if (old !== content) writeFileSync(path, content, 'utf-8')
}

// ---- 页脚 ----

const CONTACT_MAP: Record<string, { label: string; href: (v: string) => string }> = {
  telegram: { label: 'Telegram', href: (v) => `https://t.me/${v}` },
  email:    { label: 'Email',    href: (v) => `mailto:${v}` },
  wechat:   { label: '微信',     href: (v) => v },
  qq:       { label: 'QQ',       href: (v) => `https://wpa.qq.com/msgrd?v=3&uin=${v}` },
  github:   { label: 'GitHub',   href: (v) => `https://github.com/${v}` },
  twitter:  { label: 'Twitter',  href: (v) => `https://x.com/${v}` },
}

function buildFooter(): string {
  const parts = [`${site.title || 'CodeView'}${site.description ? ' - ' + site.description : ''}`]
  if (site.contact) {
    const links = Object.entries(site.contact).map(([k, v]) => {
      const c = CONTACT_MAP[k]
      return c
        ? `<a href="${c.href(v)}" target="_blank">${c.label}</a>`
        : `<a href="${v}" target="_blank">${k}</a>`
    })
    if (links.length) parts.push(links.join(' | '))
  }
  return parts.join(' | ')
}

// ---- 同步：分类 ----

function syncCategories(): CategoryDef[] {
  const categories: CategoryDef[] = []

  for (const name of dirs(demosDir)) {
    const catDir = resolve(demosDir, name)
    const cfgPath = resolve(catDir, 'config.yml')
    let cfg = readYml<Record<string, string>>(cfgPath)
    if (!cfg) {
      cfg = { title: name, icon: '📁', desc: `${name} 分类（请编辑 config.yml 完善）` }
      writeYml(cfgPath, cfg)
    }

    const text = cfg.title || name
    const logo = findLogo(catDir, `/demos/${name}/`)

    syncFile(resolve(catDir, 'index.md'), categoryPageMd(name))
    categories.push({ name, text, icon: cfg.icon, logo, desc: cfg.desc })
  }

  syncFile(resolve(demosDir, 'index.md'), categoriesOverviewMd())
  syncFile(resolve(rootDir, 'index.md'), homepageMd(site, categories))

  return categories
}

// ---- 同步：版本管理 ----

function reconcileVersions(projectDir: string, config: ProjectConfig, hasConfig: boolean): boolean {
  if (!config.versions) config.versions = []

  const onDisk = dirs(projectDir)
    .filter((n) => !n.endsWith('.yml') && !n.endsWith('.md'))
    .sort(versionSort)

  const diskSet = new Set(onDisk)
  const known = new Set(config.versions.map((v) => v.name))
  let dirty = !hasConfig

  const before = config.versions.length
  config.versions = config.versions.filter((v) => diskSet.has(v.name))
  if (config.versions.length < before) dirty = true

  for (const d of onDisk) {
    if (!known.has(d)) { config.versions.push({ name: d }); dirty = true }
  }

  if (config.versions.length) {
    const latest = [...config.versions].sort((a, b) => versionSort(a.name, b.name))[0].name
    for (const v of config.versions) {
      const should = v.name === latest
      if ((v.latest ?? false) !== should) { v.latest = should || undefined; dirty = true }
    }
  }

  return dirty
}

function syncVersionDir(
  vDir: string, vName: string, config: ProjectConfig,
  label: string, basePath: string, depth: number,
): void {
  const vCfgPath = resolve(vDir, 'config.yml')
  const screenshots = scanImagePlatforms(resolve(vDir, 'images'))

  let vc = readYml<Record<string, unknown>>(vCfgPath)
  let vDirty = false

  if (!vc) {
    vc = { title: `${config.title} ${vName}`, version: vName, demo: [], screenshots }
    vDirty = true
  } else {
    if (!vc.title) { vc.title = `${config.title} ${vName}`; vDirty = true }
    if (screenshots.length) {
      const cur = new Set((vc.screenshots as string[]) || [])
      for (const p of screenshots) {
        if (!cur.has(p)) { ((vc.screenshots as string[]) ??= []).push(p); vDirty = true }
      }
    }
  }

  if (vDirty) writeYml(vCfgPath, vc)

  const ref = config.versions.find((v) => v.name === vName)
  if (ref && vc.title) ref.title = vc.title as string

  const upPath = Array(depth).fill('..').join('/')
  const title = (vc.title as string) || `${config.title} ${vName}`

  syncFile(resolve(vDir, 'index.md'), versionPageMd({
    title, upPath, label, vName,
    versions: config.versions,
    basePath,
    hasIntro: existsSync(resolve(vDir, 'intro.md')),
  }))
}

// ---- 同步：项目 ----

function syncProject(projectDir: string, label: string): ProjectConfig {
  const cfgPath = resolve(projectDir, 'config.yml')
  const hasConfig = existsSync(cfgPath)
  const config: ProjectConfig = hasConfig
    ? (readYml<ProjectConfig>(cfgPath) ?? { title: label.split('/').pop()!, desc: '', versions: [] })
    : { title: label.split('/').pop()!, desc: '（请编辑 config.yml 完善）', versions: [] }

  const dirty = reconcileVersions(projectDir, config, hasConfig)
  if (dirty) writeYml(cfgPath, config)

  const basePath = `/demos/${label}`
  syncFile(resolve(projectDir, 'index.md'), projectPageMd(config, basePath))

  const depth = label.split('/').length + 2
  const onDisk = dirs(projectDir).filter((n) => !n.endsWith('.yml') && !n.endsWith('.md'))

  for (const vName of onDisk) {
    syncVersionDir(resolve(projectDir, vName), vName, config, label, basePath, depth)
  }

  return config
}

function loadProjects(catName: string): { slug: string; config: ProjectConfig }[] {
  const catDir = resolve(demosDir, catName)
  const results: { slug: string; config: ProjectConfig }[] = []
  for (const name of dirs(catDir)) {
    const full = resolve(catDir, name)
    const hasConfig = existsSync(resolve(full, 'config.yml'))
    const hasVersions = dirs(full).some((n) => !n.endsWith('.yml') && !n.endsWith('.md'))
    if (!hasConfig && !hasVersions) continue
    try {
      results.push({ slug: name, config: syncProject(full, `${catName}/${name}`) })
    } catch (e) {
      console.warn(`[CodeView] 跳过 ${catName}/${name}:`, (e as Error).message)
    }
  }
  return results
}

// ---- 构建导航与侧边栏 ----

const categories = syncCategories()
const projectsMap = new Map(categories.map((c) => [c.name, loadProjects(c.name)]))
const syncDoneAt = Date.now()

const nav = categories.map((cat) => {
  const projects = projectsMap.get(cat.name) ?? []
  return {
    text: cat.text,
    items: [
      { text: `${cat.text} 总览`, link: `/demos/${cat.name}/` },
      ...projects.map((p) => ({ text: p.config.title, link: `/demos/${cat.name}/${p.slug}/` })),
    ],
  }
})

const sidebar: Record<string, object[]> = {}
for (const cat of categories) {
  const projects = projectsMap.get(cat.name) ?? []
  sidebar[`/demos/${cat.name}/`] = [{
    text: cat.text,
    items: projects.map((p) => ({
      text: p.config.title,
      collapsed: false,
      items: p.config.versions.map((v) => ({
        text: `${v.title || v.name}${v.latest ? ' (最新)' : ''}`,
        link: `/demos/${cat.name}/${p.slug}/${v.name}/`,
      })),
    })),
  }]
}

// ---- Vite 插件：构建时复制 demos 图片到 dist ----

function copyDemosImages(): Plugin {
  return {
    name: 'codeview-copy-images',
    closeBundle() {
      const distDir = resolve(__dir, 'dist')
      if (!existsSync(distDir)) return

      function copyImages(src: string, destBase: string) {
        if (!existsSync(src)) return
        for (const entry of readdirSync(src)) {
          if (entry === '.DS_Store' || entry === 'node_modules') continue
          const srcPath = resolve(src, entry)
          if (statSync(srcPath).isDirectory()) {
            copyImages(srcPath, resolve(destBase, entry))
          } else if (isImageFile(entry)) {
            mkdirSync(destBase, { recursive: true })
            copyFileSync(srcPath, resolve(destBase, entry))
          }
        }
      }

      copyImages(demosDir, resolve(distDir, 'demos'))
      console.log('[CodeView] 已复制 demos 图片到 dist/')
    },
  }
}

// ---- Vite 插件：监听 demos/ 目录变化 ----

function demosWatcher(): Plugin {
  return {
    name: 'codeview-watcher',
    configureServer() {
      let timer: ReturnType<typeof setTimeout> | null = null
      const ignoreUntil = syncDoneAt + 3000

      const watcher = fsWatch(demosDir, { recursive: true }, (_event, filename) => {
        if (!filename || Date.now() < ignoreUntil) return
        if (filename.includes('node_modules') || filename.includes('.DS_Store')) return
        if (filename.endsWith('.md')) return

        const relevant =
          filename.endsWith('.yml') ||
          /\.(png|jpg|jpeg|webp|svg)$/i.test(filename) ||
          _event === 'rename'

        if (!relevant) return

        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          console.log(`[CodeView] 变化: ${filename}，重新加载...`)
          const cacheDir = resolve(__dir, 'cache')
          if (existsSync(cacheDir)) try { rmSync(cacheDir, { recursive: true, force: true }) } catch {}
          try { utimesSync(configFilePath, new Date(), new Date()) } catch {}
        }, 2000)
      })

      process.on('exit', () => watcher.close())
    },
  }
}

// ---- 导出配置 ----

export default defineConfig({
  title: site.title || 'CodeView',
  description: site.description || '源码演示展示平台',
  lang: 'zh-CN',
  cleanUrls: true,

  vite: { plugins: [demosWatcher(), copyDemosImages()] },

  themeConfig: {
    nav,
    sidebar,
    footer: { message: buildFooter() },
    outline: { label: '页面导航' },
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: (() => {
          const chTokenize = (text: string) => {
            const segmenter = (Intl as any).Segmenter
              ? new (Intl as any).Segmenter('zh-CN', { granularity: 'word' })
              : null
            if (segmenter) {
              return [...segmenter.segment(text)]
                .filter((s: any) => s.isWordLike)
                .map((s: any) => s.segment.toLowerCase())
            }
            return text.replace(/[^\p{L}\p{N}]+/gu, ' ').split(/\s+/)
              .flatMap((w: string) => /[\u4e00-\u9fff]/.test(w)
                ? [...w].map((c) => c.toLowerCase())
                : [w.toLowerCase()])
              .filter(Boolean)
          }
          return {
            options: { tokenize: chTokenize },
            searchOptions: {
              tokenize: chTokenize,
              fuzzy: 0.2,
              prefix: true,
              boost: { title: 4, text: 2 },
            },
          }
        })(),
        translations: {
          button: { buttonText: '搜索项目', buttonAriaLabel: '搜索项目' },
          modal: {
            displayDetails: '显示详情',
            noResultsText: '未找到相关项目',
            resetButtonTitle: '清除',
            backButtonTitle: '返回',
            footer: {
              selectText: '选择', selectKeyAriaLabel: '回车选择',
              navigateText: '切换', navigateUpKeyAriaLabel: '上', navigateDownKeyAriaLabel: '下',
              closeText: '关闭', closeKeyAriaLabel: 'esc',
            },
          },
        },
      },
    },
  },
})
