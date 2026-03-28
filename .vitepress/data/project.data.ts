import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { demosDir, readYml, dirs, scanImageMap } from '../utils/shared'

export interface VersionData {
  version: string
  title?: string
  date?: string
  demo?: Record<string, any>[]
  screenshots?: string[]
  images?: Record<string, string[]>
}

export interface ProjectData {
  title: string
  desc: string
  tags?: string[]
  repo?: string
  versions: { name: string; latest?: boolean }[]
}

export interface AllProjects {
  [key: string]: {
    project: ProjectData
    versions: { [ver: string]: VersionData }
  }
}

export default {
  watch: ['../../demos/**/config.yml'],
  load(): AllProjects {
    const result: AllProjects = {}

    for (const cat of dirs(demosDir)) {
      const catDir = resolve(demosDir, cat)

      for (const proj of dirs(catDir)) {
        const projDir = resolve(catDir, proj)
        if (!existsSync(resolve(projDir, 'config.yml'))) continue

        const projConfig = readYml<ProjectData>(resolve(projDir, 'config.yml'))
        if (!projConfig) continue

        const key = `${cat}/${proj}`
        const versions: { [ver: string]: VersionData } = {}

        for (const v of dirs(projDir)) {
          const vConfig = readYml<VersionData>(resolve(projDir, v, 'config.yml'))
          if (!vConfig) continue

          const imagesDir = resolve(projDir, v, 'images')
          vConfig.images = scanImageMap(imagesDir, `/demos/${cat}/${proj}/${v}/images/`)
          versions[v] = vConfig
        }

        result[key] = { project: projConfig, versions }
      }
    }
    return result
  },
}

export declare const data: AllProjects
