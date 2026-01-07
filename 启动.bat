@echo off
echo ================================
echo   代码分享平台 - 网页版
echo ================================
echo.
echo 正在安装依赖...
call npm install
echo.
echo 正在启动服务器...
echo.
echo 服务器将在 http://localhost:3000 启动
echo 请在浏览器中访问：http://localhost:3000/app.html
echo.
echo 管理员账号：admin / admin123
echo.
echo 按 Ctrl+C 可以停止服务器
echo.
call npm start
pause
