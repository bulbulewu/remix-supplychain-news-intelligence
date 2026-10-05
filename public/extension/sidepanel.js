const DEFAULT_APP_URL = "https://ais-dev-r3glata6oz3rwzvgoumdmj-117353919783.asia-southeast1.run.app";

const frame = document.getElementById("sidepanel-frame");
let currentUrl = DEFAULT_APP_URL;

function load(url) {
  currentUrl = url || DEFAULT_APP_URL;
  frame.src = currentUrl;
}

if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
  chrome.storage.local.get(["appUrl"], (res) => {
    load(res.appUrl || DEFAULT_APP_URL);
  });
} else {
  load(DEFAULT_APP_URL);
}

document.getElementById("btn-sync").addEventListener("click", () => {
  load(currentUrl);
});

document.getElementById("btn-tab").addEventListener("click", () => {
  if (typeof chrome !== "undefined" && chrome.tabs) {
    chrome.tabs.create({ url: currentUrl });
  } else {
    window.open(currentUrl, "_blank");
  }
});
