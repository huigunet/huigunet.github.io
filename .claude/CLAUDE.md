# CodeView 项目规则集

你**必须严格遵守以下规则**，任何违反都视为严重错误。

本规则集优先级：
- 根目录 `CLAUDE.md`（系统级规则）
- 本文件（项目级规则）
- 用户即时指令
- **交互语言**: 中文

---

## P1. 项目概述

| 项目 | 说明 |
|------|------|
| **名称** | CodeView |
| **类型** | Demo 演示展示平台 |
| **框架** | VitePress 2.0.0-alpha.17 |
| **包管理** | pnpm 10 |
| **运行时** | Node.js 24 |

### 核心架构

```
站点配置 (site.config.yml)
    ↓
分类 (Category)
    ↓
项目 (Project)
    ↓
版本 (Version)
```

### 数据流

```
配置文件 (*.yml)
    ↓
Data Loaders (.vitepress/data/*.data.ts)
    ↓
模板生成器 (.vitepress/utils/templates.ts)
    ↓
Markdown 页面 (自动生成)
    ↓
VitePress 渲染
```

### 关键特性

- ✅ 自动扫描目录结构生成页面
- ✅ 自动版本管理（检测、排序、标记最新版）
- ✅ 自动图片压缩（WebP）
- ✅ 开发时热更新（config.yml / 图片变化）
- ✅ 类型安全（完整 TypeScript 类型定义）

---

## P2. 核心概念速查

### 三级配置系统

