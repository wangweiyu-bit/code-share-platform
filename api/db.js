// 简化版数据库 - 使用内存存储（生产环境建议使用真实数据库）
class Database {
  constructor() {
    this.users = [
      {
        id: 1,
        username: 'admin',
        password: '$2a$10$rQJ5cKmH0qYXqYqYqYqYqOqYqYqYqYqYqYqYqYqYqYqYqYqYqYqYq', // admin123
        name: '管理员',
        phone: 'admin',
        role: 'admin',
        level: 'svip',
        status: 'approved'
      }
    ];
    
    this.codes = [
      {
        id: 1,
        title: '示例代码',
        description: '这是一个示例代码',
        code: 'console.log("Hello World");',
        language: 'JavaScript',
        category: '示例',
        requiredLevel: 'normal',
        createTime: new Date().toISOString()
      }
    ];
    
    this.downloads = [];
    this.nextUserId = 2;
    this.nextCodeId = 2;
  }

  // 用户相关
  findUserByUsername(username) {
    return this.users.find(u => u.username === username);
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  createUser(userData) {
    const user = {
      id: this.nextUserId++,
      ...userData,
      status: 'pending',
      level: 'normal',
      role: 'user',
      createTime: new Date().toISOString()
    };
    this.users.push(user);
    return user;
  }

  updateUser(id, updates) {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      return this.users[index];
    }
    return null;
  }

  deleteUser(id) {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  getAllUsers(status = null) {
    if (status) {
      return this.users.filter(u => u.status === status);
    }
    return this.users;
  }

  // 代码相关
  getAllCodes() {
    return this.codes;
  }

  getCodeById(id) {
    return this.codes.find(c => c.id === parseInt(id));
  }

  createCode(codeData) {
    const code = {
      id: this.nextCodeId++,
      ...codeData,
      createTime: new Date().toISOString()
    };
    this.codes.push(code);
    return code;
  }

  updateCode(id, updates) {
    const index = this.codes.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      this.codes[index] = { ...this.codes[index], ...updates };
      return this.codes[index];
    }
    return null;
  }

  deleteCode(id) {
    const index = this.codes.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      this.codes.splice(index, 1);
      return true;
    }
    return false;
  }

  // 下载记录相关
  recordDownload(userId, codeId) {
    this.downloads.push({
      userId,
      codeId,
      downloadTime: new Date().toISOString()
    });
  }

  getDownloadCount(userId) {
    const userDownloads = this.downloads.filter(d => d.userId === userId);
    const uniqueCodes = [...new Set(userDownloads.map(d => d.codeId))];
    return uniqueCodes.length;
  }

  hasDownloaded(userId, codeId) {
    return this.downloads.some(d => d.userId === userId && d.codeId === codeId);
  }
}

module.exports = new Database();
