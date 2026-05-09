<div align="center">

# Job Tracker

**专为大学生求职季打造的看板式申请管理工具**

**Kanban-style job application management for university students.**

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[中文](#功能特性) · [English](#features)

</div>

---

## 预览 / Preview

![screenshot](docs/screenshot.png)

---

## 功能特性

| 分类 | 说明 |
|------|------|
| **看板管理** | 6 阶段流水线（待投递 → 已投递 → 笔试 → 面试中 → 已录用 / 已拒绝）+ 暂存区 |
| **拖拽交互** | 卡片拖拽即改状态，基于 `@dnd-kit` 实现 |
| **智能识别** | 粘贴招聘信息文本，自动提取岗位名、工作地点、职责描述、任职要求 |
| **公司联想** | 预置 30+ 互联网公司，输入即模糊搜索 |
| **截止提醒** | 3 天内黄色预警，过期红色标记 |
| **全文搜索** | 支持公司、岗位、地点、备注多字段检索 |
| **数据导出/导入** | JSON 一键备份恢复，不怕清缓存丢数据 |
| **纯本地运行** | 无需后端，数据存浏览器 LocalStorage，debounce 写入优化性能 |

---

## Features

| Category | Details |
|----------|---------|
| **Kanban Board** | 6-stage pipeline (To Apply → Applied → Written Test → Interview → Offer / Rejected) + Inbox column |
| **Drag & Drop** | Move cards between columns with automatic status sync, powered by `@dnd-kit` |
| **Smart Paste** | Paste raw job posting text and auto-extract position, location, description, and requirements |
| **Company Autocomplete** | 30+ pre-loaded Chinese tech companies with fuzzy search |
| **Deadline Alerts** | Yellow warning within 3 days, red badge when expired |
| **Full-text Search** | Filter by company, position, location, or notes |
| **Data Export/Import** | One-click JSON backup and restore |
| **Offline-first** | All data persisted in LocalStorage with debounced writes |

---

## 技术栈 / Tech Stack

| 层级 / Layer | 技术 / Technology |
|------|------|
| 框架 / Framework | React 19 + TypeScript 6 |
| 构建 / Build | Vite 8 |
| 拖拽 / Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| 样式 / Styling | CSS Modules |
| 持久化 / Persistence | LocalStorage（防抖写入） |

---

## 快速开始 / Getting Started

### 环境要求 / Prerequisites

- Node.js >= 18
- npm >= 9

### 安装运行 / Install & Run

```bash
git clone https://github.com/hxhfuudd-ship-it/job-tracker.git
cd job-tracker
npm install
npm run dev
```

浏览器打开 / Open http://localhost:5173

### 生产构建 / Build for Production

```bash
npm run build
npm run preview
```

---

## 项目结构 / Project Structure

```
src/
├── App.tsx                     # 根组件 / Root component
├── types.ts                    # 类型定义 / TypeScript interfaces
├── constants.ts                # 列配置 / Column config & presets
├── hooks/
│   └── useLocalStorage.ts      # 防抖存储 / Debounced localStorage hook
└── components/
    ├── Board/                  # DnD 上下文 / DnD context & layout
    ├── Column/                 # 可放置列 / Droppable column
    ├── Card/                   # 可排序卡片 / Sortable card
    ├── Modal/                  # 表单+智能识别 / Form + smart paste
    ├── Stats/                  # 统计栏 / Pipeline statistics
    └── SearchBar/              # 搜索 / Search input
```

---

## 规划中 / Roadmap

- [ ] 暗色模式 / Dark mode
- [ ] 日历视图 / Calendar view for deadlines
- [ ] 浏览器插件一键抓取 / Browser extension for one-click capture
- [ ] 云端同步 / Cloud sync (optional backend)
- [ ] 简历匹配度评分 / Resume matching score

---

## 参与贡献 / Contributing

欢迎贡献！请先开 Issue 讨论。

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork 本仓库 / Fork the repo
2. 创建分支 / Create your branch (`git checkout -b feat/amazing-feature`)
3. 提交改动 / Commit your changes
4. 推送分支 / Push to the branch
5. 发起 PR / Open a Pull Request

---

## 许可证 / License

[MIT](./LICENSE)

---

<div align="center">
<sub>基于 React + TypeScript 构建，为中国求职市场设计。</sub>
<br>
<sub>Built with React + TypeScript. Designed for the Chinese job market.</sub>
</div>
