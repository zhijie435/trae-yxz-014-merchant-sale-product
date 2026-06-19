# 销售商品管理系统部署指南

## 一、项目结构

```
014-门店端销售商品管理/
├── backend/              # 后端服务
│   ├── data/
│   │   └── products.js  # 商品数据
│   ├── routes/
│   │   └── products.js  # API路由
│   ├── tests/
│   │   └── product.test.js
│   ├── server.js        # 服务入口
│   └── package.json
├── frontend/             # 前端应用
│   ├── src/
│   │   ├── api/
│   │   │   └── product.js
│   │   ├── components/
│   │   │   ├── ProductCard.vue
│   │   │   ├── ProductFilterBar.vue
│   │   │   ├── ProductForm.vue
│   │   │   ├── ProductList.vue
│   │   │   ├── ProductListPage.vue
│   │   │   └── EditProductModal.vue
│   │   ├── styles/
│   │   │   └── main.css
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 二、补库存种子数据

### 2.1 库存补充脚本

创建 `backend/scripts/restock.js`:

```javascript
// 补库存种子脚本
// 运行命令: node scripts/restock.js

import products from '../data/products.js';

const restockData = [
  { id: 1, addStock: 100, reason: '补货' },
  { id: 2, addStock: 50, reason: '补货' },
  { id: 3, addStock: 200, reason: '促销活动备货' },
  { id: 4, addStock: 30, reason: '补货' },
  { id: 5, addStock: 80, reason: '新品到货' },
  { id: 6, addStock: 150, reason: '补货' },
  { id: 7, addStock: 300, reason: '批量补货' },
  { id: 8, addStock: 100, reason: '补货' },
  { id: 9, addStock: 80, reason: '补货' },
  { id: 10, addStock: 120, reason: '补货' },
  { id: 11, addStock: 60, reason: '补货' },
  { id: 12, addStock: 250, reason: '批量补货' }
];

function restock() {
  console.log('📦 开始补库存...\n');

  restockData.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      const oldStock = product.stock;
      product.stock += item.addStock;
      console.log(`✅ 商品ID: ${item.id} | ${product.name}`);
      console.log(`   库存: ${oldStock} → ${product.stock} (+${item.addStock})`);
      console.log(`   原因: ${item.reason}\n`);
    } else {
      console.log(`❌ 商品ID: ${item.id} 未找到\n`);
    }
  });

  console.log('📊 补库存完成!');
  console.log('\n总库存统计:');
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  console.log(`   总库存数量: ${totalStock}`);
  console.log(`   商品种类: ${products.length}`);
}

restock();
```

### 2.2 运行补库存

```bash
cd backend
node scripts/restock.js
```

**预期输出**:
```
📦 开始补库存...

✅ 商品ID: 1 | iPhone 15 Pro Max 256GB 钛金属边框 A17 Pro芯片
   库存: 156 → 256 (+100)
   原因: 补货

✅ 商品ID: 2 | MacBook Pro 14寸 M3 Pro芯片 18GB+512GB 深空黑
   库存: 42 → 92 (+50)
   原因: 补货

... (其他商品)

📊 补库存完成!

总库存统计:
   总库存数量: 2155
   商品种类: 12
```

## 三、图片素材配置

### 3.1 当前使用的图片CDN

本系统使用 Unsplash 图片素材，所有商品图片均为真实可访问的CDN链接：

| 商品ID | 商品名称 | 图片数量 |
|--------|---------|---------|
| 1 | iPhone 15 Pro Max | 3张 |
| 2 | MacBook Pro 14寸 | 2张 |
| 3 | AirPods Pro 2代 | 2张 |
| 4 | iPad Pro 12.9寸 | 1张 |
| 5 | Apple Watch Ultra 2 | 1张 |
| 6 | Magic Keyboard | 1张 |
| 7 | MagSafe 充电器 | 1张 |
| 8 | iPhone 14 | 1张 |
| 9 | Sony WH-1000XM5 | 2张 |
| 10 | Samsung Galaxy S24 Ultra | 1张 |
| 11 | Nintendo Switch OLED | 1张 |
| 12 | 小米手环8 Pro | 1张 |

### 3.2 图片替换说明

如需替换为本地图片，按以下步骤操作：

1. 将图片文件放入 `frontend/public/images/products/` 目录
2. 修改 `backend/data/products.js` 中的 `images` 数组
3. 更新为本地路径：`/images/products/xxx.jpg`

**示例**:
```javascript
images: [
  '/images/products/iphone-15-pro-1.jpg',
  '/images/products/iphone-15-pro-2.jpg',
  '/images/products/iphone-15-pro-3.jpg'
]
```

### 3.3 推荐图片源

- **Unsplash**: https://unsplash.com (免费高清素材)
- **Pexels**: https://www.pexels.com (免费商业图片)
- **Pixabay**: https://pixabay.com (免费图片素材)

**搜索关键词示例**:
- 苹果产品: `apple iphone macbook ipad`
- 数码配件: `electronics gadget accessories`
- 智能穿戴: `smartwatch fitness tracker`

## 四、审核账号配置

### 4.1 管理员账号

| 角色 | 账号 | 密码 | 权限说明 |
|------|------|------|---------|
| 超级管理员 | admin | Admin@2024 | 可审核所有商品、编辑、删除 |
| 审核员 | auditor | Audit@2024 | 仅可审核商品、查看详情 |
| 运营专员 | operator | Operate@2024 | 可编辑商品信息、补充库存 |

### 4.2 审核状态说明

| 状态 | 值 | 说明 |
|------|-----|------|
| 待审核 | pending | 新增/修改的商品需要审核 |
| 已通过 | online | 审核通过的商品，可正常销售 |
| 已拒绝 | rejected | 审核未通过，需修改后重新提交 |
| 已下架 | offline | 主动下架的商品，可重新上架 |

### 4.3 审核流程

```
商品提交 → 运营专员编辑
    ↓
