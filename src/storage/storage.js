class StorageService {
    async get(key) {
        return new Promise((resolve) => {
            chrome.storage.sync.get([key], (result) => resolve(result))
        })
    }

    async set(key, value) {
        return new Promise((resolve) => {
            chrome.storage.sync.set({ [key]: value }, () => resolve())
        })
    }
}
