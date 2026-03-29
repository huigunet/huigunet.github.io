# 配置文件详解

CodeView 使用 YAML 格式的配置文件，分为四个层级。

## 1. 站点配置 (site.config.yml)

位置：`项目根目录/site.config.yml`

```yaml
# 站点基本信息
title: 演示DEMO
description: 源码演示站点展示平台
tagline: 浏览源码项目、查看在线演示、快速体验各版本功能

# 联系方式（可选）
contact:
  telegram: huigunet
  email: example@example.com
  wechat: username
  qq: 123456789
  github: username
  twitter: username

# 客服配置（可选）
service:
  url: https://t.me/huigunet
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 否 | 站点标题，默认 "CodeView" |
| `description` | string | 否 | 站点描述，显示在首页 hero 区域 |
| `tagline` | string | 否 | 标语，显示在描述下方 |
| `contact` | object | 否 | 联系方式，显示在页脚 |
| `service.url` | string | 否 | 客服链接，ContactFloat 组件使用 |

### contact 支持的平台

- `telegram`: Telegram 用户名（自动生成 t.me 链接）
- `email`: 邮箱地址（自动生成 mailto 链接）
- `wechat`: 微信号
- `qq`: QQ 号（自动生成聊天链接）
- `github`: GitHub 用户名
- `twitter`: Twitter/X 用户名
- 其他自定义字段：直接作为 URL 使用

---

## 2. 分类配置

位置：`demos/[category]/config.yml`

```yaml
title: 刷单系列
icon: 📱
desc: 移动端与工具类应用源码展示
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 分类显示名称 |
| `icon` | string | 否 | 分类图标（Emoji 或图片 URL） |
| `desc` | string | 否 | 分类描述 |

### 图标配置

支持两种方式：

1. **Emoji 图标**
   ```yaml
   icon: 📱
   ```

2. **图片 Logo**

   在分类目录下放置以下文件之一：
   - `logo.png`
   - `logo.svg`
   - `logo.webp`
   - `logo.jpg`

   系统会自动检测并优先使用 logo 图片。

---

## 3. 项目配置

位置：`demos/[category]/[project]/config.yml`

```yaml
title: TK商城刷单
desc: 即时通讯应用，支持单聊、群聊、文件传输
tags:
  - Node.js
  - WebSocket
  - Vue
  - 即时通讯
repo: https://github.com/kaadon/chat-app
versions:
  - name: v1.0
    title: TK商城刷单
    latest: true
  - name: v0.9
    title: Beta 版本
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 项目名称 |
| `desc` | string | 否 | 项目描述 |
| `tags` | string[] | 否 | 技术标签列表 |
| `repo` | string | 否 | 源码仓库地址 |
| `versions` | VersionRef[] | 自动 | 版本列表（系统自动维护） |

### versions 数组（VersionRef）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 版本目录名称（如 v1.0） |
| `title` | string | 否 | 版本显示名称，不填则使用 name |
| `latest` | boolean | 自动 | 是否为最新版本（系统自动标记） |

**重要提示：**

1. `versions` 数组会被系统自动管理：
   - 系统扫描项目目录下的子目录
   - 自动添加新版本
   - 自动删除已不存在的版本
   - 自动标记最新版本 (`latest: true`)

2. 手动添加 `title` 字段：
   ```yaml
   versions:
     - name: v1.0
       title: 正式版 1.0  # 可选：自定义显示名称
   ```

3. 版本排序规则：按语义化版本号降序排列

---

## 4. 版本配置

位置：`demos/[category]/[project]/[version]/config.yml`

```yaml
version: v1.0
title: 刷单模版1
date: 2025-02-20

# 演示站点配置
demo:
  - platform: pc
    url: https://demo.example.com
    username: demo
    password: demo123
    note: 管理后台

  - platform: mobile
    url: https://m.demo.example.com
    qr: true
    note: 移动端 H5

  - platform: agent
    url: https://agent.example.com
    username: agent01
    password: agent123

# 截图平台列表（自动扫描）
screenshots:
  - pc
  - mobile
  - admin

# 图片映射（自动生成）
images:
  pc:
    - /demos/app/chat-app/v1.0/images/pc/home.webp
    - /demos/app/chat-app/v1.0/images/pc/chat.webp
  mobile:
    - /demos/app/chat-app/v1.0/images/mobile/list.webp
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `version` | string | 否 | 版本号（通常与目录名一致） |
| `title` | string | 否 | 版本标题，用于页面标题和版本标签 |
| `date` | string | 否 | 发布日期（YYYY-MM-DD） |
| `demo` | DemoConfig[] | 否 | 演示站点列表 |
| `screenshots` | string[] | 自动 | 截图平台列表（系统自动扫描） |
| `images` | object | 自动 | 平台 → 图片 URL 映射（系统自动生成） |

