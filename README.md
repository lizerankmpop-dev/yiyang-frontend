# 颐养中心管理系统 · 前端

[![Deploy to GitHub Pages](https://github.com/lizerankmpop-dev/yiyang-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/lizerankmpop-dev/yiyang-frontend/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

基于 Vue 3 + Element Plus + Vite 的养老院管理系统前端，对接 [yiyang-backend](https://github.com/lizerankmpop-dev/yiyang-backend) 提供的 RESTful API。覆盖老人档案、床位、护理、餐饮、排班、数据看板与系统管理等业务场景。

> 🔗 **在线演示**：<https://lizerankmpop-dev.github.io/yiyang-frontend/>
> （静态页面可直接浏览 UI；涉及数据的操作需本地启动后端才能生效）

## 技术栈

| 组件 | 版本 | 用途 |
|---|---|---|
| Vue | 3.4 | 前端框架 |
| Vite | 4.5 | 构建工具 |
| Element Plus | 2.14 | UI 组件库 |
| Pinia | 2.1 | 状态管理 |
| Vue Router | 4.3 | 路由与权限守卫 |
| ECharts | 5.5 | 统计图表 |
| axios | 1.16 | HTTP 请求 |
| dayjs | 1.11 | 日期处理 |

## 功能模块

| 模块 | 页面目录 |
|---|---|
| 登录与用户 | `views/login` `views/user` |
| 首页看板 | `views/dashboard` `views/statistics` |
| 老人档案 | `views/customer` |
| 入住 / 退住 / 外出 | `views/checkin` `views/checkout` `views/backdown` `views/outward` |
| 床位管理 | `views/bed` |
| 护理管理 | `views/nurse` `views/health` `views/schedule` |
| 餐饮管理 | `views/meal` |
| 系统管理 | `views/admin` `views/role` |

## 部署

仓库已配置 GitHub Actions 自动部署到 GitHub Pages（见 `.github/workflows/deploy.yml`）：

1. `npm ci` 安装依赖
2. 以 `BASE_PATH=/yiyang-frontend/` 执行 `vite build`
3. 将 `dist/` 发布到 Pages，并生成 `404.html` 支持 SPA 路由回退

推送到 `main` 分支即自动触发部署。

## 快速开始

### 环境要求

- Node.js 18+
- 后端服务已在本机 `8081` 端口运行（见 [yiyang-backend](https://github.com/lizerankmpop-dev/yiyang-backend)）

### 安装与启动

```bash
npm install
npm run dev
```

开发服务器：http://localhost:5173

开发环境下 Vite 会把 `/api` 代理到 `http://localhost:8081`（配置见 `vite.config.js`），因此无需处理跨域。

### 构建

```bash
npm run build     # 产物输出到 dist/
npm run preview   # 本地预览构建产物
```

### 后端地址配置

| 文件 | 变量 | 说明 |
|---|---|---|
| `.env.development` | `VITE_API_BASE_URL=/api` | 走 Vite 代理 |
| `.env.production` | `VITE_API_BASE_URL=...` | 改为你的后端地址后再构建 |

> 注意：如需部署到子路径（例如 GitHub Pages 的 `/仓库名/`），构建时请指定 base：`npx vite build --base=/仓库名/`。

## 目录结构

```
src/
├── api/          各业务模块 API 封装（axios 实例见 utils/request.js）
├── components/   通用组件
├── router/       路由表与权限守卫
├── stores/       Pinia 状态（用户登录态）
├── user/         用户相关资源
├── utils/        请求封装、工具函数
├── views/        16 个业务页面模块
├── App.vue
└── main.js       应用入口
```

## License

[MIT](LICENSE)
