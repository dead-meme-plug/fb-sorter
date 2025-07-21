export class BlacklistService {
    constructor() {
        this.STORAGE_KEY = "blacklist";
        this.DEFAULT_BLACKLIST = ["pickup", "pick up", "cash only"];
        this.initializeDefaultBlacklist();
    }

    async initializeDefaultBlacklist() {
        const current = await this.getBlacklist();
        if (current.length === 0) {
            await this.setBlacklist(this.DEFAULT_BLACKLIST);
        }
    }

    async getBlacklist() {
        const result = await chrome.storage.sync.get([this.STORAGE_KEY]);
        return result[this.STORAGE_KEY] || [];
    }

    async setBlacklist(items) {
        await chrome.storage.sync.set({
            [this.STORAGE_KEY]: items.map((item) =>
                item.toLowerCase().replace(/\s+/g, " ").trim()
            ),
        });
    }

    async addToBlacklist(word) {
        const current = await this.getBlacklist();
        const lowerWord = word.toLowerCase();
        if (!current.includes(lowerWord)) {
            await this.setBlacklist([...current, lowerWord]);
        }
    }

    async removeFromBlacklist(word) {
        const current = await this.getBlacklist();
        await this.setBlacklist(current.filter((w) => w !== word));
    }
}
