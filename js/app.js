import { RecorderEngine } from './recorder.js';
import { StorageManager } from './storage.js';

// 应用主入口
document.addEventListener('DOMContentLoaded', async () => {
    const selectScreenBtn = document.getElementById('select-screen-btn');
    const startBtn = document.getElementById('start-recording-btn');
    const stopBtn = document.getElementById('stop-recording-btn');
    const screenPreview = document.getElementById('screen-preview');
    
    const recorder = new RecorderEngine();
    const storage = new StorageManager();
    await storage.init();

    let displayStream = null;

    selectScreenBtn.addEventListener('click', async () => {
        try {
            displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            screenPreview.srcObject = displayStream;
            startBtn.disabled = false;
            
            displayStream.getVideoTracks()[0].onended = () => {
                alert("用户已停止屏幕共享");
            };
        } catch (err) {
            console.error("获取屏幕共享失败:", err);
        }
    });

    startBtn.addEventListener('click', () => {
        if (!displayStream) return;
        recorder.init(displayStream);
        recorder.start();
        startBtn.disabled = true;
        stopBtn.disabled = false;
        document.getElementById('recording-status-dot').classList.add('recording');
        document.getElementById('recording-status-text').innerText = '正在录制...';
    });

    stopBtn.addEventListener('click', async () => {
        const videoBlob = await recorder.stop();
        if (videoBlob) {
            await storage.saveRecording(videoBlob, "我的屏幕录像");
            alert("录像已成功保存到本地存储库！");
        }
        stopBtn.disabled = true;
        startBtn.disabled = false;
        document.getElementById('recording-status-dot').classList.remove('recording');
        document.getElementById('recording-status-text').innerText = '就绪';
    });
});