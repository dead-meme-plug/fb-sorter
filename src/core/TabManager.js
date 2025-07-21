export class TabManager {
  constructor(filterService) {
    this.filterService = filterService;
  }

  async checkAndCloseTabs() {
    const tabs = await chrome.tabs.query({});

    for (const tab of tabs) {
      if (tab.url && (await this.filterService.isTabInvalid(tab))) {
        await chrome.tabs.remove(tab.id);
      }
    }
  }
}
