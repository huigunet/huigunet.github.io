# 开发指南

本文档提供 CodeView 项目的开发指南和最佳实践。

## 快速开始

### 环境要求

| 工具 | 版本要求 | 说明 |
|------|---------|------|
| Node.js | >= 24.x | 运行时环境 |
| pnpm | >= 10.x | 包管理器 |
| cwebp | 最新版 | 图片压缩工具（可选） |

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/username/codeview_demo.git
cd codeview_demo

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 http://localhost:5173

---

## 开发工作流

### 1. 添加新 Demo

#### 步骤 1: 创建目录结构

```bash
# 创建项目目录
mkdir -p demos/web/blog-system/v1.0/images/{pc,mobile}

# 创建配置文件
touch demos/web/blog-system/config.yml
touch demos/web/blog-system/v1.0/config.yml
```

#### 步骤 2: 编写项目配置

编辑 `demos/web/blog-system/config.yml`：

```yaml
title: 博客系统
desc: 现代化的个人博客平台，支持 Markdown 写作
tags:
  - Vue
  - TypeScript
  - Vite
  - Markdown
repo: https://github.com/username/blog-system
versions: []  # 系统自动填充
```

#### 步骤 3: 编写版本配置

编辑 `demos/web/blog-system/v1.0/config.yml`：

```yaml
version: v1.0
title: 博客系统 v1.0
date: 2025-03-29

demo:
  - platform: pc
    url: https://blog.example.com
    username: admin
    password: admin123
    note: 管理后台
```

#### 步骤 4: 添加截图

```bash
# 复制截图到对应目录
cp screenshots/pc/*.png demos/web/blog-system/v1.0/images/pc/
cp screenshots/mobile/*.png demos/web/blog-system/v1.0/images/mobile/
```

#### 步骤 5: 实时预览

开发服务器会自动检测变化并重新加载：

```bash
# 如果开发服务器已启动，稍等2秒即可看到更新
# 如果未启动，运行：
pnpm dev
```

### 2. 更新现有 Demo

#### 添加新版本

```bash
# 复制现有版本作为模板
cp -r demos/web/blog-system/v1.0 demos/web/blog-system/v1.1

# 修改配置
vim demos/web/blog-system/v1.1/config.yml

# 更新截图
rm demos/web/blog-system/v1.1/images/pc/*
cp new-screenshots/*.png demos/web/blog-system/v1.1/images/pc/
```

#### 修改项目配置

```bash
# 直接编辑配置文件
vim demos/web/blog-system/config.yml

# 保存后会自动重新加载
```

### 3. 调试组件

#### 修改现有组件

```bash
# 编辑组件
vim .vitepress/theme/components/DemoCard.vue

# 保存后会热更新（HMR）
```

#### 添加新组件

**步骤 1: 创建组件**

```vue
<!-- .vitepress/theme/components/MyComponent.vue -->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  content?: string
}>()

const displayText = computed(() => {
  return props.content || props.title
})
</script>

<template>
  <div class="my-component">
    <h3>{{ title }}</h3>
    <p>{{ displayText }}</p>
  </div>
</template>

<style scoped>
.my-component {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
</style>
```

**步骤 2: 注册组件**

编辑 `.vitepress/theme/index.ts`：

```typescript
import DefaultTheme from 'vitepress/theme'
import MyComponent from './components/MyComponent.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('MyComponent', MyComponent)
  }
}
```

**步骤 3: 在 Markdown 中使用**

```markdown
# 测试页面

<MyComponent title="Hello" content="World" />
```

### 4. 修改配置系统

#### 添加新配置字段

**步骤 1: 更新类型定义**

编辑 `.vitepress/utils/shared.ts`：

```typescript
export interface ProjectConfig {
  title: string
  desc: string
  tags?: string[]
  repo?: string
  author?: string     // 新增字段
  license?: string    // 新增字段
  versions: VersionRef[]
}
```

**步骤 2: 更新模板**

编辑 `.vitepress/utils/templates.ts`：

```typescript
export function projectPageMd(config: ProjectConfig, basePath: string): string {
  return `---
