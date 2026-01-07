// 当前用户
let currentUser = null;
let currentCodeId = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    currentUser = getUser();
    updateUI();
    showPage('home');
});

// 更新UI
function updateUI() {
    if (currentUser) {
        document.getElementById('userInfo').textContent = `欢迎, ${currentUser.name}`;
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline';
        
        if (currentUser.role === 'admin') {
            document.getElementById('adminLink').style.display = 'inline';
        }
    } else {
        document.getElementById('userInfo').textContent = '';
        document.getElementById('loginBtn').style.display = 'inline';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('adminLink').style.display = 'none';
    }
}

// 显示页面
function showPage(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    
    // 显示指定页面
    const pageMap = {
        'home': 'homePage',
        'login': 'loginPage',
        'register': 'registerPage',
        'codes': 'codesPage',
        'codeDetail': 'codeDetailPage',
        'admin': 'adminPage'
    };
    
    const pageId = pageMap[pageName];
    if (pageId) {
        document.getElementById(pageId).style.display = 'block';
    }
    
    // 加载页面数据
    if (pageName === 'codes') {
        loadCodes();
    } else if (pageName === 'admin') {
        if (!currentUser || currentUser.role !== 'admin') {
            alert('需要管理员权限');
            showPage('home');
            return;
        }
        showAdminTab('users');
    }
}

// 登录
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            username: formData.get('username'),
            password: formData.get('password')
        })
    });
    
    if (result.code === 0) {
        saveUser(result.data);
        currentUser = result.data;
        updateUI();
        alert('登录成功！');
        showPage('codes');
    } else {
        alert(result.message || '登录失败');
    }
}

// 注册
async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const result = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            username: formData.get('username'),
            password: formData.get('password'),
            name: formData.get('name'),
            phone: formData.get('phone')
        })
    });
    
    if (result.code === 0) {
        alert('注册成功！请等待管理员审核');
        showPage('login');
    } else {
        alert(result.message || '注册失败');
    }
}

// 退出登录
function handleLogout() {
    logout();
    currentUser = null;
    updateUI();
    showPage('home');
}

// 加载代码列表
async function loadCodes() {
    if (!currentUser) {
        alert('请先登录');
        showPage('login');
        return;
    }
    
    const result = await apiRequest(`/codes/list?userId=${currentUser.id}&userLevel=${currentUser.level}`);
    
    if (result.code === 0) {
        displayCodes(result.data);
    } else {
        alert('加载失败');
    }
}

// 显示代码列表
function displayCodes(codes) {
    const container = document.getElementById('codesList');
    
    if (codes.length === 0) {
        container.innerHTML = '<p class="text-center">暂无代码</p>';
        return;
    }
    
    container.innerHTML = codes.map(code => `
        <div class="code-card" onclick="viewCode(${code.id})">
            <h3>${code.title} ${code.locked ? '🔒' : ''}</h3>
            <p>${code.description || '暂无描述'}</p>
            <div class="code-meta">
                <span class="badge badge-language">${code.language}</span>
                <span class="badge badge-level">${getLevelText(code.requiredLevel)}</span>
                ${code.locked ? '<span class="badge badge-locked">需要升级</span>' : ''}
            </div>
        </div>
    `).join('');
}

// 查看代码详情
async function viewCode(codeId) {
    currentCodeId = codeId;
    
    // 检查下载权限
    const checkResult = await apiRequest(`/codes/check-download?userId=${currentUser.id}&codeId=${codeId}`);
    
    if (checkResult.code === 0 && !checkResult.data.canDownload) {
        alert(`下载次数已用完！\n已下载：${checkResult.data.downloadCount}个\n最大限制：${checkResult.data.maxDownloads}个\n\n升级会员可下载更多文件`);
        return;
    }
    
    // 加载代码详情
    const result = await apiRequest(`/codes/detail/${codeId}`);
    
    if (result.code === 0) {
        displayCodeDetail(result.data, checkResult.data);
        showPage('codeDetail');
    }
}