### demo 配置（DemoConfig）

每个演示站点支持以下字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `platform` | string | 是 | 平台标识（pc/mobile/admin/agent 等） |
| `url` | string | 是 | 演示站点 URL |
| `username` | string | 否 | 登录用户名 |
| `password` | string | 否 | 登录密码 |
| `qr` | boolean | 否 | 是否显示二维码（默认 false） |
| `note` | string | 否 | 备注说明 |

**platform 常用值：**

| 值 | 图标 | 说明 |
|----|------|------|
| `pc` | 💻 | PC 端 / 管理后台 |
| `mobile` | 📱 | 移动端 H5 / APP |
| `admin` | 🔧 | 管理后台 |
| `agent` | 👤 | 代理后台 |
| `api` | 🔌 | API 文档 |

### screenshots 自动扫描

系统会扫描 `images/` 目录下的子目录：

```
v1.0/
  ├── config.yml
  └── images/
      ├── pc/           → 自动添加 "pc" 到 screenshots
      │   ├── home.webp
      │   └── chat.webp
      ├── mobile/       → 自动添加 "mobile" 到 screenshots
      │   └── list.webp
      └── admin/        → 自动添加 "admin" 到 screenshots
          └── dashboard.webp
```

**结果：**

```yaml
screenshots:
  - pc
  - mobile
  - admin
```

### images 自动生成

基于 `images/` 目录结构，系统自动生成完整的图片 URL 映射，供 `ImageGallery` 组件使用。

---

## 配置最佳实践

### 1. 目录结构示例

```
demos/
├── app/                          # 分类
│   ├── config.yml                # 分类配置
│   ├── logo.png                  # 分类 Logo（可选）
│   └── chat-app/                 # 项目
│       ├── config.yml            # 项目配置
│       ├── v1.0/                 # 版本
│       │   ├── config.yml        # 版本配置
│       │   ├── intro.md          # 版本介绍（可选）
│       │   └── images/           # 截图目录
│       │       ├── pc/
│       │       │   ├── 01-home.png
│       │       │   └── 02-chat.png
│       │       └── mobile/
│       │           └── 01-list.png
│       └── v0.9/
│           └── config.yml
└── web/
    ├── config.yml
    └── blog/
        └── config.yml
```

### 2. 命名规范

- **分类目录**: 使用英文小写 + 连字符（如 `app`, `web-tools`）
- **项目目录**: 使用英文小写 + 连字符（如 `chat-app`, `admin-panel`）
- **版本目录**: 使用 `v` 前缀 + 版本号（如 `v1.0`, `v2.1.3`）
- **截图平台**: 使用英文小写（如 `pc`, `mobile`, `admin`）
- **截图文件**: 使用数字前缀 + 描述（如 `01-home.png`, `02-chat.png`）

### 3. 图片优化

**建议：**

- 截图统一使用 **1920x1080** (PC) 或 **750x1334** (Mobile) 分辨率
- 文件格式：PNG 或 JPG（构建时自动转换为 WebP）
- 文件大小：单张不超过 500KB

**自动压缩：**

```bash
# 构建时自动执行
pnpm build
# → scripts/compress-images.sh 会将所有图片转换为 WebP（质量 80）
```

### 4. 版本管理

**推荐工作流：**

1. 创建新版本目录：`mkdir demos/app/chat-app/v1.1`
2. 添加版本配置：`touch demos/app/chat-app/v1.1/config.yml`
3. 上传截图到：`demos/app/chat-app/v1.1/images/[platform]/`
4. 运行构建：`pnpm build`
5. 系统自动更新项目配置中的 `versions` 数组

**无需手动编辑 `versions` 数组！**

---

## 配置验证

### 常见问题

#### 1. 版本未显示

**原因**：版本目录下缺少 `config.yml`

**解决**：
```bash
touch demos/app/chat-app/v1.0/config.yml
```

最小化配置：
```yaml
version: v1.0
```

#### 2. 截图未显示

**原因**：图片目录结构不正确

**正确结构**：
```
v1.0/
  └── images/
      └── pc/              # ← 平台目录
          └── 01-home.webp # ← 图片文件
```

**错误示例**：
```
v1.0/
  └── images/
      └── 01-home.webp    # ✗ 缺少平台子目录
```

#### 3. 演示站点不显示

**原因**：`demo` 配置格式错误

**正确配置**：
```yaml
demo:
  - platform: pc        # ← 使用数组格式
    url: https://...
```

**错误示例**：
```yaml
demo:
  platform: pc          # ✗ 直接使用对象
  url: https://...
```

---

## TypeScript 类型定义

完整类型定义位于 `.vitepress/utils/shared.ts`：

```typescript
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
```
