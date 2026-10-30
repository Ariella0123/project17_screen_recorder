import { RecorderEngine } from './recorder.js';
import { StorageManager } from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    const selectScreenBtn = document.getElementById('select-screen-btn');
    const startBtn = document.getElementById('start-recording-btn');
    const pauseBtn = document.getElementById('pause-recording-btn');
    const stopBtn = document.getElementById('stop-recording-btn');
    const screenPreview = document.getElementById('screen-preview');
    const statusDot = document.getElementById('recording-status-dot');
    const statusText = document.getElementById('recording-status-text');
    const timerEl = document.getElementById('recording-timer');

    // 弹窗相关元素
    const libraryBtn = document.getElementById('library-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const libraryModal = document.getElementById('library-modal');
    const settingsModal = document.getElementById('settings-modal');
    const closeLibraryBtn = document.getElementById('close-library-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const libraryList = document.getElementById('library-list');

    const recorder = new RecorderEngine();
    const storage = new StorageManager();
    await storage.init().catch(err => console.log("IndexedDB 初始化提示:", err));

    let displayStream = null;
    let timerInterval = null;
    let secondsElapsed = 0;

    // 1. 选择屏幕
    selectScreenBtn.addEventListener('click', async () => {
        try {
            displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            screenPreview.srcObject = displayStream;
            startBtn.disabled = false;
            
            displayStream.getVideoTracks()[0].onended = () => {
                alert("屏幕共享已结束");
                resetState();
            };
        } catch (err) {
            console.error("获取屏幕共享失败:", err);
        }
    });

    // 2. 开始录制
    startBtn.addEventListener('click', () => {
        if (!displayStream) return;
        recorder.init(displayStream);
        recorder.start();

        startBtn.disabled = true;
        pauseBtn.disabled = false; // 确保开始录制后启用暂停按钮
        stopBtn.disabled = true;  // 实际录制时可以停止
        stopBtn.disabled = false;
        selectScreenBtn.disabled = true;

        statusDot.classList.add('recording');
        statusText.innerText = '正在录制...';

        // 启动计时器
        secondsElapsed = 0;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            secondsElapsed++;
            const hrs = String(Math.floor(secondsElapsed / 3600)).padStart(2, '0');
            const mins = String(Math.floor((secondsElapsed % 3600) / 60)).padStart(2, '0');
            const secs = String(secondsElapsed % 60).padStart(2, '0');
            timerEl.innerText = `${hrs}:${mins}:${secs}`;
        }, 1000);
    });

    // 3. 暂停 / 恢复录制
    pauseBtn.addEventListener('click', () => {
        if (recorder.isPaused) {
            recorder.resume();
            pauseBtn.innerText = '⏸️ 暂停';
            statusText.innerText = '正在录制...';
            timerInterval = setInterval(() => {
                secondsElapsed++;
                const hrs = String(Math.floor(secondsElapsed / 3600)).padStart(2, '0');
                const mins = String(Math.floor((secondsElapsed % 3600) / 60)).padStart(2, '0');
                const secs = String(secondsElapsed % 60).padStart(2, '0');
                timerEl.innerText = `${hrs}:${mins}:${secs}`;
            }, 1000);
        } else {
            recorder.pause();
            clearInterval(timerInterval);
            pauseBtn.innerText = '▶️ 恢复';
            statusText.innerText = '已暂停';
        }
    });

    // 4. 停止录制并保存
    stopBtn.addEventListener('click', async () => {
        const videoBlob = await recorder.stop();
        if (videoBlob) {
            const title = '录像_' + new Date().toLocaleString();
            await storage.saveRecording(videoBlob, title);

            // 异步同步到 PHP 后端 (upload.php)
            const formData = new FormData();
            formData.append('video', videoBlob, 'recording.webm');
            formData.append('title', title);
            try {
                const res = await fetch('upload.php', { method: 'POST', body: formData });
                const result = await res.json();
                console.log("PHP 后端同步响应:", result);
            } catch (e) {
                console.warn("同步至 PHP 后端失败，已保留在本地存储");
            }

            alert("录像已成功保存！");
        }
        resetState();
    });

    function resetState() {
        clearInterval(timerInterval);
        startBtn.disabled = !displayStream;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        selectScreenBtn.disabled = false;
        pauseBtn.innerText = '⏸️ 暂停';
        statusDot.classList.remove('recording');
        statusText.innerText = '就绪';
        timerEl.innerText = '00:00:00';
    }

    // 5. 录像库弹窗与数据加载
    libraryBtn.addEventListener('click', async () => {
        libraryModal.style.display = 'flex';
        const recordings = await storage.getAllRecordings();
        libraryList.innerHTML = '';
        
        if (!recordings || recordings.length === 0) {
            libraryList.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">暂无本地录像</p>';
            return;
        }

        recordings.reverse().forEach(rec => {
            const item = document.createElement('div');
            item.style.cssText = "background: rgba(234,88,12,0.04); padding: 14px; border-radius: 14px; border: 1px solid rgba(234,88,12,0.15); display: flex; flex-direction: column; gap: 8px;";
            const url = URL.createObjectURL(rec.blob);
            item.innerHTML = `
                <strong style="font-size: 14px; color: var(--text-main);">${rec.title}</strong>
                <span style="font-size: 11px; color: var(--text-muted);">${new Date(rec.date).toLocaleString()}</span>
                <video src="${url}" controls style="width: 100%; height: 110px; background: #000; border-radius: 8px;"></video>
                <a href="${url}" download="${rec.title}.webm" class="btn primary" style="padding: 6px; font-size: 12px; text-decoration: none; text-align: center;">下载视频</a>
            `;
            libraryList.appendChild(item);
        });
    });

    closeLibraryBtn.addEventListener('click', () => {
        libraryModal.style.display = 'none';
    });

    // 6. 设置弹窗交互
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
});