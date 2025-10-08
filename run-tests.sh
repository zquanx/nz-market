#!/bin/bash

# Kiwi Market 自动化测试运行脚本
# 支持多种测试模式和配置

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${2}${1}${NC}"
}

# 显示帮助信息
show_help() {
    echo "Kiwi Market 自动化测试运行脚本"
    echo ""
    echo "用法: $0 [选项] [测试类型]"
    echo ""
    echo "选项:"
    echo "  -h, --help              显示帮助信息"
    echo "  -e, --env <环境>        指定测试环境 (dev|staging|prod)"
    echo "  -b, --browser <浏览器>  指定浏览器 (chromium|firefox|webkit|all)"
    echo "  -p, --parallel <数量>   并行测试数量"
    echo "  -r, --retry <次数>      失败重试次数"
    echo "  --headed                显示浏览器界面"
    echo "  --debug                 调试模式"
    echo "  --cleanup               测试后清理环境"
    echo ""
    echo "测试类型:"
    echo "  all                     运行所有测试"
    echo "  auth                    用户认证测试"
    echo "  items                   商品管理测试"
    echo "  chat                    聊天功能测试"
    echo "  orders                  订单支付测试"
    echo "  admin                   管理员功能测试"
    echo "  api                     API接口测试"
    echo "  e2e                     端到端测试"
    echo "  smoke                   冒烟测试"
    echo ""
    echo "示例:"
    echo "  $0 all                  # 运行所有测试"
    echo "  $0 -b chromium auth     # 在Chrome中运行认证测试"
    echo "  $0 -p 4 --headed e2e    # 并行运行4个端到端测试，显示浏览器"
    echo "  $0 --debug api          # 调试模式运行API测试"
}

# 默认配置
ENVIRONMENT="dev"
BROWSER="chromium"
PARALLEL="1"
RETRY="0"
HEADED=""
DEBUG=""
CLEANUP=""
TEST_TYPE="all"

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -b|--browser)
            BROWSER="$2"
            shift 2
            ;;
        -p|--parallel)
            PARALLEL="$2"
            shift 2
            ;;
        -r|--retry)
            RETRY="$2"
            shift 2
            ;;
        --headed)
            HEADED="--headed"
            shift
            ;;
        --debug)
            DEBUG="--debug"
            shift
            ;;
        --cleanup)
            CLEANUP="true"
            shift
            ;;
        all|auth|items|chat|orders|admin|api|e2e|smoke)
            TEST_TYPE="$1"
            shift
            ;;
        *)
            print_message "未知选项: $1" $RED
            show_help
            exit 1
            ;;
    esac
done

# 设置环境变量
export CLEANUP_DOCKER="$CLEANUP"
export NODE_ENV="test"

print_message "🥝 Kiwi Market 自动化测试" $BLUE
print_message "================================" $BLUE
print_message "环境: $ENVIRONMENT" $YELLOW
print_message "浏览器: $BROWSER" $YELLOW
print_message "并行数: $PARALLEL" $YELLOW
print_message "重试次数: $RETRY" $YELLOW
print_message "测试类型: $TEST_TYPE" $YELLOW
print_message "================================" $BLUE

# 检查依赖
check_dependencies() {
    print_message "🔍 检查依赖..." $BLUE
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        print_message "❌ Node.js 未安装" $RED
        exit 1
    fi
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        print_message "❌ npm 未安装" $RED
        exit 1
    fi
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        print_message "❌ Docker 未安装" $RED
        exit 1
    fi
    
    # 检查Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_message "❌ Docker Compose 未安装" $RED
        exit 1
    fi
    
    print_message "✅ 依赖检查通过" $GREEN
}

# 安装测试依赖
install_dependencies() {
    print_message "📦 安装测试依赖..." $BLUE
    
    # 安装Playwright
    if [ ! -d "node_modules/@playwright" ]; then
        npm install @playwright/test
        npx playwright install
    fi
    
    # 安装其他测试依赖
    npm install --save-dev @playwright/test
    
    print_message "✅ 依赖安装完成" $GREEN
}

