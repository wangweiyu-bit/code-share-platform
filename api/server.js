const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API 路由
app.use('/api/auth', require('./auth'));
app.use('/api/codes', require('./codes'));
app.use('/api/users', require('./users'));

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 导出 app 供 Vercel 使用
module.exports = app;

// 本地开发时启动服务器
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('管理员账号: admin / admin123');
  });
}
