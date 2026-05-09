<div align="center">

# Job Tracker

**Kanban-style job application management for Chinese university students.**

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[English](#features) · [中文](#功能特性)

</div>

---

## Demo

```
┌──────────┬──────────┬──────────┐  ┌────────┐
│  待投递   │  已投递   │   笔试    │  │ 暂存区  │
│ ┌──────┐ │ ┌──────┐ │          │  │┌──────┐│
│ │字节   │ │ │美团   │ │          │  ││ 新卡片││
│ │AI工程 │ │ │产品   │ │          │  │└──────┘│
│ └──────┘ │ └──────┘ │          │  │        │
├──────────┼──────────┼──────────┤  │        │
│  面试中   │  已录用   │  已拒绝   │  │        │
└──────────┴──────────┴──────────┘  └────────┘
```

> Replace with a real screenshot: place it at `docs/screenshot.png` and uncomment below.
<!-- ![screenshot](docs/screenshot.png) -->

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

## 功能特性

- **看板管理** — 6 阶段流水线 + 暂存区，拖拽即改状态
- **智能识别** — 粘贴招聘信息自动提取岗位、地点、职责、要求
- **公司联想** — 预置 30+ 互联网公司，输入即搜索
- **截止提醒** — 3 天内黄色预警，过期红色标记
- **全文搜索** — 支持公司、岗位、地点、备注多字段检索
- **数据导出/导入** — JSON 一键备份恢复，不怕丢数据
- **纯本地运行** — 无需后端，数据存浏览器 LocalStorage

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Styling | CSS Modules |
| Persistence | LocalStorage (debounced) |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install & Run

```bash
git clone https://github.com/hxhfuudd-ship-it/job-tracker.git
cd job-tracker
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── App.tsx                     # Root component, global state
├── types.ts                    # TypeScript interfaces
├── constants.ts                # Column config, company presets
├── hooks/
│   └── useLocalStorage.ts      # Debounced localStorage hook
└── components/
    ├── Board/                  # DnD context, column layout
    ├── Column/                 # Droppable column
    ├── Card/                   # Sortable application card
    ├── Modal/                  # Add/Edit form + smart paste
    ├── Stats/                  # Pipeline statistics
    └── SearchBar/              # Search input
```

---

## Roadmap

- [ ] Dark mode
- [ ] Calendar view for deadlines
- [ ] Browser extension for one-click capture from job sites
- [ ] Cloud sync (optional backend)
- [ ] Resume matching score

---

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

[MIT](./LICENSE)

---

<div align="center">
<sub>Built with React + TypeScript. Designed for the Chinese job market.</sub>
</div>
