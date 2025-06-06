
// Settings management
class SettingsManager {
  constructor() {
    this.bindEvents();
    this.loadSettings();
  }

  loadSettings() {
    // Load translation API key
    const apiKey = localStorage.getItem('google_translate_api_key');
    const apiKeyInput = document.getElementById('translateApiKey');
    if (apiKeyInput && apiKey) {
      apiKeyInput.value = apiKey;
    }
  }

  resetChatbot() {
    if (confirm('Are you sure you want to reset the chatbot? This will clear all chat history.')) {
      localStorage.removeItem('chatHistory');
      
      // Reset chat manager
      if (window.chatManager) {
        window.chatManager.messages = [];
        window.chatManager.addWelcomeMessage();
        window.chatManager.renderMessages();
      }

      // Update history page if currently viewing
      if (window.historyManager) {
        window.historyManager.loadHistory();
      }

      alert('Chatbot has been reset successfully!');
    }
  }

  bindEvents() {
    // Reset button
    const resetButton = document.getElementById('resetChatBtn');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        this.resetChatbot();
      });
    }

    // Translation API key
    const apiKeyInput = document.getElementById('translateApiKey');
    if (apiKeyInput) {
      apiKeyInput.addEventListener('change', (e) => {
        const apiKey = e.target.value.trim();
        localStorage.setItem('google_translate_api_key', apiKey);
        
        if (window.translationManager) {
          window.translationManager.setApiKey(apiKey);
        }
      });
    }
  }
}

// Initialize settings manager
window.settingsManager = new SettingsManager();
