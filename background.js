chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockedUrls: [] });
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.storage.sync.get(['blockedUrls'], (result) => {
        const blockedUrls = result.blockedUrls || [];
        const currentUrl = tab.url;
  
        const blockedUrl = blockedUrls.find(item => currentUrl.includes(item.url));
  
        if (blockedUrl) {
          const { url, duration, startTime } = blockedUrl;
          const remainingDuration = Math.max(duration - Math.floor((Date.now() - startTime) / 1000), 0);
  
          if (remainingDuration > 0) {
            chrome.tabs.remove(tabId);
          } else {
            chrome.storage.sync.set({ blockedUrls: blockedUrls.filter(item => item.url !== url) });
          }
        }
      });
    }
  });