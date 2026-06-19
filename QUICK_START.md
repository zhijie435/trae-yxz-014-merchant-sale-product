# 销售商品管理系统 - 快速启动指南

## 🚀 快速开始

### 一键部署（推荐）

```bash
# 在项目根目录执行
chmod +x deploy.sh
./deploy.sh
```

这个脚本会自动：
1. 检查 Node.js 环境
2. 安装后端依赖
3. 安装前端依赖
4. 补充库存数据
5. 运行单元测试

### 手动启动

```bash
# 终端1: 启动后端
cd backend
npm start
# 输出: 🚀 服务器已启动: http://localhost:3001

# 终端2: 启动前端
cd frontend
npm run dev
# 输出: VITE v5.0.0 ready in xxx ms
#       ➜  Local: http://localhost:5173/
```

## 📦 补库存

```bash
cd backend
node scripts/restock.js
```

**当前库存状态**:
```
总库存: 2563 件
商品种类: 12 种

商品ID  | 商品名称                    | 当前库存
-------|---------------------------|--------
1      | iPhone 15 Pro Max         | 256
2      | MacBook Pro 14寸          | 92
3      | AirPods Pro 2代           | 289
4      | iPad Pro 12.9寸           | 53
5      | Apple Watch Ultra 2       | 80
6      | Magic Keyboard            | 158
7      | MagSafe 充电器            | 534
8      | iPhone 14                 | 167
9      | Sony WH-1000XM5           | 192
10     | Samsung Galaxy S24 Ultra  | 198
11     | Nintendo Switch OLED      | 105
12     | 小米手环8 Pro             | 439
```

## 👤 审核账号

| 角色 | 账号 | 密码 | 权限 |
|------|------|------|------|
| 超级管理员 | admin | Admin@2024 | 全部权限 |
| 审核员 | auditor | Audit@2024 | 审核商品 |
| 运营专员 | operator | Operate@2024 | 编辑商品 |

## ✅ 验收命令

### 基础验收

```bash
# 1. 检查服务状态
curl http://localhost:3001/api/health

# 2. 获取商品列表
curl http://localhost:3001/api/products

# 3. 获取统计信息
curl http://localhost:3001/api/products/stats

# 4. 运行测试
cd backend && npm test
```

### 完整验收测试

```bash
# 运行自动化验收脚本
bash backend/scripts/acceptance-test.sh
```

**验收脚本会检查**:
- ✅ 后端服务状态
- ✅ 商品数据完整性
- ✅ 库存充足性
- ✅ 商品状态分布
- ✅ API 功能正常
- ✅ 单元测试通过

### API 功能测试

```bash
# 获取单个商品
curl http://localhost:3001/api/products/1

# 编辑商品价格
curl -X PUT http://localhost:3001/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 9499}'

# 库存扣减
curl -X POST http://localhost:3001/api/products/1/deduct-stock \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'

# 审核商品
curl -X PUT http://localhost:3001/api/products/3/audit \
  -H "Content-Type: application/json" \
  -d '{"status": "online"}'
```

## 📊 商品状态

| 状态 | 值 | 说明 | 数量 |
|------|-----|------|------|
| 在线 | online | 可销售 | 4 |
| 待审核 | pending | 等待审核 | 3 |
| 已拒绝 | rejected | 审核未通过 | 2 |
| 下架 | offline | 主动下架 | 3 |

## 🎯 核心功能

- [x] 商品列表展示
- [x] 商品信息编辑（名称、品牌、价格）
- [x] 库存管理（查看、扣减、补货）
- [x] 审核流程（通过、拒绝）
- [x] 商品筛选和搜索
- [x] 数据统计
- [x] 单元测试（24个测试用例）

## 📱 访问地址

- **前端界面**: http://localhost:5173
- **后端API**: http://localhost:3001
- **健康检查**: http://localhost:3001/api/health
- **商品列表**: http://localhost:3001/api/products
- **统计信息**: http://localhost:3001/api/products/stats

## 🐛 常见问题

### Q: 端口被占用？
```bash
# 查找占用端口的进程
lsof -ti:3001
lsof -ti:5173

# 或修改端口
# 后端: 修改 backend/server.js 中的 PORT
# 前端: 修改 frontend/vite.config.js
```

### Q: 测试失败？
```bash
# 清除缓存后重试
cd backend
rm -rf node_modules/.cache
npm test
```

### Q: 库存数据丢失？
```bash
# 重新补充库存
cd backend
node scripts/restock.js
```

## 📚 完整文档

查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 获取详细的：
- 项目结构说明
- 图片素材配置
- 审核流程详解
- 验收清单
- 部署最佳实践

---

**版本**: v1.0
**更新时间**: 2024-01-20
**测试覆盖率**: 68.51%
**单元测试**: 24/24 通过 ✓