// 显示代码详情
function displayCodeDetail(code, downloadInfo) {
    const container = document.getElementById('codeDetail');
    
    const ext = getFileExtension(code.language);
    const fileName = `${code.title}.${ext}`;
    
    container.innerHTML = `
        <div class="code-detail">
            <h2>${code.title}</h2>
            <p>${code.description || '暂无描述'}</p>
            <div class="code-meta">
                <span class="badge badge-language">${code.language}</span>
                <span class="badge badge-level">${getLevelText(code.requiredLevel)}</span>
            </div>
            
            <div class="download-info">
                <p><strong>已下载文件：</strong>${downloadInfo.downloadCount} / ${downloadInfo.maxDownloads === -1 ? '不限' : downloadInfo.maxDownloads}</p>
                <p><strong>剩余可下载：</strong>${downloadInfo.remainingDownloads}</p>
                <p style="font-size:0.9rem;margin-top:1rem;">💡 ${downloadInfo.hasDownloaded ? '此文件已下载过，可重复下载' : '点击下载将消耗1次下载次数'}</p>
            </div>
            
            <div class="file-preview">
                <div class="file-icon">📄</div>
                <h3>${fileName}</h3>
                <p>代码文件</p>
                <button onclick="downloadCode()" class="btn btn-primary mt-2">📋 复制到剪贴板</button>
                <p style="margin-top:1rem;color:#666;">点击后代码将复制到剪贴板<br>然后可以粘贴到代码编辑器中</p>
            </div>
        </div>
    `;
}

// 下载代码
async function downloadCode() {
    const code = await apiRequest(`/codes/detail/${currentCodeId}`);
    
    if (code.code !== 0) {
        alert('获取代码失败');
        return;
    }
    
    // 记录下载
    const result = await apiRequest('/codes/download', {
        method: 'POST',
        body: JSON.stringify({
            userId: currentUser.id,
            codeId: currentCodeId
        })
    });
    
    if (result.code === 0) {
        // 复制到剪贴板
        navigator.clipboard.writeText(code.data.code).then(() => {
            const ext = getFileExtension(code.data.language);
            const fileName = `${code.data.title}.${ext}`;
            alert(`下载成功！\n\n文件"${fileName}"已复制到剪贴板\n\n使用方法：\n1. 打开代码编辑器\n2. 新建文件并粘贴（Ctrl+V）\n3. 保存为 ${fileName}\n\n剩余可下载：${result.data.remainingDownloads}`);
        }).catch(() => {
            alert('复制失败，请手动复制代码');
        });
    } else {
        alert(result.message || '下载失败');
    }
}

// 管理后台
function showAdminTab(tab) {
    // 更新标签样式
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => {
        if (t.textContent.includes(tab === 'users' ? '用户管理' : '代码管理')) {
            t.classList.add('active');
        }
    });
    
    if (tab === 'users') {
        loadUsers();
    } else if (tab === 'codes') {
        loadAdminCodes();
    }
}

// 加载用户列表
async function loadUsers() {
    const result = await apiRequest('/users/all');
    
    if (result.code === 0) {
        displayUsers(result.data);
    }
}

