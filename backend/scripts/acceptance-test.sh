#!/bin/bash

echo "========================================"
echo "  销售商品管理系统 - 验收测试"
echo "========================================"
echo ""

BASE_URL="http://localhost:3001"

# 1. 检查服务状态
echo "1️⃣  检查服务状态..."
RESPONSE=$(curl -s "${BASE_URL}/api/health")
if echo "$RESPONSE" | grep -q "ok"; then
  echo "✅ 后端服务正常"
else
  echo "❌ 后端服务异常"
  echo "   响应: $RESPONSE"
  exit 1
fi
echo ""

# 2. 检查商品数量
echo "2️⃣  检查商品数据..."
RESPONSE=$(curl -s "${BASE_URL}/api/products")
COUNT=$(echo "$RESPONSE" | grep -o '"count":[0-9]*' | grep -o '[0-9]*' | head -1)
if [ "$COUNT" -eq 12 ]; then
  echo "✅ 商品数据完整 (共 $COUNT 个商品)"
else
  echo "⚠️  商品数量异常 (期望12个，实际$COUNT个)"
fi
echo ""

# 3. 检查库存
echo "3️⃣  检查总库存..."
RESPONSE=$(curl -s "${BASE_URL}/api/products/stats")
STOCK=$(echo "$RESPONSE" | grep -o '"totalStock":[0-9]*' | grep -o '[0-9]*' | head -1)
echo "📦 总库存: $STOCK"
if [ "$STOCK" -ge 2000 ]; then
  echo "✅ 库存充足"
else
  echo "⚠️  库存偏低，建议补充"
fi
echo ""

# 4. 检查商品状态分布
echo "4️⃣  检查商品状态分布..."
ONLINE=$(echo "$RESPONSE" | grep -o '"online":[0-9]*' | grep -o '[0-9]*' | head -1)
PENDING=$(echo "$RESPONSE" | grep -o '"pending":[0-9]*' | grep -o '[0-9]*' | head -1)
REJECTED=$(echo "$RESPONSE" | grep -o '"rejected":[0-9]*' | grep -o '[0-9]*' | head -1)
OFFLINE=$(echo "$RESPONSE" | grep -o '"offline":[0-9]*' | grep -o '[0-9]*' | head -1)
echo "   在线(online): $ONLINE 个"
echo "   待审核(pending): $PENDING 个"
echo "   已拒绝(rejected): $REJECTED 个"
echo "   下架(offline): $OFFLINE 个"
echo ""

# 5. 验证API功能
echo "5️⃣  验证API功能..."
PRODUCTS_RESPONSE=$(curl -s "${BASE_URL}/api/products")
PRODUCT_COUNT=$(echo "$PRODUCTS_RESPONSE" | grep -o '"id":[0-9]*' | wc -l)
echo "   - 获取商品列表: $PRODUCT_COUNT 个商品"

ONLINE_RESPONSE=$(curl -s "${BASE_URL}/api/products?status=online")
ONLINE_COUNT=$(echo "$ONLINE_RESPONSE" | grep -o '"id":[0-9]*' | wc -l)
echo "   - 获取在线商品: $ONLINE_COUNT 个"

PENDING_RESPONSE=$(curl -s "${BASE_URL}/api/products?status=pending")
PENDING_COUNT=$(echo "$PENDING_RESPONSE" | grep -o '"id":[0-9]*' | wc -l)
echo "   - 获取待审核: $PENDING_COUNT 个"
echo ""

# 6. 测试商品详情API
echo "6️⃣  测试商品详情API..."
DETAIL_RESPONSE=$(curl -s "${BASE_URL}/api/products/1")
if echo "$DETAIL_RESPONSE" | grep -q "iPhone 15 Pro Max"; then
  echo "✅ 商品详情API正常"
else
  echo "⚠️  商品详情API异常"
fi
echo ""

# 7. 测试编辑API
echo "7️⃣  测试编辑API..."
EDIT_RESPONSE=$(curl -s -X PUT "${BASE_URL}/api/products/1" \
  -H "Content-Type: application/json" \
  -d '{"price": 9999}')
if echo "$EDIT_RESPONSE" | grep -q "success"; then
  echo "✅ 商品编辑API正常"
else
  echo "⚠️  商品编辑API异常"
fi
echo ""

# 8. 测试审核API
echo "8️⃣  测试审核API..."
AUDIT_RESPONSE=$(curl -s -X PUT "${BASE_URL}/api/products/3/audit" \
  -H "Content-Type: application/json" \
  -d '{"status": "online"}')
if echo "$AUDIT_RESPONSE" | grep -q "success"; then
  echo "✅ 审核API正常"
else
  echo "⚠️  审核API异常"
fi
echo ""

# 9. 运行单元测试
echo "9️⃣  运行单元测试..."
cd backend
npm test -- --silent
if [ $? -eq 0 ]; then
  echo "✅ 所有单元测试通过"
else
  echo "⚠️  部分单元测试失败，请检查"
fi
cd ..
echo ""

echo "========================================"
echo "  验收测试完成！"
echo "========================================"
echo ""
echo "📝 注意事项:"
echo "   - 确保后端服务运行在 http://localhost:3001"
echo "   - 确保前端服务运行在 http://localhost:5173"
echo "   - 查看 DEPLOYMENT_GUIDE.md 获取更多信息"
echo ""
