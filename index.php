<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web 网页端屏幕录像系统</title>
    <!-- 引入样式文件 -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/components.css">
</head>
<body>
    <div class="app-container">
        <!-- 顶部导航栏 -->
        <header class="app-header">
            <div class="logo-area">
                <span class="logo-icon">🎥</span>
                <h1>WebScreen Studio</h1>
            </div>
            <div class="header-actions">
                <button id="library-btn" class="btn secondary">📂 录像库</button>
                <button id="settings-btn" class="btn secondary">⚙️ 设置</button>
            </div>
        </header>

        <!-- 主体仪表盘 -->
        <main class="dashboard">
            <!-- 预览区域 -->
            <section class="preview-section">
                <div class="preview-container">
                    <video id="screen-preview" autoplay muted playsinline></video>
                    <div id="webcam-container" class="webcam-pip draggable" style="display: none;">
                        <video id="webcam-preview" autoplay muted playsinline></video>
                    </div>
                    <div class="status-overlay">
                        <span id="recording-status-dot" class="dot"></span>
                        <span id="recording-status-text">就绪</span>
                        <span id="recording-timer">00:00:00</span>
                    </div>
                </div>
            </section>

            <!-- 控制面板 -->
            <section class="control-panel">
                <div class="control-group">
                    <button id="select-screen-btn" class="btn primary">🖥️ 选择屏幕</button>
                    <button id="toggle-webcam-btn" class="btn secondary" disabled>📷 摄像头</button>
                    <button id="toggle-mic-btn" class="btn secondary">🎤 麦克风</button>
                    <button id="studio-mode-btn" class="btn secondary">🎬 艺术画中画模式</button>
                </div>
                <div class="control-group primary-controls">
                    <button id="start-recording-btn" class="btn record" disabled>🔴 开始录制</button>
                    <button id="pause-recording-btn" class="btn secondary" disabled>⏸️ 暂停</button>
                    <button id="stop-recording-btn" class="btn danger" disabled>⏹️ 停止</button>
                </div>
            </section>
        </main>
    </div>

    <!-- 录像库模态框 -->
    <div id="library-modal" class="modal" style="display: none;">
        <div class="modal-content glass">
            <h2>本地录像库</h2>
            <div id="library-list" class="library-grid"></div>
            <button id="close-library-btn" class="btn secondary">关闭</button>
        </div>
    </div>

    <!-- 引入核心逻辑模块 (ES Modules) -->
    <script type="module" src="js/app.js"></script>
</body>
</html>