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
