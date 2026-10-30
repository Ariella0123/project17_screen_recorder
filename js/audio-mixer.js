// 音频混合器：利用 Web Audio API 组合麦克风与系统音频
export class AudioMixer {
    constructor() {
        this.audioContext = null;
        this.destination = null;
    }

    async setupAudio(micStream, systemStream) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.destination = this.audioContext.createMediaStreamDestination();

        if (micStream && micStream.getAudioTracks().length > 0) {
            const micSource = this.audioContext.createMediaStreamSource(micStream);
            micSource.connect(this.destination);
        }

        if (systemStream && systemStream.getAudioTracks().length > 0) {
            const systemSource = this.audioContext.createMediaStreamSource(systemStream);
            systemSource.connect(this.destination);
        }

        return this.destination.stream.getAudioTracks();
    }
}