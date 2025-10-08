# Kiwi Market - Second-hand Trading Platform

A full-stack second-hand trading platform built for New Zealand, featuring a React frontend and Spring Boot backend with comprehensive trading features.

## 🚀 Features

### Core Functionality
- **User Management**: Registration, authentication, profiles with JWT
- **Item Listings**: Create, edit, and manage second-hand items
- **Search & Discovery**: Advanced filtering by category, price, location
- **Real-time Chat**: WebSocket-based messaging between buyers and sellers
- **Favorites**: Save and manage favorite items
- **Image Upload**: S3-compatible object storage with presigned URLs
- **Payment Integration**: Stripe integration for secure transactions
- **Reviews & Ratings**: Post-transaction feedback system

### New Zealand Localization
- **Currency**: NZD (New Zealand Dollar)
- **Timezone**: Pacific/Auckland
- **GST Support**: Configurable tax calculation
- **Local Categories**: Tailored for NZ market
- **Bilingual**: English and Chinese support

### Technical Features
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: WebSocket communication
- **Image Optimization**: Automatic resizing and compression
- **Search**: Full-text search with PostgreSQL
- **Caching**: Redis for session and data caching
- **Security**: JWT authentication, input validation, CORS
- **Monitoring**: Health checks and metrics

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │  Spring Boot    │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │      Redis      │    │     MinIO       │
│  (Reverse Proxy)│    │    (Cache)      │    │ (Object Store)  │
│   Port: 80      │    │   Port: 6379    │    │   Port: 9000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Java 17** with Spring Boot 3.x
- **Spring Security** with JWT
- **Spring Data JPA** with Hibernate
- **PostgreSQL** database
- **Redis** for caching
- **WebSocket** for real-time chat
- **Stripe** for payments
- **MinIO/S3** for file storage

### DevOps
- **Docker** & Docker Compose
- **Nginx** reverse proxy
- **Flyway** database migrations
- **GitHub Actions** CI/CD

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Java 17+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**
```bash
git clone <repository-url>
cd nz-market
```

2. **Start all services**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- API Documentation: http://localhost:8080/api/swagger-ui
- MinIO Console: http://localhost:9001 (minio/minio_secret)

### Local Development

#### Frontend
```bash
cd nz-market-frontend
pnpm install
pnpm dev
```

#### Backend
```bash
cd nz-market-backend
./mvnw spring-boot:run
```

## 📁 Project Structure

```
nz-market/
├── nz-market-frontend/          # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── data/              # Mock data
│   │   ├── types/             # TypeScript types
│   │   └── styles/            # Global styles
│   ├── Dockerfile
│   └── package.json
├── nz-market-backend/           # Spring Boot backend
│   ├── src/main/java/
│   │   ├── auth/              # Authentication
│   │   ├── items/             # Item management
│   │   ├── chat/              # Chat functionality
│   │   ├── orders/            # Order management
│   │   ├── uploads/           # File upload
│   │   └── common/            # Shared utilities
│   ├── src/main/resources/
│   │   ├── db/migration/      # Database migrations
│   │   └── application.yml    # Configuration
│   └── Dockerfile
├── docker-compose.yml          # Container orchestration
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/market
DB_USER=market
DB_PASSWORD=market

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key

# S3/MinIO
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=market-uploads
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Application
CURRENCY=NZD
TZ=Pacific/Auckland
TAX_ENABLED=false
TAX_RATE=0.15
```

## 🧪 Testing

### Frontend Tests
```bash
cd nz-market-frontend
pnpm test
```

### Backend Tests
```bash
cd nz-market-backend
./mvnw test
```

### Integration Tests
```bash
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 📊 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8080/api/swagger-ui
- **OpenAPI JSON**: http://localhost:8080/api/v3/api-docs

## 🔐 Security

- JWT-based authentication
- Password hashing with BCrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- SQL injection prevention
- XSS protection

## 🌍 Internationalization

The platform supports:
- **English** (default)
- **Chinese** (中文)

Language preferences are stored in localStorage and persist across sessions.

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface
- Progressive Web App (PWA) ready
- Mobile-optimized image uploads

## 🚀 Deployment

### Production Deployment

1. **Set production environment variables**
2. **Build and push Docker images**
3. **Deploy using Docker Compose or Kubernetes**
4. **Configure SSL certificates**
5. **Set up monitoring and logging**

### Environment-specific configurations

- **Development**: Hot reload, debug logging
- **Staging**: Production-like with test data
- **Production**: Optimized builds, security hardening

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the New Zealand second-hand market
- Inspired by popular trading platforms
- Uses modern web technologies and best practices
- Designed with accessibility and usability in mind

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation

---

**Made with ❤️ in New Zealand**
