# Demo 内容组织规范

本文档详细说明如何组织 Demo 项目的目录结构和文件。

## 完整目录结构

```
demos/
├── [category]/               # 分类目录
│   ├── config.yml            # 分类配置
│   ├── logo.png              # 分类 Logo（可选）
│   └── [project]/            # 项目目录
│       ├── config.yml        # 项目配置
│       ├── [version]/        # 版本目录
│       │   ├── config.yml    # 版本配置
│       │   ├── intro.md      # 版本介绍（可选）
│       │   └── images/       # 截图目录
│       │       ├── [platform]/  # 平台子目录
│       │       │   ├── 01-xxx.webp
│       │       │   └── 02-xxx.webp
│       │       └── [platform2]/
│       │           └── 01-xxx.webp
│       └── [version2]/
│           └── ...
└── [category2]/
    └── ...
```

---

## 分类 (Category)

### 目录命名

- **格式**：英文小写 + 连字符
- **示例**：`app`, `web`, `web-tools`, `admin-panel`
- **避免**：中文、空格、特殊字符

### 必需文件

#### config.yml

```yaml
title: 刷单系列
icon: 📱
desc: 移动端与工具类应用源码展示
```

### 可选文件

#### logo.png / logo.svg / logo.webp / logo.jpg

分类的 Logo 图片，优先于 `icon` 显示。

**规格建议：**
- 尺寸：256x256px 或 512x512px
- 格式：PNG（透明背景）或 SVG
- 大小：< 50KB

---

## 项目 (Project)

### 目录命名

- **格式**：英文小写 + 连字符
- **示例**：`chat-app`, `blog-system`, `admin-dashboard`
- **避免**：中文、空格、版本号

### 必需文件

#### config.yml

```yaml
title: TK商城刷单
desc: 即时通讯应用，支持单聊、群聊、文件传输
tags:
  - Node.js
  - WebSocket
  - Vue
  - 即时通讯
repo: https://github.com/username/repo
versions:
  - name: v1.0
    title: 正式版 1.0
    latest: true
  - name: v0.9
    title: Beta 测试版
```

**字段说明：**

| 字段 | 说明 | 示例 |
|------|------|------|
| `title` | 项目名称（必填） | `TK商城刷单` |
| `desc` | 项目描述 | `即时通讯应用，支持...` |
| `tags` | 技术标签（数组） | `['Node.js', 'Vue']` |
| `repo` | 源码仓库地址 | `https://github.com/...` |
| `versions` | 版本列表（**系统自动维护**） | 见下文 |

**重要：** `versions` 数组由系统自动管理，只需手动添加 `title` 字段。

---

## 版本 (Version)

### 目录命名

- **格式**：`v` + 版本号
- **示例**：`v1.0`, `v1.2.3`, `v2.0-beta`
- **避免**：无 `v` 前缀、中文描述

### 语义化版本

推荐使用语义化版本号（Semantic Versioning）：

```
v主版本号.次版本号.修订号[-预发布标识]

示例：
v1.0.0       - 正式版
v1.1.0       - 新增功能
v1.1.1       - 修复 Bug
v2.0.0-beta  - 测试版
v2.0.0-rc.1  - 候选版本
```

### 必需文件

#### config.yml

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
    note: 移动端 H5（扫码访问）

  - platform: agent
    url: https://agent.example.com
    username: agent01
    password: agent123

# 截图平台列表（系统自动扫描）
screenshots:
  - pc
  - mobile
  - admin
```

**字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `version` | string | 版本号（与目录名一致） |
| `title` | string | 版本显示名称 |
| `date` | string | 发布日期（YYYY-MM-DD） |
| `demo` | array | 演示站点列表 |
| `screenshots` | array | **系统自动生成**，无需手动编辑 |
| `images` | object | **系统自动生成**，无需手动编辑 |

### 可选文件

#### intro.md

版本的详细介绍，会自动嵌入到版本页面中。

```markdown
## 功能特性

- 支持实时消息推送
- 支持文件传输（最大 100MB）
- 支持群聊和私聊
- 支持消息已读状态

## 技术架构

- 前端：Vue 3 + TypeScript
- 后端：Node.js + WebSocket
- 数据库：MongoDB

## 更新日志

### v1.0.0 (2025-02-20)

- 首次发布
- 实现核心聊天功能
```

---

## 截图目录结构

### 标准结构

```
v1.0/images/
├── pc/              # PC 端截图
│   ├── 01-home.webp
│   ├── 02-chat.webp
│   ├── 03-settings.webp
│   └── 04-profile.webp
├── mobile/          # 移动端截图
│   ├── 01-list.webp
│   ├── 02-detail.webp
│   └── 03-profile.webp
└── admin/           # 管理后台截图
    ├── 01-dashboard.webp
    ├── 02-users.webp
    └── 03-settings.webp
