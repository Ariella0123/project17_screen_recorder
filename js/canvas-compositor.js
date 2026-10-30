// 画面合成：将屏幕和摄像头画中画实时绘制到 HTML Canvas 并输出流
export class CanvasCompositor {
    constructor(screenVideo, webcamVideo) {
        this.screenVideo = screenVideo;
        this.webcamVideo = webcamVideo;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isCompiling = false;
    }

    startCompositing(fps = 30) {
        this.canvas.width = 1920;
        this.canvas.height = 1080;
        this.isCompiling = true;

        const draw = () => {
            if (!this.isCompiling) return;
            
            // 绘制屏幕画面
            this.ctx.drawImage(this.screenVideo, 0, 0, this.canvas.width, this.canvas.height);

            // 绘制摄像头画中画（右下角）
            if (this.webcamVideo && this.webcamVideo.readyState >= 2) {
                const pipWidth = 320;
                const pipHeight = 180;
                const margin = 40;
                this.ctx.drawImage(
                    this.webcamVideo,
                    this.canvas.width - pipWidth - margin,
                    this.canvas.height - pipHeight - margin,
                    pipWidth,
                    pipHeight
                );
            }

            requestAnimationFrame(draw);
        };
        draw();

        return this.canvas.captureStream(fps);
    }

    stopCompositing() {
        this.isCompiling = false;
    }
}