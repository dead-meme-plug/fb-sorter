import { TabManager } from "../core/TabManager.js";
import { FilterService } from "../core/FilterService.js";
import { BlacklistService } from "../core/BlacklistService.js";

const blacklistService = new BlacklistService();
const filterService = new FilterService(blacklistService);
const tabManager = new TabManager(filterService);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "closeBlacklistedTabs") {
    tabManager.checkAndCloseTabs().then(() => {
      sendResponse({ status: "completed" });
    });
    return true;
  }
});