title: ${config.title}
---

# ${config.title}

${config.desc || ''}

${config.author ? `**作者:** ${config.author}` : ''}
${config.license ? `**许可证:** ${config.license}` : ''}

<VersionTabs ... />
`
}
```

**步骤 3: 使用新字段**

在项目配置中添加：

```yaml
title: 博客系统
desc: ...
author: John Doe
license: MIT
```

---

## 调试技巧

### 1. 查看生成的页面

```bash
# 生成的 Markdown 文件位于项目目录中
cat demos/web/blog-system/index.md
cat demos/web/blog-system/v1.0/index.md
```

### 2. 查看 Data Loader 数据

在 Vue 组件或 Markdown 中：

```vue
<script setup>
import { data as categories } from '.vitepress/data/categories.data'
import { data as allProjects } from '.vitepress/data/project.data'

console.log('Categories:', categories)
console.log('Projects:', allProjects)
</script>
```

### 3. 清除缓存

```bash
# 清除 VitePress 缓存
rm -rf .vitepress/cache

# 重启开发服务器
pnpm dev
```

### 4. 查看构建日志

```bash
# 详细构建日志
pnpm build --debug

# 或使用 Node.js 调试
NODE_OPTIONS="--inspect" pnpm build
```

---

## 代码规范

### TypeScript

```typescript
// ✅ 使用显式类型
function loadConfig(path: string): ProjectConfig {
  return readYml<ProjectConfig>(path)
}

// ❌ 避免使用 any
function loadConfig(path: any): any {
  return readYml(path)
}

// ✅ 使用接口定义
interface DemoConfig {
  platform: string
  url: string
}

// ❌ 避免内联类型
const demo: { platform: string; url: string } = { ... }
```

### Vue 组件

```vue
<!-- ✅ 使用 script setup + TypeScript -->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  count?: number
}>()

const displayCount = computed(() => props.count || 0)
</script>

<!-- ❌ 避免使用 Options API -->
<script>
export default {
  props: {
    title: String,
    count: Number
  },
  computed: {
    displayCount() {
      return this.count || 0
    }
  }
}
</script>
```

### CSS

```css
/* ✅ 使用 VitePress CSS 变量 */
.my-component {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

/* ❌ 避免硬编码颜色 */
.my-component {
  color: #333;
  background: #f5f5f5;
  border: 1px solid #ddd;
}

/* ✅ 使用 scoped 样式 */
<style scoped>
.card {
  padding: 1rem;
}
</style>

/* ❌ 避免全局污染 */
<style>
.card {
  padding: 1rem;
}
</style>
```

### YAML 配置

```yaml
# ✅ 使用 2 空格缩进
title: 博客系统
desc: 描述文本
tags:
  - Vue
  - TypeScript

# ❌ 避免使用 Tab
title: 博客系统
desc: 描述文本
tags:
	- Vue  # Tab 缩进

# ✅ 使用引号包裹特殊字符
title: "项目: 博客系统"
url: "https://example.com?a=1&b=2"

# ❌ 特殊字符未转义
title: 项目: 博客系统
url: https://example.com?a=1&b=2
```

---

## 性能优化

### 1. 图片优化

```bash
# 自动压缩（构建时）
pnpm build

# 手动压缩
pnpm compress

# 跳过压缩
pnpm vitepress build
```

**最佳实践：**
- PC 截图：1920x1080，< 500KB
- Mobile 截图：750x1334，< 300KB
- Logo/图标：256x256，< 50KB

### 2. 代码分割

VitePress 自动按页面分割代码，无需额外配置。

**查看分割结果：**

```bash
pnpm build
ls -lh .vitepress/dist/assets/
```

### 3. Data Loader 缓存

Data Loader 结果会缓存到 `.vitepress/cache/`。

**清除缓存触发重新加载：**

```bash
rm -rf .vitepress/cache
```

---

## 测试

### 构建测试

```bash
# 测试构建是否成功
pnpm build

# 预览构建结果
pnpm preview
```

### 链接检查

```bash
# 安装 broken-link-checker
npm i -g broken-link-checker

# 启动预览服务器
pnpm preview &

# 检查死链
blc http://localhost:4173 -ro
```

