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
| **包管理** | pnpm |
| **运行时** | Node.js |

### 核心业务流程

```text
Demo 分类 → Demo 列表 → Demo 模版（可多个） → Demo 展示页
```

| 层级       | 说明                   | 路径示例                   |
|------------|------------------------|----------------------------|
| **分类页** | 按类别浏览所有 Demo   | `/demos/`                  |
| **列表页** | 某分类下的 Demo 列表   | `/demos/charts/`           |
| **模版选择** | 一个 Demo 可有多个模版 | `/demos/charts/bar/`       |
| **展示页** | 最终 Demo 运行与预览   | `/demos/charts/bar/basic`  |

---

## P2. 常用命令

```bash
# 安装依赖
pnpm install

# 本地开发
pnpm vitepress dev

# 构建产物
pnpm vitepress build

# 预览构建
pnpm vitepress preview
```

---

## P3. 目录结构

```text
.
├── .claude/              # Claude Code 配置
├── .vitepress/           # VitePress 配置与主题
│   ├── config.ts         # 站点配置
│   └── theme/            # 自定义主题与组件
│       ├── index.ts      # 主题入口
│       ├── components/   # 全局组件
│       └── styles/       # 全局样式
├── demos/                # Demo 内容（核心目录）
│   └── [category]/       # 分类目录
│       └── [demo]/       # 单个 Demo
│           ├── index.md  # Demo 说明
│           └── [tpl].vue # 模版文件（可多个）
├── public/               # 静态资源
├── package.json          # 项目配置
└── pnpm-lock.yaml        # 锁文件
```

规则：

1. Demo 内容统一放在 `demos/[category]/[demo]/` 下。
2. 一个 Demo 可包含多个 `.vue` 模版文件，每个模版对应一个展示页。
3. VitePress 配置统一在 `.vitepress/config.ts`。
4. 自定义 Vue 组件放在 `.vitepress/theme/components/`。
5. 静态资源（图片等）放在 `public/`。
6. 禁止在 `node_modules/` 中修改任何文件。

---

## P4. 文档编写规范

| 规则 | 说明 |
|------|------|
| ✅ 编码 | UTF-8 |
| ✅ 语言 | 中文编写文档内容 |
| ✅ 格式 | Markdown（CommonMark + GFM 扩展） |
| ❌ 禁止 | 拼音命名文件、空内容页面 |

---

## P5. 代码规范

| 规则 | 说明 |
|------|------|
| ✅ 配置文件 | 使用 TypeScript（`.ts`） |
| ✅ Vue 组件 | 使用 `<script setup>` + Composition API |
| ✅ 样式 | 优先使用 CSS 变量，兼容 VitePress 主题 |
| ❌ 禁止 | 在文档 Markdown 中写复杂业务逻辑 |

---

## P6. 输出约束

1. 输出**可直接运行的完整代码**。
2. 不得省略关键配置或随意创建冗余文件。
3. 新增页面必须同步更新导航/侧边栏配置。
4. 所有解释说明使用中文，代码标识符使用英文。