```

### 平台子目录命名

| 名称 | 用途 | 说明 |
|------|------|------|
| `pc` | PC 端 / 网页版 | 桌面浏览器截图 |
| `mobile` | 移动端 H5 | 手机浏览器截图 |
| `admin` | 管理后台 | 后台管理系统 |
| `agent` | 代理后台 | 代理商管理系统 |
| `app-ios` | iOS APP | iPhone 截图 |
| `app-android` | Android APP | Android 手机截图 |
| `api` | API 文档 | Swagger/Postman 截图 |

**自定义平台：** 可使用任意英文名称，系统会自动识别。

### 截图文件命名

**推荐格式：** `序号-描述.webp`

- **序号**：两位数字（01, 02, 03...），控制显示顺序
- **描述**：英文或拼音，简短描述功能
- **扩展名**：`.webp`（构建时自动转换）

**示例：**

```
01-home.webp          # 首页
02-login.webp         # 登录页
03-dashboard.webp     # 仪表盘
04-chat-list.webp     # 聊天列表
05-chat-detail.webp   # 聊天详情
06-user-profile.webp  # 用户资料
07-settings.webp      # 设置页
```

### 截图规格

#### PC 端

- **分辨率**：1920x1080 或 1440x900
- **格式**：PNG 或 JPG（自动转 WebP）
- **大小**：每张 < 500KB

#### 移动端

- **分辨率**：750x1334（iPhone 8） 或 1080x1920（Android）
- **格式**：PNG 或 JPG（自动转 WebP）
- **大小**：每张 < 300KB

#### 截图工具

**macOS:**
- 截图快捷键：`Cmd + Shift + 4`
- 浏览器开发者工具：`Cmd + Opt + I` → 设备模拟

**Windows:**
- 截图工具：`Win + Shift + S`
- 浏览器开发者工具：`F12` → 设备模拟

**Chrome 插件:**
- Awesome Screenshot
- Full Page Screen Capture

---

## 演示站点配置

### 基本配置

```yaml
demo:
  - platform: pc
    url: https://demo.example.com
    username: demo
    password: demo123
    note: 管理后台
```

### 完整配置示例

```yaml
demo:
  # PC 端 - 带账号密码
  - platform: pc
    url: https://admin.example.com
    username: admin
    password: admin123
    note: 管理后台（请勿修改密码）

  # 移动端 - 二维码访问
  - platform: mobile
    url: https://m.example.com
    qr: true
    note: 扫码体验移动端 H5

  # 代理端 - 多个账号
  - platform: agent
    url: https://agent.example.com
    username: agent01
    password: agent123
    note: 代理商账号 1

  - platform: agent
    url: https://agent.example.com
    username: agent02
    password: agent456
    note: 代理商账号 2

  # API 文档
  - platform: api
    url: https://api.example.com/docs
    note: Swagger API 文档
```

### Platform 图标

系统会根据 `platform` 值自动显示图标：

| platform | 图标 | 说明 |
|----------|------|------|
| `pc` | 💻 | PC 端 |
| `mobile` | 📱 | 移动端 |
| `admin` | 🔧 | 管理后台 |
| `agent` | 👤 | 代理后台 |
| `api` | 🔌 | API 文档 |
| `h5` | 📱 | H5 页面 |
| `app` | 📲 | 原生 APP |
| 其他 | 🌐 | 默认 |

---

## 完整示例

### 示例：聊天应用

```
demos/app/chat-app/
├── config.yml
├── v1.0/
│   ├── config.yml
│   ├── intro.md
│   └── images/
│       ├── pc/
│       │   ├── 01-login.webp
│       │   ├── 02-chat-list.webp
│       │   ├── 03-chat-detail.webp
│       │   └── 04-settings.webp
│       ├── mobile/
│       │   ├── 01-login.webp
│       │   ├── 02-chat-list.webp
│       │   └── 03-chat-detail.webp
│       └── admin/
│           ├── 01-dashboard.webp
│           ├── 02-users.webp
│           └── 03-messages.webp
└── v0.9/
    ├── config.yml
    └── images/
        └── pc/
            ├── 01-login.webp
            └── 02-chat.webp
```

#### demos/app/config.yml

```yaml
title: 刷单系列
icon: 📱
desc: 移动端与工具类应用源码展示
```

#### demos/app/chat-app/config.yml

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
    title: 正式版 1.0
    latest: true
  - name: v0.9
    title: Beta 测试版
```

#### demos/app/chat-app/v1.0/config.yml

```yaml
version: v1.0
title: TK商城刷单 v1.0
date: 2025-02-20

demo:
  - platform: pc
    url: https://chat.example.com
    username: demo
    password: demo123
    note: 网页版（支持所有功能）

  - platform: mobile
    url: https://m.chat.example.com
    qr: true
    note: 移动端 H5

  - platform: admin
    url: https://admin.chat.example.com
    username: admin
    password: admin123
    note: 管理后台

screenshots:
  - pc
  - mobile
  - admin
```

