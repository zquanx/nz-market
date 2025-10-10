#!/bin/bash

# Kiwi Market 优化测试套件运行脚本
# 合并和优化后的测试用例执行脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 测试文件路径
AUTH_TESTS="./test-scripts/01-authentication.spec.js"
FRONTEND_TESTS="./test-scripts/02-frontend-basic.spec.js"
ITEM_TESTS="./test-scripts/03-item-management.spec.js"
CHAT_ORDER_TESTS="./test-scripts/04-chat-orders.spec.js"
UI_PERF_TESTS="./test-scripts/05-ui-performance.spec.js"
SEC_A11Y_TESTS="./test-scripts/06-security-accessibility.spec.js"
INTEGRATION_TESTS="./test-scripts/07-integration.spec.js"

# 默认运行所有测试
ALL_TESTS="$AUTH_TESTS $FRONTEND_TESTS $ITEM_TESTS $CHAT_ORDER_TESTS $UI_PERF_TESTS $SEC_A11Y_TESTS $INTEGRATION_TESTS"
TEST_FILES="$ALL_TESTS"
TEST_TAG="所有优化测试"

# 解析命令行参数
while [[ $# -gt 0 ]]; do
  case $1 in
    --auth)
      TEST_FILES="$AUTH_TESTS"
      TEST_TAG="认证功能测试"
      shift
      ;;
    --frontend)
      TEST_FILES="$FRONTEND_TESTS"
      TEST_TAG="前端基础功能测试"
      shift
      ;;
    --items)
      TEST_FILES="$ITEM_TESTS"
      TEST_TAG="商品管理测试"
      shift
      ;;
    --chat-orders)
      TEST_FILES="$CHAT_ORDER_TESTS"
      TEST_TAG="聊天和订单测试"
      shift
      ;;
    --ui-perf)
      TEST_FILES="$UI_PERF_TESTS"
      TEST_TAG="UI交互和性能测试"
      shift
      ;;
    --security)
      TEST_FILES="$SEC_A11Y_TESTS"
      TEST_TAG="安全和可访问性测试"
      shift
      ;;
    --integration)
      TEST_FILES="$INTEGRATION_TESTS"
      TEST_TAG="综合集成测试"
      shift
      ;;
    --core)
      TEST_FILES="$AUTH_TESTS $FRONTEND_TESTS $ITEM_TESTS $CHAT_ORDER_TESTS"
      TEST_TAG="核心功能测试"
      shift
      ;;
    --non-functional)
      TEST_FILES="$UI_PERF_TESTS $SEC_A11Y_TESTS"
      TEST_TAG="非功能性测试"
      shift
      ;;
    --quick)
      TEST_FILES="$AUTH_TESTS $FRONTEND_TESTS"
      TEST_TAG="快速测试"
      shift
      ;;
    --help)
      echo "Kiwi Market 优化测试套件运行脚本"
      echo ""
      echo "用法: $0 [选项] [Playwright参数]"
      echo ""
      echo "测试套件选项:"
      echo "  --auth           运行认证功能测试"
      echo "  --frontend       运行前端基础功能测试"
      echo "  --items          运行商品管理测试"
      echo "  --chat-orders    运行聊天和订单测试"
      echo "  --ui-perf        运行UI交互和性能测试"
      echo "  --security       运行安全和可访问性测试"
      echo "  --integration    运行综合集成测试"
      echo "  --core           运行核心功能测试（认证+前端+商品+聊天订单）"
      echo "  --non-functional 运行非功能性测试（UI+性能+安全+可访问性）"
      echo "  --quick          运行快速测试（认证+前端）"
      echo "  --help           显示此帮助信息"
      echo ""
      echo "Playwright参数:"
      echo "  --headed         显示浏览器界面"
      echo "  --debug          调试模式"
      echo "  --workers 1      设置并发工作线程数"
      echo "  --timeout 30000  设置测试超时时间"
      echo ""
      echo "示例:"
      echo "  $0 --auth --headed"
      echo "  $0 --core --workers 2"
      echo "  $0 --integration --timeout 60000"
      exit 0
      ;;
    *)
      # 传递其他Playwright参数
      PLAYWRIGHT_ARGS+="$1 "
      shift
      ;;
  esac
done

echo -e "${BLUE}🚀 正在运行 Kiwi Market ${TEST_TAG}...${NC}"
echo -e "${YELLOW}测试文件: ${TEST_FILES}${NC}"
echo ""

# 检查测试文件是否存在
for test_file in $TEST_FILES; do
  if [ ! -f "$test_file" ]; then
    echo -e "${RED}❌ 测试文件不存在: $test_file${NC}"
    exit 1
  fi
done

# 运行Playwright测试
echo -e "${BLUE}开始执行测试...${NC}"
npx playwright test $TEST_FILES $PLAYWRIGHT_ARGS

# 检查测试结果
if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✅ Kiwi Market ${TEST_TAG} 运行成功！${NC}"
  
  # 生成测试报告
  echo -e "${BLUE}📊 正在生成测试报告...${NC}"
  npx playwright show-report
  
  # 显示测试统计
  echo ""
  echo -e "${GREEN}📈 测试统计:${NC}"
  echo -e "${YELLOW}测试套件: ${TEST_TAG}${NC}"
  echo -e "${YELLOW}测试文件数量: $(echo $TEST_FILES | wc -w)${NC}"
  
  # 计算测试用例数量（粗略估算）
  total_tests=0
  for test_file in $TEST_FILES; do
    test_count=$(grep -c "test(" "$test_file" 2>/dev/null || echo "0")
    total_tests=$((total_tests + test_count))
  done
  echo -e "${YELLOW}测试用例数量: ${total_tests}${NC}"
  
else
  echo ""
  echo -e "${RED}❌ Kiwi Market ${TEST_TAG} 运行失败！${NC}"
  echo -e "${YELLOW}请检查测试报告以获取详细信息${NC}"
  
  # 仍然生成报告
  echo -e "${BLUE}📊 正在生成测试报告...${NC}"
  npx playwright show-report
  
  exit 1
fi

echo ""
echo -e "${GREEN}🎉 测试执行完成！${NC}"
exit 0
