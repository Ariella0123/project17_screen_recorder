# Web 网页端屏幕录像系统 (WebScreen Studio)

## 📌 项目简介
这是一个基于现代浏览器原生 API (MediaRecorder, getDisplayMedia, IndexedDB) 开发的高性能网页端屏幕录像与视频捕捉系统，采用完全模块化的 JavaScript 编写。

## 🚀 如何运行
由于本系统依赖浏览器的 `getDisplayMedia` 和 `IndexedDB` 安全上下文限制，请通过本地服务器运行：
1. 使用 **VS Code** 打开项目文件夹。
2. 安装并启动 **Live Server** 插件。
3. 点击右下角的 `Go Live` 在浏览器中打开 `http://localhost:5500`。

## 💡 关于 PHP 后端的说明
- **当前版本**：采用 **IndexedDB** 在浏览器本地存储录像，具有零服务器成本、保护隐私的优势。
- **扩展 PHP**：如果您希望将视频保存到远程服务器或实现多设备云端视频库，可以修改 `js/storage.js`，将 `IndexedDB` 的 `add()` 方法替换为 `fetch('upload.php', { method: 'POST', body: formData })`，并在后端编写接收并保存 `.webm` 文件的 PHP 脚本。