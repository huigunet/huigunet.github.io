# 组件 API 文档

CodeView 提供了一系列自定义 Vue 组件，用于展示 Demo 内容。

## 组件列表

| 组件 | 用途 | 位置 |
|------|------|------|
| `DemoCard` | 展示单个 Demo 或分类的卡片 | `.vitepress/theme/components/DemoCard.vue` |
| `DemoGrid` | Demo 卡片网格布局容器 | `.vitepress/theme/components/DemoGrid.vue` |
| `VersionTabs` | 版本切换标签页 | `.vitepress/theme/components/VersionTabs.vue` |
| `DemoInfo` | 演示站点信息展示（含二维码） | `.vitepress/theme/components/DemoInfo.vue` |
| `ImageGallery` | 多平台截图画廊 | `.vitepress/theme/components/ImageGallery.vue` |
| `ContactFloat` | 悬浮客服按钮 | `.vitepress/theme/components/ContactFloat.vue` |

---

## DemoCard

展示单个 Demo 项目或分类的卡片组件。

### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | 是 | 卡片标题 |
| `desc` | `string` | 否 | 描述文本 |
| `icon` | `string` | 否 | 图标（Emoji 或图片 URL） |
| `logo` | `string` | 否 | Logo 图片 URL（优先于 icon） |
| `link` | `string` | 是 | 跳转链接 |
| `tags` | `string[]` | 否 | 标签列表 |
| `count` | `number` | 否 | 版本数量（显示为 "N 个版本"） |

### 使用示例

#### 1. 分类卡片

```vue
<DemoCard
  title="刷单系列"
  desc="移动端与工具类应用源码展示"
  icon="📱"
  link="/demos/app/"
  :count="5"
/>
```

#### 2. 项目卡片

```vue
<DemoCard
  title="TK商城刷单"
  desc="即时通讯应用，支持单聊、群聊、文件传输"
  link="/demos/app/chat-app/"
  :tags="['Node.js', 'WebSocket', 'Vue']"
  :count="3"
/>
```

#### 3. 带 Logo 的卡片

```vue
<DemoCard
  title="博客系统"
  logo="/demos/web/blog/logo.png"
  link="/demos/web/blog/"
/>
```

### 图标处理逻辑

- 优先使用 `logo` 属性
- 如果 `icon` 是图片 URL（以 `/` 或 `http` 开头，或以 `.png/.svg/.webp` 结尾），显示为图片
- 否则，显示为 Emoji 或文本

---

## DemoGrid

用于包裹多个 `DemoCard` 的网格布局容器。

### 特性

- 响应式网格布局
- 自动适配卡片数量
- 支持 v-for 循环渲染

### 使用示例

```vue
<DemoGrid>
  <DemoCard
    v-for="proj in category.projects"
    :key="proj.slug"
    :title="proj.config.title"
    :desc="proj.config.desc"
    :link="'/demos/app/' + proj.slug + '/'"
    :tags="proj.config.tags"
    :count="proj.config.versions.length"
  />
</DemoGrid>
```

### 样式说明

默认样式：
- 网格间距：`1.5rem`
- 最小列宽：`280px`
- 自动填充列数（`repeat(auto-fill, minmax(280px, 1fr))`）

---

## VersionTabs

版本切换标签页组件，显示项目的所有版本。

### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `versions` | `VersionRef[]` | 是 | 版本列表 |
| `current` | `string` | 是 | 当前版本名称（空字符串表示项目首页） |
| `basePath` | `string` | 是 | 基础路径（如 `/demos/app/chat-app/`） |

### VersionRef 类型

```typescript
interface VersionRef {
  name: string      // 版本名称（如 "v1.0"）
  title?: string    // 显示标题（如 "正式版 1.0"）
  latest?: boolean  // 是否为最新版本
}
```

### 使用示例

#### 1. 项目首页

```vue
<VersionTabs
  :versions='[{"name":"v1.0","title":"TK商城刷单","latest":true}]'
  current=""
  base-path="/demos/app/chat-app/"
/>
```

#### 2. 版本页面

```vue
<script setup>
import { data as allProjects } from '../.vitepress/data/project.data'
const info = allProjects['app/chat-app']
</script>

<VersionTabs
  :versions="info.project.versions"
  current="v1.0"
  base-path="/demos/app/chat-app/"
/>
```

### 渲染效果

- 每个版本显示为圆角按钮
- 当前版本高亮（品牌色背景）
- 最新版本显示 "最新" 徽章
- 点击跳转到对应版本页面

---

## DemoInfo

展示演示站点信息，支持多平台、账号密码、二维码。

### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `demo` | `DemoConfig[]` | 否 | 演示站点配置列表 |

### DemoConfig 类型

```typescript
interface DemoConfig {
  platform: string   // 平台标识（pc/mobile/admin/agent 等）
  url: string        // 演示站点 URL
  username?: string  // 登录用户名
  password?: string  // 登录密码
  qr?: boolean       // 是否显示二维码
  note?: string      // 备注说明
}
```

### 平台图标映射

| platform | 图标 | 说明 |
|----------|------|------|
| `pc` | 💻 | PC 端 / 桌面端 |
| `mobile` | 📱 | 移动端 H5 |
| `admin` | 🔧 | 管理后台 |
| `agent` | 👤 | 代理后台 |
| `api` | 🔌 | API 文档 |
| `h5` | 📱 | H5 页面 |
| `app` | 📲 | 原生 APP |
| 其他 | 🌐 | 默认图标 |

### 使用示例

