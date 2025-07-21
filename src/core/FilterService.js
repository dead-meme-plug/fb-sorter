export class FilterService {
    constructor(storage) {
        this.storage = storage;
        this.blacklist = [];
        this.loadBlacklist();
    }

    async loadBlacklist() {
        const data = await this.storage.getBlacklist();
        this.blacklist = data;
    }

    async isTabInvalid(tab) {
        if (this.blacklist.length === 0) return false;

        return new Promise((resolve) => {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    func: (blacklist) => {
                        try {
                            const descElement = document.querySelector(
                                ".xz9dl7a.xyri2b.xsag5q8.x1c1uobl.x126k92a span.x6zurak"
                            );
                            const description =
                                descElement?.textContent?.toLowerCase() || "";

                            const ratingContainer =
                                document.querySelector(".x1lziwak.x1yrsyyn");
                            const hasRating =
                                ratingContainer &&
                                ratingContainer.querySelectorAll(
                                    'svg[viewBox="0 0 20 20"]'
                                ).length > 0;

                            const isBlacklisted = blacklist.some((term) => {
                                const lowerTerm = term.toLowerCase();
                                return (
                                    description.includes(lowerTerm) ||
                                    description.includes(
                                        lowerTerm.replace(/\s+/g, " ").trim()
                                    )
                                );
                            });

                            return isBlacklisted || hasRating;
                        } catch (e) {
                            console.error("Filter error:", e);
                            return false;
                        }
                    },
                    args: [this.blacklist],
                },
                (results) => {
                    resolve(results?.[0]?.result || false);
                }
            );
        });
    }
}
