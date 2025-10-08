# 🥝 Kiwi Market - 二手商品交易平台

专为新西兰打造的全栈二手商品交易平台，采用React前端和Spring Boot后端，提供全面的交易功能。

## 🚀 功能特性

### 核心功能
- **用户管理**: 注册、认证、JWT用户档案管理
- **商品发布**: 创建、编辑和管理二手商品
- **搜索发现**: 按类别、价格、位置进行高级筛选
- **实时聊天**: 基于WebSocket的买卖双方消息系统
- **收藏功能**: 保存和管理心仪商品
- **图片上传**: S3兼容的对象存储，支持预签名URL
- **支付集成**: Stripe集成，确保安全交易
- **评价系统**: 交易后反馈和评分系统
- **管理面板**: 全面的平台管理仪表板

### 新西兰本地化
- **货币**: 新西兰元(NZD)支持
- **时区**: 太平洋/奥克兰时区
- **消费税**: 可配置的GST计算
- **合规性**: 内置新西兰法规合规功能

## 🏗️ 架构设计

### 后端 (Spring Boot)
- **框架**: Spring Boot 3.x + Java 17
- **安全**: Spring Security + JWT认证
- **数据库**: PostgreSQL + JPA/Hibernate
- **缓存**: Redis会话管理和缓存
- **文件存储**: S3兼容存储(本地MinIO，生产环境AWS S3)
- **实时通信**: WebSocket + STOMP聊天功能
- **支付**: Stripe集成安全支付
- **API文档**: OpenAPI/Swagger 3

### 前端 (React)
- **框架**: React 18 + TypeScript
- **构建工具**: Vite快速开发和构建
- **样式**: TailwindCSS响应式设计
- **路由**: React Router DOM导航
- **状态管理**: React Query服务器状态
- **UI组件**: 自定义组件 + shadcn/ui
- **国际化**: i18next中英文支持

## 🛠️ 技术栈

### 后端技术
- Java 17
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- PostgreSQL
- Redis
- JWT (JSON Web Tokens)
- MapStruct
- Flyway
- Stripe API
- WebSocket (STOMP)
- OpenAPI/Swagger 3

### 前端技术
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- React Query (TanStack Query)
- i18next
- Zod (表单验证)

### 运维部署
- Docker & Docker Compose
- Nginx (反向代理)
- GitHub Actions (CI/CD)
- MinIO (本地S3)
- AWS S3 (生产环境)

## 🚀 快速开始

### 环境要求
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.6+

### 开发环境搭建

1. **克隆仓库**
   ```bash
   git clone https://github.com/zquanx/nz-market.git
   cd nz-market
   ```

2. **使用Docker启动(推荐)**
   ```bash
   # 给启动脚本添加执行权限
   chmod +x start.sh
   
   # 启动开发环境
   ./start.sh dev
   ```

3. **手动搭建**
   
   **后端:**
   ```bash
   cd nz-market-backend
   mvn clean install
   mvn spring-boot:run
   ```
   
   **前端:**
   ```bash
   cd nz-market-frontend
   npm install
   npm run dev
   ```

### 环境变量配置

根据示例创建`.env`文件:

**后端** (`nz-market-backend/.env`):
```env
# 数据库
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nz_market
DB_USERNAME=postgres
DB_PASSWORD=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRATION=3600000
JWT_REFRESH_EXPIRATION=86400000

# S3/MinIO
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=nz-market

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 📱 应用访问地址

- **前端**: http://localhost:3000
- **后端API**: http://localhost:8080
- **API文档**: http://localhost:8080/swagger-ui.html
- **MinIO控制台**: http://localhost:9001

## 🗂️ 项目结构

```
nz-market/
├── nz-market-backend/          # Spring Boot后端
│   ├── src/main/java/
│   │   └── nz/co/market/
│   │       ├── auth/           # 认证授权
│   │       ├── items/          # 商品管理
│   │       ├── chat/           # 实时消息
│   │       ├── orders/         # 订单支付
│   │       ├── uploads/        # 文件上传
│   │       └── admin/          # 管理面板
│   └── src/main/resources/
│       └── db/migration/       # 数据库迁移
├── nz-market-frontend/         # React前端
│   ├── src/
│   │   ├── components/         # 可复用组件
│   │   ├── pages/              # 页面组件
│   │   ├── data/               # 模拟数据
│   │   └── styles/             # 全局样式
│   └── public/
├── docker-compose.yml          # 生产环境配置
├── docker-compose.dev.yml      # 开发环境配置
└── start.sh                    # 启动脚本
```

## 🔧 开发指南

### 后端开发
```bash
cd nz-market-backend
mvn spring-boot:run
```

### 前端开发
```bash
cd nz-market-frontend
npm run dev
```

### 运行测试
```bash
# 后端测试
cd nz-market-backend
mvn test

# 前端测试
cd nz-market-frontend
npm test
```

## 🚀 部署指南

### 生产环境部署
```bash
# 构建并启动生产环境
docker-compose up -d
```

### 环境配置
- 更新`docker-compose.yml`中的环境变量
- 配置Nginx反向代理
- 设置SSL证书
- 配置域名

## 📊 API文档

后端运行时，API文档可在`/swagger-ui.html`访问，包括:

- 认证接口
- 商品管理API
- 聊天消息API
- 订单支付API
- 管理面板API
- 文件上传API

## 🤝 贡献指南

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- Spring Boot团队提供的优秀框架
- React团队提供的强大前端库
- TailwindCSS提供的实用优先CSS框架
- 所有贡献者和测试者

## 📞 技术支持

如需支持，请发送邮件至 support@kiwimarket.nz 或在GitHub仓库中创建issue。

---

**为新西兰二手交易社区精心打造 ❤️**
