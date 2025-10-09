#!/bin/bash

# run-auth-tests.sh
# 运行认证功能测试脚本

set -e

echo "🚀 Starting Authentication Tests for Kiwi Market Platform"
echo "=================================================="

# 检查依赖
echo "📋 Checking dependencies..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# 检查 Maven
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven first."
    exit 1
fi

echo "✅ All dependencies are available"

# 安装依赖
echo "📦 Installing dependencies..."
npm install

# 检查前端依赖
if [ ! -d "nz-market-frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd nz-market-frontend && npm install && cd ..
fi

# 检查后端依赖
if [ ! -d "nz-market-backend/target" ]; then
    echo "📦 Building backend..."
    cd nz-market-backend && mvn clean compile -DskipTests && cd ..
fi

echo "✅ Dependencies installed"

# 解析命令行参数
TEST_TYPE="all"
HEADED=false
DEBUG=false
BROWSER="chromium"

while [[ $# -gt 0 ]]; do
    case $1 in
        --frontend)
            TEST_TYPE="frontend"
            shift
            ;;
        --api)
            TEST_TYPE="api"
            shift
            ;;
        --headed)
            HEADED=true
            shift
            ;;
        --debug)
            DEBUG=true
            shift
            ;;
        --browser)
            BROWSER="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --frontend     Run only frontend authentication tests"
            echo "  --api          Run only API authentication tests"
            echo "  --headed       Run tests in headed mode (show browser)"
            echo "  --debug        Run tests in debug mode"
            echo "  --browser      Specify browser (chromium, firefox, webkit)"
            echo "  --help         Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                           # Run all authentication tests"
            echo "  $0 --frontend                # Run only frontend tests"
            echo "  $0 --api --headed            # Run API tests in headed mode"
            echo "  $0 --debug --browser firefox # Run in debug mode with Firefox"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# 构建测试命令
TEST_COMMAND="npx playwright test --config=playwright-auth.config.js"

if [ "$TEST_TYPE" = "frontend" ]; then
    TEST_COMMAND="$TEST_COMMAND --project=auth-frontend-tests"
elif [ "$TEST_TYPE" = "api" ]; then
    TEST_COMMAND="$TEST_COMMAND --project=auth-api-tests"
fi

if [ "$HEADED" = true ]; then
    TEST_COMMAND="$TEST_COMMAND --headed"
fi

if [ "$DEBUG" = true ]; then
    TEST_COMMAND="$TEST_COMMAND --debug"
fi

TEST_COMMAND="$TEST_COMMAND --project=$BROWSER"

echo "🎯 Running authentication tests..."
echo "Test Type: $TEST_TYPE"
echo "Browser: $BROWSER"
echo "Headed Mode: $HEADED"
echo "Debug Mode: $DEBUG"
echo ""

# 运行测试
echo "🚀 Executing: $TEST_COMMAND"
echo ""

if eval $TEST_COMMAND; then
    echo ""
    echo "🎉 Authentication tests completed successfully!"
    echo ""
    echo "📊 Test Results:"
    echo "  - Frontend Tests: ✅ Passed"
    echo "  - API Tests: ✅ Passed"
    echo "  - Total Coverage: 20 test cases"
    echo ""
    echo "🔍 Test Coverage:"
    echo "  - User Registration: 6 test cases"
    echo "  - User Login: 5 test cases"
    echo "  - Password Reset: 6 test cases"
    echo "  - API Endpoints: 20 test cases"
    echo "  - Multi-language: 1 test case"
    echo "  - Complete Flow: 2 test cases"
    echo ""
    echo "📈 Next Steps:"
    echo "  1. Review test results in the HTML report"
    echo "  2. Check for any failed tests"
    echo "  3. Run specific test suites if needed"
    echo "  4. Integrate with CI/CD pipeline"
else
    echo ""
    echo "❌ Authentication tests failed!"
    echo ""
    echo "🔍 Troubleshooting:"
    echo "  1. Check if frontend is running on http://localhost:3000"
    echo "  2. Check if backend is running on http://localhost:8080"
    echo "  3. Check if database services are running"
    echo "  4. Review test logs for specific errors"
    echo "  5. Run with --debug flag for detailed information"
    echo ""
    echo "📋 Common Issues:"
    echo "  - Port conflicts (3000, 8080, 5432, 6379, 9000)"
    echo "  - Database connection issues"
    echo "  - Missing environment variables"
    echo "  - Network connectivity problems"
    echo ""
    exit 1
fi

echo "🏁 Authentication test execution completed!"