| 层级 | 文件路径 | 作用 | 文档 |
|------|---------|------|------|
| **站点** | `site.config.yml` | 全局配置 | [配置详解](../docs/configuration.md#1-站点配置) |
| **分类** | `demos/[category]/config.yml` | 分类信息 | [配置详解](../docs/configuration.md#2-分类配置) |
| **项目** | `demos/[category]/[project]/config.yml` | 项目配置 | [配置详解](../docs/configuration.md#3-项目配置) |
| **版本** | `demos/[category]/[project]/[version]/config.yml` | 版本详情 | [配置详解](../docs/configuration.md#4-版本配置) |

### 自动化机制

| 功能 | 说明 | 实现位置 |
|------|------|---------|
| 版本自动管理 | 扫描目录 → 更新 versions 数组 → 标记 latest | `.vitepress/config.ts:reconcileVersions()` |
| 页面自动生成 | 读取配置 → 应用模板 → 生成 Markdown | `.vitepress/utils/templates.ts` |
| 截图自动扫描 | 扫描 images/ → 生成 screenshots 和 images | `.vitepress/utils/shared.ts:scanImagePlatforms()` |
| 图片自动压缩 | 查找图片 → cwebp 转 WebP → 删除原图 | `scripts/compress-images.sh` |

### 核心组件

| 组件 | 用途 | 文档 |
|------|------|------|
| `<DemoCard>` | 展示 Demo 卡片 | [组件 API](../docs/components.md#democard) |
| `<DemoGrid>` | 卡片网格容器 | [组件 API](../docs/components.md#demogrid) |
| `<VersionTabs>` | 版本切换标签 | [组件 API](../docs/components.md#versiontabs) |
| `<DemoInfo>` | 演示站点信息 | [组件 API](../docs/components.md#demoinfo) |
| `<ImageGallery>` | 多平台截图 | [组件 API](../docs/components.md#imagegallery) |

---

## P3. 常用命令

```bash
# 开发
pnpm dev                    # 启动开发服务器（http://localhost:5173）
pnpm tsc --noEmit           # TypeScript 类型检查

# 构建
pnpm build                  # 完整构建（压缩图片 + 构建站点）
pnpm vitepress build        # 仅构建站点（跳过图片压缩）
pnpm preview                # 预览构建结果

# 清理
rm -rf .vitepress/cache     # 清除缓存
rm -rf .vitepress/dist      # 清除构建产物
```

---

## P4. 目录结构

```
.
├── .claude/              # Claude Code 配置
│   └── CLAUDE.md         # 本文件（项目规则集）
├── docs/                 # 详细技术文档
│   ├── architecture.md   # 架构详解
│   ├── configuration.md  # 配置文件详解
│   ├── components.md     # 组件 API 文档
│   ├── build-system.md   # 构建系统与部署
│   ├── demo-structure.md # Demo 内容组织规范
│   └── development.md    # 开发指南
├── .vitepress/           # VitePress 配置
│   ├── config.ts         # 主配置（扫描、生成、构建）
│   ├── utils/            # 工具函数
│   │   ├── shared.ts     # 共享函数（readYml、scanImages 等）
│   │   └── templates.ts  # Markdown 模板生成器
│   ├── data/             # Data Loaders（构建时加载数据）
│   │   ├── categories.data.ts  # 加载所有分类
│   │   └── project.data.ts     # 加载所有项目详情
│   └── theme/            # 主题定制
│       ├── index.ts      # 主题入口（注册组件）
│       ├── components/   # 自定义 Vue 组件
│       └── styles/       # 全局样式
├── demos/                # Demo 内容（核心目录）
│   ├── [category]/       # 分类目录
│   │   ├── config.yml    # 分类配置
│   │   └── [project]/    # 项目目录
│   │       ├── config.yml       # 项目配置
│   │       └── [version]/       # 版本目录
│   │           ├── config.yml   # 版本配置
│   │           ├── intro.md     # 版本介绍（可选）
│   │           └── images/      # 截图目录
│   │               └── [platform]/  # 平台子目录（pc/mobile/admin）
├── scripts/              # 构建脚本
│   └── compress-images.sh  # 图片压缩脚本
├── site.config.yml       # 站点全局配置
└── package.json          # 项目依赖配置
```

---

## P5. 工作流规范

### 添加新 Demo

```bash
# 1. 创建目录
mkdir -p demos/[category]/[project]/[version]/images/{pc,mobile}

# 2. 创建配置文件
touch demos/[category]/[project]/config.yml
touch demos/[category]/[project]/[version]/config.yml

# 3. 编写配置（参考 docs/configuration.md）

# 4. 添加截图
cp screenshots/*.png demos/[category]/[project]/[version]/images/pc/

# 5. 运行构建（或启动 dev 实时预览）
pnpm build  # 或 pnpm dev
```

### 添加新版本

```bash
# 1. 创建版本目录
mkdir -p demos/[category]/[project]/[version]/images/pc

# 2. 添加版本配置
cat > demos/[category]/[project]/[version]/config.yml << EOF
version: v1.1
title: 新版本标题
date: 2025-03-29
demo:
  - platform: pc
    url: https://demo.example.com
EOF

# 3. 添加截图并构建
cp screenshots/*.png demos/[category]/[project]/[version]/images/pc/
pnpm build
```

**重要：** 系统会自动：
- 将新版本添加到项目的 `versions` 数组
- 自动标记最新版本为 `latest: true`
- 扫描截图并生成 `screenshots` 和 `images`

---

## P6. 开发规范

### TypeScript

```typescript
// ✅ 使用显式类型 + 接口定义
interface Config {
  title: string
  desc?: string
}

function load(path: string): Config {
  return readYml<Config>(path)
}

// ❌ 避免使用 any
function load(path: any): any { ... }
```

### Vue 组件

```vue
<!-- ✅ 使用 script setup + TypeScript -->
<script setup lang="ts">
const props = defineProps<{
  title: string
  count?: number
}>()
</script>

<!-- ❌ 避免使用 Options API -->
<script>
export default {
  props: { title: String }
}
</script>
```

### CSS

```css
/* ✅ 使用 VitePress CSS 变量 */
.card {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

/* ❌ 避免硬编码颜色 */
.card {
  color: #333;
  background: #f5f5f5;
}
```

### YAML 配置

```yaml
# ✅ 2 空格缩进 + 完整字段
title: 项目名称
desc: 项目描述
tags:
  - Vue
  - TypeScript

# ❌ 避免 Tab 缩进 / 空值
title:              # ✗ 空值
desc: 项目描述
tags:
	- Vue           # ✗ Tab 缩进
```

---

## P7. 关键约束

### 1. 配置文件

- ✅ **自动管理**：`versions` 数组由系统维护，只需手动添加 `title` 字段
- ✅ **自动扫描**：`screenshots` 和 `images` 由系统生成，无需手动编辑
- ❌ **禁止**：手动添加/删除 `versions` 数组条目
- ❌ **禁止**：直接编辑 `screenshots` 和 `images`

### 2. 目录结构

- ✅ **必须**：版本目录必须包含 `config.yml`（否则不会被识别）
- ✅ **必须**：截图必须放在平台子目录下（如 `images/pc/`，而非 `images/`）
- ❌ **禁止**：使用中文目录名
- ❌ **禁止**：在项目目录名中包含版本号

### 3. 文件生成

- ✅ **允许**：系统自动生成的 Markdown 文件可被修改（但会在下次构建时覆盖）
- ✅ **允许**：添加 `intro.md` 等自定义 Markdown（不会被覆盖）
- ❌ **禁止**：修改 `node_modules/` 中的任何文件

---

## P8. 故障排查

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 版本未显示 | 缺少 `config.yml` | `touch demos/.../v1.0/config.yml` |
| 截图未显示 | 缺少平台子目录 | 创建 `images/pc/` 而非直接放在 `images/` |
| 热更新不工作 | 缓存问题 | `rm -rf .vitepress/cache && pnpm dev` |
| 图片压缩失败 | 缺少 cwebp 工具 | `brew install webp` (macOS) |
| 构建内存不足 | Node.js 内存限制 | `NODE_OPTIONS="--max-old-space-size=4096" pnpm build` |

---

## P9. 详细文档索引

当需要深入了解某个主题时，参考以下详细文档：

| 主题 | 文档 | 说明 |
|------|------|------|
| **系统架构** | [docs/architecture.md](../docs/architecture.md) | 数据流、模块设计、插件机制 |
| **配置文件** | [docs/configuration.md](../docs/configuration.md) | 所有配置字段的完整说明 |
| **组件 API** | [docs/components.md](../docs/components.md) | 自定义组件的 Props 和用法 |
| **构建部署** | [docs/build-system.md](../docs/build-system.md) | 构建流程、部署方案、CI/CD |
| **内容组织** | [docs/demo-structure.md](../docs/demo-structure.md) | Demo 目录结构、文件规范 |
| **开发指南** | [docs/development.md](../docs/development.md) | 开发工作流、调试技巧、最佳实践 |

---

## P10. 输出约束

### 代码输出

1. 输出**可直接运行的完整代码**
2. 不得省略关键配置或随意创建冗余文件
3. 新增页面必须同步更新导航/侧边栏配置
4. 所有解释说明使用中文，代码标识符使用英文

### 配置修改

1. 修改配置文件时，必须保持 YAML 格式正确（2 空格缩进）
2. 添加新字段时，同步更新 TypeScript 类型定义
3. 修改核心配置（如 `versions`）时，必须理解自动化机制

### 文件操作

1. 优先编辑现有文件，避免创建新文件
2. 不得修改系统自动生成的文件（除非用户明确要求）
3. 添加新功能时，同步更新相关文档

---

## 快速参考

### 常见任务

| 任务 | 命令/步骤 |
|------|----------|
| 启动开发 | `pnpm dev` |
| 添加 Demo | 见 [P5 工作流规范](#p5-工作流规范) |
| 修改配置 | 编辑 `*.yml` → 保存 → 自动重载 |
| 清除缓存 | `rm -rf .vitepress/cache` |
| 类型检查 | `pnpm tsc --noEmit` |
| 构建部署 | `pnpm build` |

### 关键文件

| 文件 | 作用 |
|------|------|
| `.vitepress/config.ts` | 主配置（扫描、生成、构建） |
| `.vitepress/utils/shared.ts` | 工具函数（readYml、scanImages） |
| `.vitepress/utils/templates.ts` | Markdown 模板生成 |
| `.vitepress/data/*.data.ts` | Data Loaders（构建时数据加载） |
| `site.config.yml` | 站点全局配置 |
| `scripts/compress-images.sh` | 图片压缩脚本 |

### 关键概念

| 概念 | 说明 |
|------|------|
| **Data Loader** | VitePress 构建时数据加载机制，缓存结果到 `.vitepress/cache/` |
| **reconcileVersions** | 自动版本管理函数：扫描目录 → 更新配置 → 标记最新 |
| **syncCategories** | 同步分类：扫描目录 → 生成配置 → 生成页面 |
| **copyDemosImages** | Vite 插件：构建完成后复制图片到 `dist/` |
| **demosWatcher** | Vite 插件：监听 demos/ 变化 → 清除缓存 → 触发重载 |

---

## 最后提醒

- **优先查阅详细文档**：本文件是快速参考，详细信息见 `docs/` 目录
- **理解自动化机制**：系统会自动管理 `versions`、`screenshots`、`images`，无需手动编辑
- **遵守目录规范**：错误的目录结构会导致功能失效
- **保持类型安全**：修改配置结构时同步更新 TypeScript 类型
- **及时清除缓存**：遇到奇怪问题时，首先尝试 `rm -rf .vitepress/cache`
