#!/bin/bash
# 完整功能测试脚本

echo "============================================================"
echo "📊 酒店投资评估系统 - 完整功能测试"
echo "============================================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数
PASSED=0
FAILED=0

# 测试函数
test_case() {
    local name="$1"
    local command="$2"
    echo -n "测试: $name ... "
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 通过${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ 失败${NC}"
        ((FAILED++))
        return 1
    fi
}

echo "第1步: 检查服务状态"
echo "------------------------------------------------------------"
test_case "前端服务 (端口3000)" "curl -s http://localhost:3000 > /dev/null"
test_case "后端服务 (端口5000)" "curl -s http://localhost:5000/api/health > /dev/null"
echo ""

echo "第2步: 验证JSON格式"
echo "------------------------------------------------------------"
test_case "JSON格式验证" "python3 -c 'import json; json.load(open(\"/tmp/user_data.json\"))'"
echo ""

echo "第3步: 测试后端API"
echo "------------------------------------------------------------"
echo "调用评估API..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/calculate_score \
  -H "Content-Type: application/json" \
  -d @/tmp/user_data.json)

# 解析响应
CODE=$(echo "$RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('code', 0))")
SCORE=$(echo "$RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['comprehensive_score'])" 2>/dev/null)

if [ "$CODE" = "200" ]; then
    echo -e "${GREEN}✓ API调用成功${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ API调用失败${NC}"
    ((FAILED++))
fi

if [ -n "$SCORE" ]; then
    echo -e "${GREEN}✓ 评分计算成功: ${SCORE} 分${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ 评分计算失败${NC}"
    ((FAILED++))
fi
echo ""

echo "第4步: 详细评估结果"
echo "------------------------------------------------------------"
python3 << 'EOF'
import json, sys

with open('/tmp/user_data.json', 'r') as f:
    data = json.load(f)

# 测试每个字段
fields = {
    'geographic_location': '地理位置',
    'core_customer_flow': '核心客流',
    'competitive_pattern': '竞争格局',
    'esports_venue_distribution': '电竞馆分布',
    'esports_hotel_distribution': '电竞酒店分布',
    'business_hotel_distribution': '商务酒店分布'
}

print("📋 输入数据验证:")
for key, name in fields.items():
    value = data.get(key)
    if value:
        if isinstance(value, str):
            preview = value[:30] + '...' if len(value) > 30 else value
            print(f"  ✓ {name}: {preview}")
        elif isinstance(value, dict):
            count = len(value)
            print(f"  ✓ {name}: {count} 个字段")
        elif isinstance(value, list):
            count = len(value)
            print(f"  ✓ {name}: {count} 个项目")
    else:
        print(f"  ✗ {name}: 缺失")

print()
EOF

echo "第5步: 显示完整评估报告"
echo "------------------------------------------------------------"
curl -s -X POST http://localhost:5000/api/calculate_score \
  -H "Content-Type: application/json" \
  -d @/tmp/user_data.json | python3 << 'EOF'
import json, sys

data = json.load(sys.stdin)['data']

print(f"综合得分: {data['comprehensive_score']} 分")
print(f"价值等级: {data['value_level']}")
print(f"投资建议: {data['recommendation']}")
print()
print("各维度得分:")
scores = data['dimension_scores']
for key, val in [
    ('geographic_location', '地理位置'),
    ('core_customer_flow', '核心客流'),
    ('competitive_pattern', '竞争格局'),
    ('esports_venue', '电竞馆分布'),
    ('esports_hotel', '电竞酒店分布'),
    ('business_hotel', '商务酒店分布')
]:
    print(f"  {val:12s}: {scores[key]:4.1f} 分")

print()
print("✅ 优势:")
for s in data['conclusion']['strengths']:
    print(f"  • {s}")

print()
print("⚠️  风险:")
for r in data['conclusion']['risks']:
    print(f"  • {r}")

print()
print("💡 建议:")
for s in data['conclusion']['suggestions']:
    print(f"  • {s}")
EOF

echo ""
echo "============================================================"
echo "📊 测试总结"
echo "============================================================"
echo -e "${GREEN}通过: $PASSED${NC}"
echo -e "${RED}失败: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}"
    echo "🎉 所有测试通过！系统运行正常！"
    echo "${NC}"
    exit 0
else
    echo -e "${RED}"
    echo "⚠️  部分测试失败，请检查服务状态"
    echo "${NC}"
    exit 1
fi