#### demos/app/chat-app/v1.0/intro.md

```markdown
## 核心功能

- ✅ 实时消息推送
- ✅ 单聊与群聊
- ✅ 文件传输（最大 100MB）
- ✅ 消息已读状态
- ✅ 消息撤回（2 分钟内）
- ✅ @提及功能
- ✅ 表情包支持

## 技术架构

- **前端**：Vue 3 + TypeScript + Vite
- **后端**：Node.js + Express + Socket.IO
- **数据库**：MongoDB + Redis
- **部署**：Docker + Nginx

## 更新日志

### v1.0.0 (2025-02-20)

**新功能：**
- 首次正式发布
- 实现核心聊天功能
- 支持多平台（PC/Mobile/Admin）

**优化：**
- 消息加载速度提升 50%
- 优化图片上传体验

**修复：**
- 修复群聊消息顺序错乱问题
- 修复文件下载失败的 Bug
```

---

## 工作流程

### 添加新 Demo

#### 1. 创建目录结构

```bash
# 创建项目目录
mkdir -p demos/app/my-project/v1.0/images/{pc,mobile}

# 创建配置文件
touch demos/app/my-project/config.yml
touch demos/app/my-project/v1.0/config.yml
```

#### 2. 编写配置文件

参考上方示例，填写项目和版本配置。

#### 3. 添加截图

```bash
# 上传截图到对应平台目录
cp screenshots/pc/*.png demos/app/my-project/v1.0/images/pc/
cp screenshots/mobile/*.png demos/app/my-project/v1.0/images/mobile/
```

#### 4. 运行构建

```bash
# 开发模式（实时预览）
pnpm dev

# 生产构建
pnpm build
```

系统会自动：
- 检测新项目和版本
- 更新 `versions` 数组
- 扫描截图目录，生成 `screenshots` 和 `images`
- 生成所有页面

### 添加新版本

#### 1. 创建版本目录

```bash
mkdir -p demos/app/my-project/v1.1/images/pc
```

#### 2. 添加版本配置

```bash
touch demos/app/my-project/v1.1/config.yml
```

```yaml
version: v1.1
title: 新版本 1.1
date: 2025-03-01
demo:
  - platform: pc
    url: https://demo.example.com
```

#### 3. 上传截图并构建

```bash
cp screenshots/*.png demos/app/my-project/v1.1/images/pc/
pnpm build
```

系统会自动：
- 将 `v1.1` 添加到项目的 `versions` 数组
- 标记 `v1.1` 为 `latest: true`
- 移除旧版本的 `latest` 标记
- 更新导航和侧边栏

---

## 最佳实践

### 1. 目录命名

✅ **推荐：**
- `chat-app`
- `admin-panel`
- `blog-system`

❌ **避免：**
- `ChatApp`（大写）
- `chat_app`（下划线）
- `聊天应用`（中文）
- `chat-app-v1`（包含版本号）

### 2. 版本管理

✅ **推荐：**
- `v1.0`, `v1.1`, `v2.0`（语义化版本）
- `v2.0-beta`, `v2.0-rc.1`（预发布标识）

❌ **避免：**
- `1.0`（缺少 v 前缀）
- `version1`（英文描述）
- `最新版`（中文）

### 3. 截图组织

✅ **推荐：**
- 按平台分目录（`pc/`, `mobile/`, `admin/`）
- 使用数字前缀控制顺序（`01-`, `02-`）
- 文件名简短清晰（`01-home.webp`）

❌ **避免：**
- 所有截图放在 `images/` 根目录
- 随机命名（`IMG_1234.png`）
- 中文文件名（`首页.png`）

### 4. 配置文件

✅ **推荐：**
- 使用 YAML 格式
- UTF-8 编码
- 2 空格缩进
- 完整填写 `title` 和 `desc`

❌ **避免：**
- 使用 Tab 缩进
- 字段值为空（`title: `）
- 手动编辑 `versions` 数组（系统自动管理）

---

## 常见问题

### 1. 版本未显示在侧边栏

**原因：** 版本目录下缺少 `config.yml`

**解决：**
```bash
touch demos/app/my-project/v1.0/config.yml
```

最小化配置：
```yaml
version: v1.0
```

### 2. 截图未显示

**原因：** 图片目录结构错误

**正确：**
```
v1.0/images/pc/01-home.webp
```

**错误：**
```
v1.0/images/01-home.webp  # 缺少平台子目录
```

### 3. 最新版本标记错误

**原因：** 系统根据语义化版本自动标记

**解决：** 无需手动修改，系统会自动将版本号最高的版本标记为 `latest: true`。

### 4. 演示站点不显示

**原因：** `demo` 配置格式错误

**正确：**
```yaml
demo:
  - platform: pc
    url: https://...
```

**错误：**
```yaml
demo:
  platform: pc  # 缺少数组格式
  url: https://...
```
