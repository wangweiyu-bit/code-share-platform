const express = require('express');
const router = express.Router();
const db = require('./db');

// 获取代码列表
router.get('/list', (req, res) => {
  const { userId, userLevel } = req.query;
  
  const codes = db.getAllCodes().map(code => {
    const levelOrder = { normal: 1, vip: 2, svip: 3 };
    const userLevelValue = levelOrder[userLevel] || 0;
    const codeLevelValue = levelOrder[code.requiredLevel] || 0;
    
    return {
      ...code,
      locked: userLevelValue < codeLevelValue
    };
  });
  
  res.json({
    code: 0,
    data: codes
  });
});

// 获取代码详情
router.get('/detail/:id', (req, res) => {
  const code = db.getCodeById(req.params.id);
  
  if (!code) {
    return res.json({ code: 1, message: '代码不存在' });
  }
  
  res.json({
    code: 0,
    data: code
  });
});

// 检查下载权限
router.get('/check-download', (req, res) => {
  const { userId, codeId } = req.query;
  
  const user = db.findUserById(parseInt(userId));
  if (!user) {
    return res.json({ code: 1, message: '用户不存在' });
  }
  
  const downloadCount = db.getDownloadCount(parseInt(userId));
  const hasDownloaded = db.hasDownloaded(parseInt(userId), parseInt(codeId));
  
  const maxDownloads = user.level === 'normal' ? 1 : user.level === 'vip' ? 2 : -1;
  const canDownload = hasDownloaded || maxDownloads === -1 || downloadCount < maxDownloads;
  
  res.json({
    code: 0,
    data: {
      downloadCount,
      maxDownloads,
      remainingDownloads: maxDownloads === -1 ? '不限' : Math.max(0, maxDownloads - downloadCount),
      canDownload,
      hasDownloaded,
      userLevel: user.level
    }
  });
});

// 记录下载
router.post('/download', (req, res) => {
  const { userId, codeId } = req.body;
  
  const user = db.findUserById(parseInt(userId));
  if (!user) {
    return res.json({ code: 1, message: '用户不存在' });
  }
  
  const downloadCount = db.getDownloadCount(parseInt(userId));
  const hasDownloaded = db.hasDownloaded(parseInt(userId), parseInt(codeId));
  
  const maxDownloads = user.level === 'normal' ? 1 : user.level === 'vip' ? 2 : -1;
  
  if (!hasDownloaded && maxDownloads !== -1 && downloadCount >= maxDownloads) {
    return res.json({
      code: 2,
      message: `下载次数已达上限（${maxDownloads}次）`
    });
  }
  
  if (!hasDownloaded) {
    db.recordDownload(parseInt(userId), parseInt(codeId));
  }
  
  const newCount = db.getDownloadCount(parseInt(userId));
  
  res.json({
    code: 0,
    message: '下载成功',
    data: {
      downloadCount: newCount,
      maxDownloads,
      remainingDownloads: maxDownloads === -1 ? '不限' : Math.max(0, maxDownloads - newCount)
    }
  });
});

// 添加代码（管理员）
router.post('/add', (req, res) => {
  const code = db.createCode(req.body);
  res.json({ code: 0, data: code });
});

// 更新代码（管理员）
router.put('/update/:id', (req, res) => {
  const code = db.updateCode(req.params.id, req.body);
  if (!code) {
    return res.json({ code: 1, message: '代码不存在' });
  }
  res.json({ code: 0, data: code });
});

// 删除代码（管理员）
router.delete('/delete/:id', (req, res) => {
  const success = db.deleteCode(req.params.id);
  if (!success) {
    return res.json({ code: 1, message: '代码不存在' });
  }
  res.json({ code: 0, message: '删除成功' });
});

module.exports = router;
