chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("enabled", (data) => {
    const isEnabled = data.enabled ?? true;
    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: isEnabled ? ["blocker"] : [],
      disableRulesetIds: isEnabled ? [] : ["blocker"]
    }).catch(console.error);
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "toggle-block") {
    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: message.enabled ? ["blocker"] : [],
      disableRulesetIds: message.enabled ? [] : ["blocker"]
    }).then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // para manter o canal aberto
  }
});
