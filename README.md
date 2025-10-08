# 🥝 Kiwi Market - Second-hand Trading Platform

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
- **Admin Panel**: Comprehensive admin dashboard for platform management

### New Zealand Localization
- **Currency**: NZD (New Zealand Dollar) support
- **Timezone**: Pacific/Auckland timezone
- **GST**: Configurable GST calculation
- **Compliance**: Built-in compliance features for NZ regulations

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x with Java 17
- **Security**: Spring Security with JWT authentication
- **Database**: PostgreSQL with JPA/Hibernate
- **Caching**: Redis for session management and caching
- **File Storage**: S3-compatible storage (MinIO locally, AWS S3 production)
- **Real-time**: WebSocket with STOMP for chat functionality
- **Payment**: Stripe integration for secure payments
- **API Documentation**: OpenAPI/Swagger 3

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: TailwindCSS for responsive design
- **Routing**: React Router DOM for navigation
- **State Management**: React Query for server state
- **UI Components**: Custom components with shadcn/ui
- **Internationalization**: i18next for Chinese/English support

## 🛠️ Technology Stack

### Backend Technologies
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

### Frontend Technologies
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- React Query (TanStack Query)
- i18next
- Zod (form validation)

### DevOps & Deployment
- Docker & Docker Compose
- Nginx (reverse proxy)
- GitHub Actions (CI/CD)
- MinIO (local S3)
- AWS S3 (production)

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.6+

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/zquanx/nz-market.git
   cd nz-market
   ```

2. **Start with Docker (Recommended)**
   ```bash
   # Make the start script executable
   chmod +x start.sh
   
   # Start development environment
   ./start.sh dev
   ```

3. **Manual Setup**
   
   **Backend:**
   ```bash
   cd nz-market-backend
   mvn clean install
   mvn spring-boot:run
   ```
   
   **Frontend:**
   ```bash
   cd nz-market-frontend
   npm install
   npm run dev
   ```

### Environment Variables

Create `.env` files based on the examples:

**Backend** (`nz-market-backend/.env`):
```env
# Database
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

## 📱 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **MinIO Console**: http://localhost:9001

## 🗂️ Project Structure

```
nz-market/
├── nz-market-backend/          # Spring Boot backend
│   ├── src/main/java/
│   │   └── nz/co/market/
│   │       ├── auth/           # Authentication & authorization
│   │       ├── items/          # Item management
│   │       ├── chat/           # Real-time messaging
│   │       ├── orders/         # Order & payment processing
│   │       ├── uploads/        # File upload handling
│   │       └── admin/          # Admin panel
│   └── src/main/resources/
│       └── db/migration/       # Database migrations
├── nz-market-frontend/         # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── data/               # Mock data
│   │   └── styles/             # Global styles
│   └── public/
├── docker-compose.yml          # Production setup
├── docker-compose.dev.yml      # Development setup
└── start.sh                    # Startup script
```

## 🔧 Development

### Backend Development
```bash
cd nz-market-backend
mvn spring-boot:run
```

### Frontend Development
```bash
cd nz-market-frontend
npm run dev
```

### Running Tests
```bash
# Backend tests
cd nz-market-backend
mvn test

# Frontend tests
cd nz-market-frontend
npm test
```

## 🚀 Deployment

### Production Deployment
```bash
# Build and start production environment
docker-compose up -d
```

### Environment Configuration
- Update environment variables in `docker-compose.yml`
- Configure Nginx reverse proxy
- Set up SSL certificates
- Configure domain names

## 📊 API Documentation

The API documentation is available at `/swagger-ui.html` when the backend is running. It includes:

- Authentication endpoints
- Item management APIs
- Chat and messaging APIs
- Order and payment APIs
- Admin panel APIs
- File upload APIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful frontend library
- TailwindCSS for the utility-first CSS framework
- All contributors and testers

## 📞 Support

For support, email support@kiwimarket.nz or create an issue in the GitHub repository.

---

**Built with ❤️ for New Zealand's second-hand trading community**