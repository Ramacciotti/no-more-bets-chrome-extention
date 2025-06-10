/**
 * Listener that runs when the extension is installed or updated.
 * It checks the current "enabled" status from storage and applies the appropriate ruleset.
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("enabled", (data) => {
    const isEnabled = data.enabled ?? true;

    chrome.declarativeNetRequest
      .updateEnabledRulesets({
        enableRulesetIds: isEnabled ? ["blocker"] : [],
        disableRulesetIds: isEnabled ? [] : ["blocker"],
      })
      .catch(console.error);
  });
});

/**
 * Listener for messages sent from other parts of the extension (e.g. popup).
 * Handles toggling the blocking ruleset based on the received message.
 *
 * @param {{ type: string, enabled: boolean }} message - The message sent from the popup or other script.
 * @param {chrome.runtime.MessageSender} sender - Contains information about the script context that sent the message.
 * @param {(response: { success: boolean, error?: string }) => void} sendResponse - Callback to send a response back to the sender.
 * @returns {boolean} Indicates asynchronous response (true to keep `sendResponse` open).
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "toggle-block") {
    chrome.declarativeNetRequest
      .updateEnabledRulesets({
        enableRulesetIds: message.enabled ? ["blocker"] : [],
        disableRulesetIds: message.enabled ? [] : ["blocker"],
      })
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));

    return true; // Indicates that the response will be sent asynchronously
  }
});
