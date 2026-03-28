import { resolve } from 'node:path'
import { rootDir, readYml } from '../utils/shared'
import type { SiteConfig } from '../utils/shared'

export type SiteData = Pick<SiteConfig, 'service'>

const configPath = resolve(rootDir, 'site.config.yml')

export default {
  watch: [configPath],
  load(): SiteData {
    const raw = readYml<SiteConfig>(configPath)
    return { service: raw?.service }
  },
}

declare const data: SiteData
export { data }
