// 本地与服务器端存储管理器
export class StorageManager {
    constructor() {
        this.dbName = 'ScreenRecorderDB';
        this.storeName = 'recordings';
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    }

    // 同时保存到本地 IndexedDB 并上传至 PHP 后端
    async saveRecording(blob, title) {
        const recordTitle = title || `录像_${new Date().toLocaleString()}`;
        
        // 1. 保存到本地 IndexedDB
        const record = {
            title: recordTitle,
            blob: blob,
            date: new Date().toISOString(),
            size: blob.size
        };

        await new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(record);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        // 2. 异步上传到 PHP 后端
        const formData = new FormData();
        formData.append('video', blob, 'recording.webm');
        formData.append('title', recordTitle);

        try {
            const response = await fetch('upload.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            console.log("PHP 后端响应:", result);
            return result;
        } catch (err) {
            console.warn("上传至 PHP 后端失败（可能未运行在 PHP 环境中，仅保存在本地）:", err);
            return { success: true, localOnly: true };
        }
    }

    async getAllRecordings() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}