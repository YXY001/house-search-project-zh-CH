# 找房地图 (House Search Map) ｜ 找寻心仪的家

![Product Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Tech Stack](https://img.shields.io/badge/Tech-React%20%2B%20Vite%20%2B%20Leaflet-green)

## 📍 产品愿景 (Product Vision)
**“让看房回归直觉。”** 
传统的列表式找房系统往往让用户迷失在文字描述和模糊的地理位置中。本项目旨在通过**地图交互**为核心，将房源真实地理分布、周边配套、价格梯度直观整合，帮助北漂一族（首期聚焦北京朝阳区）更高效、更直观地找到心仪的租住空间。

---

## ✨ 核心价值主张 (Value Propositions)

### 1. 地图驱动的沉浸式搜索 (Map-Centric Search)
*   **空间感知**：基于 Leaflet 的交互式地图，一眼看清房源与地铁站（如 6 号线常营站）、商圈的距离。
*   **价格气泡**：直接在地图标注展示租金价格，无需点击即可对比区域房价分布。
*   **高德/WGS84 坐标自适应**：精准的火星坐标转换逻辑，解决地图偏移痛点。

### 2. 用户分层筛选 (User-Focused Filtering)
*   **房源性质去敏**：一键切换“个人房源”与“中介房源”，满足不同预算和社交需求的用户。
*   **联系人快筛**：针对活跃房东/中介建立快筛标签，提高沟通效率。

### 3. 至雅的交互体验 (Premium UX/UI)
*   **Mobile-First 设计**：深度优化移动端交互，底部抽屉式详情页 (Bottom Sheet) 兼容主流手机操作逻辑。
*   **全明视觉**：基于 Inter 字体与 Lucide 图标集，打造现代、简约、专业的工具感界面。
*   **多维度详情**：包含高清图片滚动手册、户型信息、区域优势描述。

---

## 🛠️ 技术底座 (Tech Stack)

*   **前端框架**：[React 18](https://reactjs.org/) + [Hooks](https://reactjs.org/docs/hooks-intro.html)
*   **构建工具**：[Vite 5](https://vitejs.dev/) (极致的冷启动速度)
*   **地图引擎**：[Leaflet](https://leafletjs.com/) (配合 React-Leaflet 实现声明式地图组件)
*   **UI 资产**：[Lucide React](https://lucide.dev/) 图标库 + Vanilla CSS (极致加载性能)
*   **数据结构**：分离式的 JS Data Layer，支持轻量级 Mock 数据扩展。

---

## 🚀 快速开始 (Quick Start)

### 开发者模式
1.  **安装依赖**：
    ```bash
    npm install
    ```
2.  **启动本地开发服务器**：
    ```bash
    npm run dev
    ```
3.  **访问项目**：
    默认地址：`http://localhost:5173`

### 生产部署
```bash
npm run build
```
编译生成的 `dist` 文件夹即可托管于任何静态服务器（如 Vercel, Netlify）。

---

## 📅 产品迭代路线 (Roadmap)
- [ ] **Data Pipeline**：对接真实租房 API 实时更新数据。
- [ ] **POI 辅助决策**：在地图上叠加超市、医院、菜市场等生活配套层。
- [ ] **个性化收藏**：用户收藏心仪房源。
- [ ] **AR 看房入口**：详情页集成全景/视频看房功能。

---

## 🤝 贡献与支持
如果你也是对房源地理信息探索感兴趣的开发者、设计师或产品经理，欢迎提交 PR。

**主创团队：** YXY001
**联系方式：** 1042986818@qq.com

---
*注：本项目仅供学习与产品演示使用。*