审核员审核
    ↓
    ├── 通过 → 商品上架(online)
    │
    └── 拒绝 → 修改后重新提交
              ↓
          再次审核
```

### 4.4 账号权限配置

创建 `backend/data/users.js`:

```javascript
// 用户数据
export default [
  {
    id: 1,
    username: 'admin',
    password: 'Admin@2024',
    role: 'super_admin',
    permissions: ['read', 'write', 'delete', 'audit', 'approve']
  },
  {
    id: 2,
    username: 'auditor',
    password: 'Audit@2024',
    role: 'auditor',
    permissions: ['read', 'audit']
  },
  {
    id: 3,
    username: 'operator',
    password: 'Operate@2024',
    role: 'operator',
    permissions: ['read', 'write', 'restock']
  }
];
```

### 4.5 登录验证API

**POST** `/api/auth/login`

**请求体**:
```json
{
  "username": "admin",
  "password": "Admin@2024"
}
```

**响应**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "super_admin",
    "permissions": ["read", "write", "delete", "audit", "approve"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 五、验收命令

### 5.1 环境检查

```bash
# 检查 Node.js 版本
node --version
# 要求: >= 18.0.0

# 检查 npm 版本
npm --version
# 要求: >= 9.0.0
```

### 5.2 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 5.3 启动服务

```bash
# 终端1: 启动后端服务
cd backend
npm start
# 输出: 🚀 服务器已启动: http://localhost:3001

# 终端2: 启动前端服务
cd frontend
npm run dev
# 输出: VITE v5.0.0 ready in xxx ms
#       ➜  Local: http://localhost:5173/
```

### 5.4 运行测试

```bash
cd backend

# 运行所有测试
npm test

# 带覆盖率报告
npm test -- --coverage

# 监视模式
npm run test:watch
```

**预期测试结果**:
```
Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
```

### 5.5 API 接口验收

#### 5.5.1 健康检查

```bash
curl http://localhost:3001/api/health
```

**预期响应**:
```json
{
  "status": "ok",
  "message": "服务器运行正常"
}
```

#### 5.5.2 获取商品列表

```bash
curl http://localhost:3001/api/products
```

**预期响应**:
```json
{
  "success": true,
  "count": 12,
  "data": [...]
}
```

#### 5.5.3 获取单个商品

```bash
curl http://localhost:3001/api/products/1
```

**预期响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro Max 256GB 钛金属边框 A17 Pro芯片",
    "brand": "Apple",
    "price": 9999,
    "status": "online",
    "stock": 256,
    ...
  }
}
```

#### 5.5.4 编辑商品

```bash
curl -X PUT http://localhost:3001/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 9499, "stock": 200}'
```

**预期响应**:
```json
{
  "success": true,
  "message": "商品更新成功",
  "data": {
    "id": 1,
    "price": 9499,
    "stock": 200,
    ...
  }
}
```

#### 5.5.5 库存扣减

```bash
curl -X POST http://localhost:3001/api/products/1/deduct-stock \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

**预期响应**:
```json
{
  "success": true,
  "message": "库存扣减成功",
  "data": {
    "productId": 1,
    "deductedQty": 5,
    "remainingStock": 195,
    "soldQty": 239
  }
}
```

#### 5.5.6 审核商品

```bash
# 审核通过
curl -X PUT http://localhost:3001/api/products/3/audit \
  -H "Content-Type: application/json" \
  -d '{"status": "online"}'

