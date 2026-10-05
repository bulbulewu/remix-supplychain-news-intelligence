// Supply Chain & Trade News Intelligence - Background Service Worker (Manifest V3)
// Compatible with Chrome, Edge, Brave, Opera, Firefox, Safari

const DEFAULT_APP_URL = "https://ais-dev-r3glata6oz3rwzvgoumdmj-117353919783.asia-southeast1.run.app";

// On installation, setup context menus and default settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["appUrl"], (res) => {
    if (!res.appUrl) {
      chrome.storage.local.set({ appUrl: DEFAULT_APP_URL });
    }
  });

  // Enable side panel behavior on Chrome 114+ if supported
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});
  }

  // Context Menu for quick access from any web page
  if (chrome.contextMenus) {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: "open-full-dashboard",
        title: "Open Supply Chain Intelligence Terminal",
        contexts: ["all"]
      });
      chrome.contextMenus.create({
        id: "open-sidepanel",
        title: "Dock Intelligence in Side Panel",
        contexts: ["all"]
      });
    });
  }
});

// Handle Context Menu actions
if (chrome.contextMenus && chrome.contextMenus.onClicked) {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.storage.local.get(["appUrl"], (res) => {
      const url = res.appUrl || DEFAULT_APP_URL;

      if (info.menuItemId === "open-full-dashboard") {
        chrome.tabs.create({ url: url });
      } else if (info.menuItemId === "open-sidepanel") {
        if (chrome.sidePanel && tab?.windowId) {
          chrome.sidePanel.open({ windowId: tab.windowId }).catch(() => {
            chrome.tabs.create({ url: url });
          });
        } else {
          chrome.tabs.create({ url: url });
        }
      }
    });
  });
}
