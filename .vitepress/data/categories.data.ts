import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { demosDir, readYml, dirs, findLogo } from '../utils/shared'
import type { ProjectConfig } from '../utils/shared'

export interface Project {
  slug: string
  config: ProjectConfig
}

export interface Category {
  name: string
  text: string
  icon?: string
  logo?: string
  desc?: string
  projects: Project[]
}

function loadProjects(categoryDir: string): Project[] {
  return dirs(categoryDir)
    .filter((name) => existsSync(resolve(categoryDir, name, 'config.yml')))
    .map((slug) => ({
      slug,
      config: readYml<ProjectConfig>(resolve(categoryDir, slug, 'config.yml'))!,
    }))
}

export default {
  watch: ['../../demos/**/config.yml'],
  load(): Category[] {
    return dirs(demosDir)
      .filter((name) => existsSync(resolve(demosDir, name, 'config.yml')))
      .map((dirName) => {
        const cfg = readYml<{ title?: string; icon?: string; desc?: string }>(
          resolve(demosDir, dirName, 'config.yml'),
        ) || {}
        return {
          name: dirName,
          text: cfg.title || dirName,
          icon: cfg.icon,
          logo: findLogo(resolve(demosDir, dirName), `/demos/${dirName}/`),
          desc: cfg.desc,
          projects: loadProjects(resolve(demosDir, dirName)),
        }
      })
  },
}

export declare const data: Category[]
