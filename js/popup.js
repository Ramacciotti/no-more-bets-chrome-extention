const toggleButton = document.getElementById("toggleButton");
const statusText = document.getElementById("status");

function updatePopupUI(enabled) {
  statusText.textContent = enabled ? "Ativado" : "Desativado";
  toggleButton.textContent = enabled ? "Desativar bloqueio" : "Ativar bloqueio";
  toggleButton.disabled = false; // libera o botão para uso
}

// Pega o estado salvo no storage e atualiza UI
chrome.storage.local.get("enabled", (data) => {
  const enabled = data.enabled ?? true; // padrão true
  updatePopupUI(enabled);
});

// Adiciona evento para alternar status
toggleButton.addEventListener("click", () => {
  toggleButton.disabled = true; // bloqueia o botão enquanto atualiza
  chrome.storage.local.get("enabled", (data) => {
    const current = data.enabled ?? true;
    const next = !current;
    chrome.storage.local.set({ enabled: next }, () => {
      updatePopupUI(next);
      chrome.runtime.sendMessage({ type: "toggle-block", enabled: next }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Erro na comunicação:", chrome.runtime.lastError);
        } else if (!response || !response.success) {
          console.error("Falha ao atualizar bloqueio:", response?.error);
        }
      });
    });
  });
});
