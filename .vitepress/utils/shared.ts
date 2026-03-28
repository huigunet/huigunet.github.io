import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

// ---- 路径常量 ----

const __dir = dirname(fileURLToPath(import.meta.url))
export const rootDir = resolve(__dir, '../..')
export const demosDir = resolve(rootDir, 'demos')

// ---- 常量 ----

export const IGNORE = new Set(['.DS_Store', 'node_modules', 'images'])
export const LOGO_NAMES = ['logo.png', 'logo.svg', 'logo.webp', 'logo.jpg']
export const IMG_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'])

// ---- 类型 ----

export interface SiteConfig {
  title?: string
  description?: string
  tagline?: string
  contact?: Record<string, string>
  service?: { url?: string }
}

export interface VersionRef {
  name: string
  title?: string
  latest?: boolean
}

export interface ProjectConfig {
  title: string
  desc: string
  tags?: string[]
  repo?: string
  versions: VersionRef[]
}

export interface CategoryDef {
  name: string
  text: string
  icon?: string
  logo?: string
  desc?: string
}

// ---- 工具函数 ----

export function readYml<T>(path: string): T | null {
  try { return parseYaml(readFileSync(path, 'utf-8')) as T } catch { return null }
}

export function isDir(p: string): boolean {
  return existsSync(p) && statSync(p).isDirectory()
}

export function dirs(parent: string): string[] {
  if (!existsSync(parent)) return []
  return readdirSync(parent).filter(
    (n) => !IGNORE.has(n) && !n.startsWith('.') && isDir(resolve(parent, n)),
  )
}

export function findLogo(dir: string, urlBase: string): string | undefined {
  for (const n of LOGO_NAMES) {
    if (existsSync(resolve(dir, n))) return urlBase + n
  }
}

export function isImageFile(filename: string): boolean {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase()
  return IMG_EXTS.has(ext)
}

export function versionSort(a: string, b: string): number {
  return b.localeCompare(a, undefined, { numeric: true })
}

export function scanImagePlatforms(imagesDir: string): string[] {
  if (!isDir(imagesDir)) return []
  return readdirSync(imagesDir).filter((name) => {
    const platDir = resolve(imagesDir, name)
    if (!isDir(platDir)) return false
    return readdirSync(platDir).some((f) => isImageFile(f))
  })
}

export function scanImageMap(imagesDir: string, urlBase: string): Record<string, string[]> {
  const images: Record<string, string[]> = {}
  if (!isDir(imagesDir)) return images
  for (const platform of readdirSync(imagesDir)) {
    const platDir = resolve(imagesDir, platform)
    if (!isDir(platDir)) continue
    const files = readdirSync(platDir)
      .filter((f) => isImageFile(f))
      .sort()
      .map((f) => `${urlBase}${platform}/${f}`)
    if (files.length > 0) images[platform] = files
  }
  return images
}
