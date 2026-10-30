// 录制引擎：管理 MediaRecorder API 的核心逻辑
export class RecorderEngine {
    constructor() {
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isPaused = false;
    }

    // 初始化录制流
    init(stream, options = {}) {
        this.recordedChunks = [];
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
            ? 'video/webm;codecs=vp9,opus'
            : 'video/webm';

        this.mediaRecorder = new MediaRecorder(stream, { mimeType, ...options });

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };
    }

    start() {
        if (this.mediaRecorder) {
            this.mediaRecorder.start(1000); // 每秒收集一次数据
            this.isPaused = false;
        }
    }

    pause() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.pause();
            this.isPaused = true;
        }
    }

    resume() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
            this.mediaRecorder.resume();
            this.isPaused = false;
        }
    }

    stop() {
        return new Promise((resolve) => {
            if (!this.mediaRecorder) {
                resolve(null);
                return;
            }

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: this.mediaRecorder.mimeType });
                resolve(blob);
            };

            this.mediaRecorder.stop();
        });
    }
}