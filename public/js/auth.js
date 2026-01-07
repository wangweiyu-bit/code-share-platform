// API 基础URL
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// 保存用户信息到 localStorage
function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// 获取用户信息
function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// 退出登录
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// 检查是否登录
function checkAuth() {
    const user = getUser();
    if (!user) {
        alert('请先登录');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// 检查是否是管理员
function checkAdmin() {
    const user = getUser();
    if (!user || user.role !== 'admin') {
        alert('需要管理员权限');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// API 请求封装
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(`${API_URL}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        return await response.json();
    } catch (error) {
        console.error('API请求失败:', error);
        return { code: -1, message: '网络错误' };
    }
}
