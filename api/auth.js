const express = require('express');
const router = express.Router();
const db = require('./db');

function verifyPassword(input, stored) {
  // 直接比较密码
  return input === stored;
}


// 登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = db.findUserByUsername(username);
  
  if (!user) {
    return res.json({ code: 1, message: '用户不存在' });
  }
  
  if (!verifyPassword(password, user.password)) {
    return res.json({ code: 1, message: '密码错误' });
  }
  
  if (user.status !== 'approved' && user.role !== 'admin') {
    return res.json({ code: 1, message: '账号待审核' });
  }
  
  // 返回用户信息（不包含密码）
  const { password: _, ...userInfo } = user;
  
  res.json({
    code: 0,
    message: '登录成功',
    data: userInfo
  });
});

// 注册
router.post('/register', (req, res) => {
  const { username, password, name, phone } = req.body;
  
  if (db.findUserByUsername(username)) {
    return res.json({ code: 1, message: '用户名已存在' });
  }
  
  const user = db.createUser({
    username,
    password, // 生产环境应该加密
    name,
    phone
  });
  
  res.json({
    code: 0,
    message: '注册成功，请等待管理员审核',
    data: { id: user.id }
  });
});

module.exports = router;