# 启动测试环境
start_test_environment() {
    print_message "🚀 启动测试环境..." $BLUE
    
    # 启动数据库服务
    print_message "📊 启动数据库服务..." $YELLOW
    docker-compose -f docker-compose.dev.yml up -d postgres redis minio
    
    # 等待服务启动
    print_message "⏳ 等待服务启动..." $YELLOW
    sleep 10
    
    # 检查服务状态
    if docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        print_message "✅ 数据库服务启动成功" $GREEN
    else
        print_message "❌ 数据库服务启动失败" $RED
        exit 1
    fi
}

# 运行测试
run_tests() {
    print_message "🧪 开始运行测试..." $BLUE
    
    # 构建测试命令
    TEST_CMD="npx playwright test"
    
    # 添加浏览器参数
    if [ "$BROWSER" != "all" ]; then
        TEST_CMD="$TEST_CMD --project=$BROWSER"
    fi
    
    # 添加并行参数
    if [ "$PARALLEL" != "1" ]; then
        TEST_CMD="$TEST_CMD --workers=$PARALLEL"
    fi
    
    # 添加重试参数
    if [ "$RETRY" != "0" ]; then
        TEST_CMD="$TEST_CMD --retries=$RETRY"
    fi
    
    # 添加其他参数
    if [ -n "$HEADED" ]; then
        TEST_CMD="$TEST_CMD $HEADED"
    fi
    
    if [ -n "$DEBUG" ]; then
        TEST_CMD="$TEST_CMD $DEBUG"
    fi
    
    # 根据测试类型选择测试文件
    case $TEST_TYPE in
        auth)
            TEST_CMD="$TEST_CMD user-registration-test.js"
            ;;
        items)
            TEST_CMD="$TEST_CMD item-management-test.js"
            ;;
        chat)
            TEST_CMD="$TEST_CMD chat-order-test.js --grep '聊天'"
            ;;
        orders)
            TEST_CMD="$TEST_CMD chat-order-test.js --grep '订单'"
            ;;
        admin)
            TEST_CMD="$TEST_CMD --grep '管理员'"
            ;;
        api)
            TEST_CMD="$TEST_CMD --grep 'API'"
            ;;
        e2e)
            TEST_CMD="$TEST_CMD --grep '流程'"
            ;;
        smoke)
            TEST_CMD="$TEST_CMD --grep '冒烟'"
            ;;
        all)
            # 运行所有测试
            ;;
    esac
    
    print_message "执行命令: $TEST_CMD" $YELLOW
    
    # 执行测试
    if eval $TEST_CMD; then
        print_message "✅ 测试执行成功" $GREEN
        return 0
    else
        print_message "❌ 测试执行失败" $RED
        return 1
    fi
}

# 生成测试报告
generate_report() {
    print_message "📊 生成测试报告..." $BLUE
    
    # 检查测试结果
    if [ -f "test-results/results.json" ]; then
        print_message "✅ 测试报告已生成" $GREEN
        print_message "📁 报告位置: test-results/" $YELLOW
        
        # 显示测试摘要
        if command -v jq &> /dev/null; then
            echo ""
            print_message "📈 测试摘要:" $BLUE
            jq -r '.stats | "总测试数: \(.total), 通过: \(.passed), 失败: \(.failed), 跳过: \(.skipped)"' test-results/results.json
        fi
    else
        print_message "⚠️ 未找到测试报告" $YELLOW
    fi
}

# 清理环境
cleanup_environment() {
    if [ "$CLEANUP" = "true" ]; then
        print_message "🧹 清理测试环境..." $BLUE
        
        # 停止Docker服务
        docker-compose -f docker-compose.dev.yml down
        
        # 清理测试文件
        rm -rf test-results/
        
        print_message "✅ 环境清理完成" $GREEN
    fi
}

# 主函数
main() {
    # 检查依赖
    check_dependencies
    
    # 安装依赖
    install_dependencies
    
    # 启动测试环境
    start_test_environment
    
    # 运行测试
    if run_tests; then
        # 生成报告
        generate_report
        
        # 清理环境
        cleanup_environment
        
        print_message "🎉 所有测试完成！" $GREEN
        exit 0
    else
        # 生成报告
        generate_report
        
        # 清理环境
        cleanup_environment
        
        print_message "💥 测试失败！" $RED
        exit 1
    fi
}

# 捕获中断信号
trap 'print_message "⚠️ 测试被中断" $YELLOW; cleanup_environment; exit 130' INT TERM

# 运行主函数
main