// 显示用户列表
function displayUsers(users) {
    const container = document.getElementById('adminContent');
    
    container.innerHTML = `
        <h3>用户管理</h3>
        <table>
            <thead>
                <tr>
                    <th>用户名</th>
                    <th>姓名</th>
                    <th>手机号</th>
                    <th>等级</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.name}</td>
                        <td>${user.phone}</td>
                        <td>${getLevelText(user.level)}</td>
                        <td>${getStatusText(user.status)}</td>
                        <td>
                            ${user.status === 'pending' ? `
                                <button onclick="auditUser(${user.id}, 'approved')" class="btn btn-primary" style="padding:0.3rem 0.8rem;font-size:0.9rem;">通过</button>
                                <button onclick="auditUser(${user.id}, 'rejected')" class="btn btn-secondary" style="padding:0.3rem 0.8rem;font-size:0.9rem;">拒绝</button>
                            ` : ''}
                            <button onclick="changeLevel(${user.id})" class="btn btn-secondary" style="padding:0.3rem 0.8rem;font-size:0.9rem;">改权限</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// 审核用户
async function auditUser(userId, status) {
    const result = await apiRequest('/users/audit', {
        method: 'POST',
        body: JSON.stringify({ userId, status })
    });
    
    if (result.code === 0) {
        alert('审核成功');
        loadUsers();
    } else {
        alert('操作失败');
    }
}

// 修改权限
async function changeLevel(userId) {
    const level = prompt('请输入权限等级：\nnormal - 普通用户\nvip - 会员\nsvip - 超级会员');
    
    if (!level || !['normal', 'vip', 'svip'].includes(level)) {
        alert('无效的权限等级');
        return;
    }
    
    const result = await apiRequest('/users/update-level', {
        method: 'POST',
        body: JSON.stringify({ userId, level })
    });
    
    if (result.code === 0) {
        alert('权限更新成功');
        loadUsers();
    } else {
        alert('操作失败');
    }
}

// 加载管理员代码列表
async function loadAdminCodes() {
    const result = await apiRequest('/codes/list?userLevel=svip');
    
    if (result.code === 0) {
        displayAdminCodes(result.data);
    }
}

// 显示管理员代码列表
function displayAdminCodes(codes) {
    const container = document.getElementById('adminContent');
    
    container.innerHTML = `
        <h3>代码管理</h3>
        <button onclick="addCode()" class="btn btn-primary mb-2">添加代码</button>
        <table>
            <thead>
                <tr>
                    <th>标题</th>
                    <th>语言</th>
                    <th>权限</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                ${codes.map(code => `
                    <tr>
                        <td>${code.title}</td>
                        <td>${code.language}</td>
                        <td>${getLevelText(code.requiredLevel)}</td>
                        <td>
                            <button onclick="deleteCode(${code.id})" class="btn btn-secondary" style="padding:0.3rem 0.8rem;font-size:0.9rem;">删除</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// 添加代码
function addCode() {
    const title = prompt('代码标题：');
    if (!title) return;
    
    const description = prompt('代码描述：');
    const code = prompt('代码内容：');
    const language = prompt('编程语言（如：JavaScript）：') || 'JavaScript';
    const requiredLevel = prompt('所需权限（normal/vip/svip）：') || 'normal';
    
    apiRequest('/codes/add', {
        method: 'POST',
        body: JSON.stringify({
            title,
            description,
            code,
            language,
            category: '其他',
            requiredLevel
        })
    }).then(result => {
        if (result.code === 0) {
            alert('添加成功');
            loadAdminCodes();
        } else {
            alert('添加失败');
        }
    });
}

// 删除代码
async function deleteCode(id) {
    if (!confirm('确定要删除吗？')) return;
    
    const result = await apiRequest(`/codes/delete/${id}`, {
        method: 'DELETE'
    });
    
    if (result.code === 0) {
        alert('删除成功');
        loadAdminCodes();
    } else {
        alert('删除失败');
    }
}

// 工具函数
function getLevelText(level) {
    const map = {
        'normal': '普通用户',
        'vip': '会员',
        'svip': '超级会员'
    };
    return map[level] || level;
}

function getStatusText(status) {
    const map = {
        'pending': '待审核',
        'approved': '已通过',
        'rejected': '已拒绝'
    };
    return map[status] || status;
}

function getFileExtension(language) {
    const map = {
        'JavaScript': 'js',
        'Python': 'py',
        'Java': 'java',
        'C++': 'cpp',
        'Go': 'go',
        'PHP': 'php',
        'HTML': 'html',
        'CSS': 'css',
        'SQL': 'sql'
    };
    return map[language] || 'txt';
}
