<?php
// 处理通过 POST 上传保存视频的简易后端逻辑
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['video'])) {$uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $file =$_FILES['video'];
    $title =$_POST['title'] ?? '录像_' . date('Y-m-d_H-i-s');
    $safeName = uniqid('rec_', true) . '.webm';$destination = $uploadDir .$safeName;

    if (move_uploaded_file($file['tmp_name'],$destination)) {
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'path' => 'uploads/' . $safeName]);
        exit;
    }
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => '保存失败']);
    exit;
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebScreen Studio - 网页端屏幕录像系统</title>
    <!-- 引入独立的 CSS 样式文件 -->
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

    <!-- 录像库模态框弹窗（对应 js/app.js 中的 library-modal） -->
    <div id="library-modal" class="modal" style="display: none;">
        <div class="modal-content glass">
            <h2>📂 本地与云端录像库</h2>
            <div id="library-list" class="library-grid"></div>
            <button id="close-library-btn" class="btn secondary">关闭</button>
        </div>
    </div>

    <!-- 系统设置模态框弹窗（对应 js/app.js 中的 settings-modal） -->
    <div id="settings-modal" class="modal" style="display: none;">
        <div class="modal-content glass">
            <h2>⚙️ 系统设置</h2>
            <div style="display: flex; flex-direction: column; gap: 12px; margin: 15px 0;">
                <label style="font-size: 14px; font-weight: 500;">分辨率: 
                    <select id="setting-resolution" class="btn secondary" style="width: 100%; margin-top: 5px; justify-content: space-between;">
                        <option value="1080p">1080p (Full HD)</option>
                        <option value="720p">720p (HD)</option>
                    </select>
                </label>
                <label style="font-size: 14px; font-weight: 500;">帧率 (FPS): 
                    <select id="setting-fps" class="btn secondary" style="width: 100%; margin-top: 5px; justify-content: space-between;">
                        <option value="30">30 FPS</option>
                        <option value="60">60 FPS</option>
                    </select>
                </label>
            </div>
            <button id="close-settings-btn" class="btn primary">保存并关闭</button>
        </div>
    </div>

    <!-- 引入前端主控制器（必须使用 type="module" 确保支持 ES 模块导入） -->
    <script type="module" src="js/app.js"></script>
</body>
</html>