const express = require('express');
const router = express.Router();
const db = require('./db');

// 获取待审核用户
router.get('/pending', (req, res) => {
  const users = db.getAllUsers('pending');
  res.json({ code: 0, data: users });
});

// 获取所有用户
router.get('/all', (req, res) => {
  const { status } = req.query;
  const users = db.getAllUsers(status || null);
  res.json({ code: 0, data: users });
});

// 审核用户
router.post('/audit', (req, res) => {
  const { userId, status } = req.body;
  const user = db.updateUser(parseInt(userId), { status });
  
  if (!user) {
    return res.json({ code: 1, message: '用户不存在' });
  }
  
  res.json({ code: 0, message: '审核成功', data: user });
});

// 更新用户权限
router.post('/update-level', (req, res) => {
  const { userId, level } = req.body;
  const user = db.updateUser(parseInt(userId), { level });
  
  if (!user) {
    return res.json({ code: 1, message: '用户不存在' });
  }
  
  res.json({ code: 0, message: '权限更新成功', data: user });
});

// 删除用户
router.delete('/delete/:id', (req, res) => {
  const success = db.deleteUser(parseInt(req.params.id));
  
  if (!success) {
    return res.json({ code: 1, message: '用户不存在' });
  }
  
  res.json({ code: 0, message: '删除成功' });
});

module.exports = router;
