<?php
// 简单解析 .env 文件的函数
function loadEnv($filePath) {
    if (!file_exists($filePath)) return;
    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

loadEnv(__DIR__ . '/.env');

$uploadDir = __DIR__ . '/' . ($_ENV['UPLOAD_DIR'] ?? 'uploads/');

// 确保上传目录存在
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// 检查是否有文件上传
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['video'])) {
    $file = $_FILES['video'];
    $title = $_POST['title'] ?? '未命名录像';
    
    if ($file['error'] === UPLOAD_ERR_OK) {
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $safeName = uniqid('recording_', true) . '.' . ($extension ?: 'webm');
        $destination = $uploadDir . $safeName;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            // 这里可以把文件信息写入 MySQL 数据库（如果需要的话）
            echo json_encode([
                'success' => true,
                'message' => '录像上传服务器成功！',
                'filename' => $safeName,
                'path' => 'uploads/' . $safeName
            ]);
            exit;
        }
    }

    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '文件保存失败。']);
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '无效的请求。']);
}
?>