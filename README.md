# 代码分享平台 - 网页版

## 📁 完整项目结构

```
web/
├── package.json          ✅ 已创建
├── vercel.json          ✅ 已创建
├── api/                 
│   ├── server.js        ✅ 已创建
│   ├── db.js            ✅ 已创建
│   ├── auth.js          ✅ 已创建
│   ├── codes.js         ✅ 已创建
│   └── users.js         ✅ 已创建
├── public/             
│   ├── index.html       ✅ 已创建
│   ├── login.html       ⬜ 需要创建
│   ├── register.html    ⬜ 需要创建
│   ├── codes.html       ⬜ 需要创建
│   ├── code-detail.html ⬜ 需要创建
│   ├── admin.html       ⬜ 需要创建
│   ├── css/
│   │   └── style.css    ⬜ 需要创建
│   └── js/
│       ├── auth.js      ⬜ 需要创建
│       ├── app.js       ⬜ 需要创建
│       └── admin.js     ⬜ 需要创建
└── README.md            ✅ 本文件
```

## 🚀 快速开始

### 方式1：本地运行（测试用）

```bash
# 1. 进入 web 文件夹
cd web

# 2. 安装依赖
npm install

# 3. 启动服务器
npm start

# 4. 打开浏览器访问
http://localhost:3000
```

### 方式2：部署到 Vercel（推荐）

1. 将 web 文件夹上传到 GitHub
2. 在 Vercel 导入项目
3. 自动部署完成

## 📝 剩余文件内容

由于文件较多，我已经创建了核心的后端文件。前端文件内容较简单，你可以：

### 选项A：使用我提供的模板
我会继续创建剩余的HTML/CSS/JS文件

### 选项B：使用现成的前端框架
使用 Bootstrap 或 Tailwind CSS 快速搭建界面

### 选项C：简化版本
只保留核心功能，减少文件数量

## 🔑 默认账号

- 用户名：admin
- 密码：admin123
- 角色：管理员

## 💡 核心功能

### 已实现（后端）
- ✅ 用户注册/登录
- ✅ 用户审核
- ✅ 权限管理
- ✅ 代码列表
- ✅ 代码详情
- ✅ 下载限制
- ✅ 下载记录

### 需要前端页面
- ⬜ 登录页面
- ⬜ 注册页面
- ⬜ 代码列表页面
- ⬜ 代码详情页面
- ⬜ 管理后台页面

## 📊 API 接口

### 认证相关
- POST `/api/auth/login` - 登录
- POST `/api/auth/register` - 注册

### 代码相关
- GET `/api/codes/list` - 获取代码列表
- GET `/api/codes/detail/:id` - 获取代码详情
- GET `/api/codes/check-download` - 检查下载权限
- POST `/api/codes/download` - 记录下载
- POST `/api/codes/add` - 添加代码（管理员）
- PUT `/api/codes/update/:id` - 更新代码（管理员）
- DELETE `/api/codes/delete/:id` - 删除代码（管理员）

### 用户相关
- GET `/api/users/pending` - 获取待审核用户
- GET `/api/users/all` - 获取所有用户
- POST `/api/users/audit` - 审核用户
- POST `/api/users/update-level` - 更新用户权限
- DELETE `/api/users/delete/:id` - 删除用户

## 🎨 下一步

请告诉我：
1. 是否需要我继续创建剩余的前端文件？
2. 或者你想先测试后端API是否正常工作？
3. 或者你想要一个更简化的版本？

---

**当前进度：** 后端完成 100%，前端完成 10%
