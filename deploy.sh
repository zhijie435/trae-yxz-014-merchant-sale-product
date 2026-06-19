#!/bin/bash

echo "🚀 开始部署销售商品管理系统..."
echo ""

# 1. 检查 Node.js 环境
echo "🔍 检查环境..."
NODE_VERSION=$(node --version 2>/dev/null)
if [ -z "$NODE_VERSION" ]; then
  echo "❌ Node.js 未安装，请先安装 Node.js (>=18.0.0)"
  exit 1
else
  echo "✅ Node.js 版本: $NODE_VERSION"
fi
echo ""

# 2. 安装后端依赖
echo "📦 安装后端依赖..."
cd backend
npm install
if [ $? -eq 0 ]; then
  echo "✅ 后端依赖安装成功"
else
  echo "❌ 后端依赖安装失败"
  exit 1
fi
echo ""

# 3. 安装前端依赖
echo "📦 安装前端依赖..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
  echo "✅ 前端依赖安装成功"
else
  echo "❌ 前端依赖安装失败"
  exit 1
fi
echo ""

# 4. 补库存
echo "📦 补充库存..."
cd ../backend
node scripts/restock.js
echo ""

# 5. 运行测试
echo "🧪 运行单元测试..."
npm test
if [ $? -eq 0 ]; then
  echo "✅ 测试全部通过"
else
  echo "⚠️  部分测试失败，请检查"
fi
echo ""

echo "========================================"
echo "  部署完成！"
echo "========================================"
echo ""
echo "启动服务:"
echo "  后端: cd backend && npm start"
echo "  前端: cd frontend && npm run dev"
echo ""
echo "访问地址:"
echo "  前端: http://localhost:5173"
echo "  后端: http://localhost:3001"
echo ""
echo "验收测试:"
echo "  bash backend/scripts/acceptance-test.sh"
echo ""
