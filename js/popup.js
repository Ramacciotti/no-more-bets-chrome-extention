/**
 * Toggle button element retrieved from the DOM.
 * @type {HTMLButtonElement}
 */
const toggleButton = document.getElementById("toggleButton");

/**
 * Status text element retrieved from the DOM.
 * @type {HTMLElement}
 */
const statusText = document.getElementById("status");

/**
 * Updates the popup UI based on the enabled status.
 *
 * @param {boolean} enabled - Whether the blocking is currently enabled.
 */
function updatePopupUI(enabled) {
  statusText.textContent = enabled ? "Ativado" : "Desativado";
  toggleButton.textContent = enabled ? "Desativar bloqueio" : "Ativar bloqueio";
  toggleButton.disabled = false;
}

/**
 * Retrieves the saved state from chrome.storage and updates the UI.
 */
chrome.storage.local.get("enabled", (data) => {
  const enabled = data.enabled ?? true; // default to true
  updatePopupUI(enabled);
});

/**
 * Adds a click event listener to toggle the blocking state.
 */
toggleButton.addEventListener("click", () => {
  toggleButton.disabled = true; // disable button while updating
  chrome.storage.local.get("enabled", (data) => {
    const current = data.enabled ?? true;
    const next = !current;

    chrome.storage.local.set({ enabled: next }, () => {
      updatePopupUI(next);

      /**
       * Sends a message to the background script to toggle blocking.
       * @param {{ type: string, enabled: boolean }} message - The message payload.
       * @param {function(?Object): void} callback - Callback to handle the response.
       */
      chrome.runtime.sendMessage(
        { type: "toggle-block", enabled: next },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Communication error:", chrome.runtime.lastError);
          } else if (!response || !response.success) {
            console.error("Failed to update blocking state:", response?.error);
          }
        }
      );
    });
  });
});