# 审核拒绝
curl -X PUT http://localhost:3001/api/products/5/audit \
  -H "Content-Type: application/json" \
  -d '{"status": "rejected"}'
```

**预期响应**:
```json
{
  "success": true,
  "message": "审核状态更新成功",
  "data": {
    "id": 3,
    "status": "online",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

#### 5.5.7 获取统计信息

```bash
curl http://localhost:3001/api/products/stats
```

**预期响应**:
```json
{
  "success": true,
  "data": {
    "totalProducts": 12,
    "totalStock": 2155,
    "totalSold": 5383,
    "statusBreakdown": {
      "online": 4,
      "pending": 3,
      "rejected": 2,
      "offline": 3
    }
  }
}
```

### 5.6 完整验收流程

创建验收脚本 `backend/scripts/acceptance-test.js`:

```bash
#!/bin/bash

echo "========================================"
echo "  销售商品管理系统 - 验收测试"
echo "========================================"
echo ""

# 1. 检查服务状态
echo "1️⃣  检查服务状态..."
curl -s http://localhost:3001/api/health | grep -q "ok" && echo "✅ 后端服务正常" || echo "❌ 后端服务异常"
echo ""

# 2. 检查商品数量
echo "2️⃣  检查商品数据..."
COUNT=$(curl -s http://localhost:3001/api/products | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
if [ "$COUNT" -eq 12 ]; then
  echo "✅ 商品数据完整 (共 $COUNT 个商品)"
else
  echo "⚠️  商品数量异常 (期望12个，实际$COUNT个)"
fi
echo ""

# 3. 检查库存
echo "3️⃣  检查总库存..."
STOCK=$(curl -s http://localhost:3001/api/products/stats | grep -o '"totalStock":[0-9]*' | grep -o '[0-9]*')
echo "📦 总库存: $STOCK"
if [ "$STOCK" -ge 2000 ]; then
  echo "✅ 库存充足"
else
  echo "⚠️  库存偏低，建议补充"
fi
echo ""

# 4. 运行单元测试
echo "4️⃣  运行单元测试..."
cd backend
npm test -- --silent
echo ""

# 5. 验证API功能
echo "5️⃣  验证API功能..."
echo "   - 获取商品列表: $(curl -s http://localhost:3001/api/products | grep -c '"id"') 个商品"
echo "   - 获取在线商品: $(curl -s 'http://localhost:3001/api/products?status=online' | grep -c '"id"') 个"
echo "   - 获取待审核: $(curl -s 'http://localhost:3001/api/products?status=pending' | grep -c '"id"') 个"
echo ""

echo "========================================"
echo "  验收测试完成！"
echo "========================================"
```

**运行验收测试**:
```bash
chmod +x backend/scripts/acceptance-test.sh
./backend/scripts/acceptance-test.sh
```

### 5.7 前端功能验收

1. **商品列表页面**: http://localhost:5173
   - [ ] 显示所有商品卡片
   - [ ] 筛选功能正常
   - [ ] 搜索功能正常

2. **商品编辑**: 点击编辑按钮
   - [ ] 可修改商品名称、品牌、价格
   - [ ] 可调整库存数量
   - [ ] 保存后显示更新

3. **库存管理**:
   - [ ] 可查看当前库存
   - [ ] 可扣减库存
   - [ ] 库存不足时提示

4. **审核功能**:
   - [ ] 待审核商品显示
   - [ ] 可通过/拒绝审核
   - [ ] 审核后状态更新

## 六、快速部署命令

### 一键部署脚本

创建 `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 开始部署销售商品管理系统..."
echo ""

# 1. 安装后端依赖
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

# 2. 安装前端依赖
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

# 3. 补库存
echo "📦 补充库存..."
cd ../backend
node scripts/restock.js
echo ""

# 4. 运行测试
echo "🧪 运行测试..."
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
```

**使用方式**:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 七、验收清单

### 基础功能
- [ ] 后端服务启动成功
- [ ] 前端页面加载正常
- [ ] 商品列表显示完整
- [ ] 商品详情查看正常

### 核心功能
- [ ] 商品编辑功能正常
- [ ] 库存扣减逻辑正确
- [ ] 审核状态切换正常
- [ ] 数据统计准确

### 性能指标
- [ ] 页面加载时间 < 2秒
- [ ] API响应时间 < 500ms
- [ ] 测试覆盖率 > 70%

### 安全检查
- [ ] CORS 配置正确
- [ ] 输入验证正常
- [ ] 错误处理完善

---

**文档版本**: v1.0
**最后更新**: 2024-01-20
**维护者**: 技术团队
