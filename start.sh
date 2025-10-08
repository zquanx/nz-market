#!/bin/bash

# Kiwi Market - Start Script
# This script helps you start the Kiwi Market application

set -e

echo "🥝 Starting Kiwi Market..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose and try again."
    exit 1
fi

# Function to display help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  dev     Start in development mode with hot reload"
    echo "  prod    Start in production mode"
    echo "  stop    Stop all services"
    echo "  logs    Show logs from all services"
    echo "  clean   Stop and remove all containers and volumes"
    echo "  help    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev     # Start development environment"
    echo "  $0 prod    # Start production environment"
    echo "  $0 stop    # Stop all services"
}

# Function to start development environment
start_dev() {
    echo "🚀 Starting development environment..."
    docker-compose -f docker-compose.dev.yml up -d
    
    echo ""
    echo "✅ Development environment started!"
    echo ""
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:8080/api"
    echo "📚 API Docs: http://localhost:8080/api/swagger-ui"
    echo "🗄️  MinIO Console: http://localhost:9001 (minio/minio_secret)"
    echo "🐘 PostgreSQL: localhost:5432 (market/market)"
    echo "🔴 Redis: localhost:6379"
    echo ""
    echo "To view logs: $0 logs"
    echo "To stop: $0 stop"
}

# Function to start production environment
start_prod() {
    echo "🚀 Starting production environment..."
    docker-compose up -d
    
    echo ""
    echo "✅ Production environment started!"
    echo ""
    echo "🌐 Application: http://localhost"
    echo "🔧 Backend API: http://localhost/api"
    echo "📚 API Docs: http://localhost/api/swagger-ui"
    echo ""
    echo "To view logs: $0 logs"
    echo "To stop: $0 stop"
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping services..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo "✅ Services stopped!"
}

# Function to show logs
show_logs() {
    echo "📋 Showing logs from all services..."
    docker-compose logs -f
}

# Function to clean up
clean_up() {
    echo "🧹 Cleaning up containers and volumes..."
    docker-compose down -v
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
    echo "✅ Cleanup completed!"
}

# Main script logic
case "${1:-help}" in
    dev)
        start_dev
        ;;
    prod)
        start_prod
        ;;
    stop)
        stop_services
        ;;
    logs)
        show_logs
        ;;
    clean)
        clean_up
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown option: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