### 类型检查

```bash
# 检查 TypeScript 类型
pnpm tsc --noEmit
```

---

## Git 工作流

### 分支策略

```bash
# 功能开发
git checkout -b feature/add-xxx

# Bug 修复
git checkout -b fix/issue-123

# 文档更新
git checkout -b docs/update-readme
```

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```bash
# 新功能
git commit -m "feat: 添加博客系统 Demo"

# Bug 修复
git commit -m "fix: 修复版本排序错误"

# 文档更新
git commit -m "docs: 更新开发指南"

# 样式调整
git commit -m "style: 调整 DemoCard 组件样式"

# 重构
git commit -m "refactor: 重构配置加载逻辑"

# 性能优化
git commit -m "perf: 优化图片加载速度"

# 测试
git commit -m "test: 添加配置解析测试"

# 构建配置
git commit -m "chore: 更新 package.json 依赖"
```

---

## 常见问题

### 1. 开发服务器启动失败

**错误：** `Port 5173 is already in use`

**解决：**
```bash
# 指定其他端口
pnpm vitepress dev --port 3000
```

### 2. 热更新不工作

**解决：**
```bash
# 清除缓存并重启
rm -rf .vitepress/cache
pnpm dev
```

### 3. 图片不显示

**检查：**
1. 图片路径是否正确
2. 是否有平台子目录（`images/pc/`，而非 `images/`）
3. 文件名是否包含特殊字符

**调试：**
```bash
# 查看系统扫描的截图
cat demos/xxx/v1.0/config.yml | grep screenshots

# 检查图片是否存在
ls demos/xxx/v1.0/images/pc/
```

### 4. 配置文件不生效

**原因：** YAML 格式错误

**检查：**
```bash
# 使用 YAML 验证器
npx js-yaml demos/xxx/config.yml
```

**常见错误：**
- 使用 Tab 而非空格
- 冒号后缺少空格（`title:xxx` 应为 `title: xxx`）
- 数组格式错误

### 5. TypeScript 类型错误

**解决：**
```bash
# 运行类型检查
pnpm tsc --noEmit

# 查看详细错误信息
pnpm tsc --noEmit --pretty
```

---

## IDE 配置

### VS Code

**推荐扩展：**

```json
{
  "recommendations": [
    "Vue.volar",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "redhat.vscode-yaml"
  ]
}
```

**工作区设置 (`.vscode/settings.json`)：**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  },
  "[yaml]": {
    "editor.defaultFormatter": "redhat.vscode-yaml"
  },
  "yaml.schemas": {
    "./.vitepress/utils/schemas/*.json": "demos/**/config.yml"
  }
}
```

### WebStorm

**文件监听：**
- Settings → Tools → File Watchers
- 添加 VitePress 监听器

**TypeScript 配置：**
- Settings → Languages & Frameworks → TypeScript
- 启用 "TypeScript Language Service"

---

## 贡献指南

### 提交 Pull Request

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'feat: xxx'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 创建 Pull Request

### 代码审查清单

- [ ] 代码符合项目规范
- [ ] 通过 TypeScript 类型检查
- [ ] 构建成功 (`pnpm build`)
- [ ] 更新相关文档
- [ ] 添加必要的注释

---

## 学习资源

### 官方文档

- [VitePress 官方文档](https://vitepress.dev/)
- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 手册](https://www.typescriptlang.org/)

### 相关项目

- [VitePress Theme](https://github.com/vuejs/vitepress/tree/main/src/client/theme-default)
- [Awesome VitePress](https://github.com/logicspark/awesome-vitepress)

### 社区

- [VitePress Discord](https://chat.vuejs.org/)
- [Vue.js 论坛](https://forum.vuejs.org/)

---

## 下一步

- 阅读 [架构详解](./architecture.md) 了解系统设计
- 阅读 [配置文件详解](./configuration.md) 了解配置选项
- 阅读 [组件 API 文档](./components.md) 了解自定义组件
- 阅读 [Demo 结构规范](./demo-structure.md) 了解内容组织