```vue
<script setup>
import { data as allProjects } from '../.vitepress/data/project.data'
const config = allProjects['app/chat-app'].versions['v1.0']
</script>

<DemoInfo :demo="config.demo" />
```

### 配置示例

```yaml
# config.yml
demo:
  - platform: pc
    url: https://demo.example.com
    username: admin
    password: admin123
    note: 管理后台

  - platform: mobile
    url: https://m.demo.example.com
    qr: true
    note: 移动端 H5（扫码访问）
```

### 渲染效果

- 每个平台显示为独立卡片
- 显示平台图标 + 名称
- 显示访问链接（可点击）
- 显示账号密码（如果配置）
- 显示二维码（如果 `qr: true`）
- 显示备注说明（如果配置）

---

## ImageGallery

多平台截图画廊组件，支持分平台展示和切换。

### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `platforms` | `string[]` | 否 | 平台列表（自动扫描） |
| `images` | `Record<string, string[]>` | 否 | 平台 → 图片 URL 映射（自动生成） |
| `basePath` | `string` | 是 | 图片基础路径 |

### 使用示例

#### 1. 自动模式（推荐）

```vue
<script setup>
import { data as allProjects } from '../.vitepress/data/project.data'
const config = allProjects['app/chat-app'].versions['v1.0']
</script>

<ImageGallery
  v-if="config.screenshots?.length || (config.images && Object.keys(config.images).length)"
  :platforms="config.images ? Object.keys(config.images) : config.screenshots"
  :images="config.images"
  base-path="/demos/app/chat-app/v1.0/images/"
/>
```

#### 2. 手动指定

```vue
<ImageGallery
  :platforms="['pc', 'mobile']"
  :images="{
    pc: ['/demos/app/chat-app/v1.0/images/pc/01.webp'],
    mobile: ['/demos/app/chat-app/v1.0/images/mobile/01.webp']
  }"
  base-path="/demos/app/chat-app/v1.0/images/"
/>
```

### 特性

- 平台切换标签页
- 图片懒加载
- 点击放大预览
- 支持键盘导航（左右箭头）
- 响应式布局

### 图片组织结构

```
v1.0/images/
  ├── pc/
  │   ├── 01-home.webp
  │   ├── 02-chat.webp
  │   └── 03-settings.webp
  ├── mobile/
  │   ├── 01-list.webp
  │   └── 02-detail.webp
  └── admin/
      └── 01-dashboard.webp
```

系统自动生成：

```yaml
screenshots:
  - pc
  - mobile
  - admin

images:
  pc:
    - /demos/.../images/pc/01-home.webp
    - /demos/.../images/pc/02-chat.webp
    - /demos/.../images/pc/03-settings.webp
  mobile:
    - /demos/.../images/mobile/01-list.webp
    - /demos/.../images/mobile/02-detail.webp
  admin:
    - /demos/.../images/admin/01-dashboard.webp
```

---

## ContactFloat

悬浮客服按钮组件，显示在页面右下角。

### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `url` | `string` | 否 | 客服链接（从 site.config.yml 读取） |

### 使用示例

```vue
<!-- 在 Layout 中自动加载 -->
<ContactFloat :url="siteConfig.service?.url" />
```

### 配置

在 `site.config.yml` 中配置：

```yaml
service:
  url: https://t.me/huigunet
```

### 特性

- 固定在右下角
- 点击打开客服链接（新窗口）
- 默认图标：💬
- 如果未配置 `service.url`，组件不显示

---

## 组件注册

所有组件在 `.vitepress/theme/index.ts` 中全局注册：

```typescript
import DefaultTheme from 'vitepress/theme'
import DemoCard from './components/DemoCard.vue'
import DemoGrid from './components/DemoGrid.vue'
import VersionTabs from './components/VersionTabs.vue'
import DemoInfo from './components/DemoInfo.vue'
import ImageGallery from './components/ImageGallery.vue'
import ContactFloat from './components/ContactFloat.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoCard', DemoCard)
    app.component('DemoGrid', DemoGrid)
    app.component('VersionTabs', VersionTabs)
    app.component('DemoInfo', DemoInfo)
    app.component('ImageGallery', ImageGallery)
    app.component('ContactFloat', ContactFloat)
  }
}
```

## 样式定制

所有组件使用 VitePress CSS 变量，支持主题切换：

```css
/* 常用变量 */
--vp-c-brand-1         /* 品牌主色 */
--vp-c-brand-soft      /* 品牌浅色背景 */
--vp-c-text-1          /* 主要文本颜色 */
--vp-c-text-2          /* 次要文本颜色 */
--vp-c-bg-soft         /* 浅色背景 */
--vp-c-divider         /* 分割线颜色 */
```

### 自定义样式

在 `.vitepress/theme/styles/custom.css` 中覆盖：

```css
.demo-card {
  /* 自定义卡片样式 */
}

.version-tabs__tab {
  /* 自定义版本标签样式 */
}
```

## 添加新组件

### 步骤

1. 创建组件文件：`.vitepress/theme/components/MyComponent.vue`
2. 在 `.vitepress/theme/index.ts` 中注册：
   ```typescript
   import MyComponent from './components/MyComponent.vue'

   app.component('MyComponent', MyComponent)
   ```
3. 在 Markdown 中使用：
   ```vue
   <MyComponent :prop="value" />
   ```

### 最佳实践

- 使用 `<script setup>` + TypeScript
- 使用 VitePress CSS 变量保持主题一致性
- 添加 Props 类型定义
- 支持响应式设计
- 考虑深色模式兼容性
