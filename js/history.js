
// History management
class HistoryManager {
  constructor() {
    this.bindEvents();
  }

  loadHistory() {
    const stored = localStorage.getItem('chatHistory');
    const messages = stored ? JSON.parse(stored).map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })) : [];

    this.renderHistory(messages);
    this.updateClearButton(messages.length > 0);
  }

  renderHistory(messages) {
    const container = document.getElementById('historyContent');
    if (!container) return;

    if (messages.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No chat history yet. Start a conversation to see your messages here!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    messages.forEach(message => this.renderHistoryItem(message, container));
  }

  renderHistoryItem(message, container) {
    const item = document.createElement('div');
    item.className = `history-item ${message.isUser ? 'user' : 'bot'}`;
    
    const time = message.timestamp.toLocaleDateString() + ' ' + 
                 message.timestamp.toLocaleTimeString([], { 
                   hour: '2-digit', 
                   minute: '2-digit' 
                 });

    item.innerHTML = `
      <div class="history-header">
        <span class="history-sender ${message.isUser ? 'user' : 'bot'}">
          ${message.isUser ? 'You' : 'Fishery Bot'}
        </span>
        <span class="history-time">${time}</span>
      </div>
      <div class="history-message">${this.escapeHtml(message.text)}</div>
    `;

    container.appendChild(item);
  }

  updateClearButton(show) {
    const button = document.getElementById('clearHistoryBtn');
    if (button) {
      button.style.display = show ? 'flex' : 'none';
    }
  }

  clearHistory() {
    if (confirm('Are you sure you want to clear all chat history?')) {
      localStorage.removeItem('chatHistory');
      this.loadHistory();
      
      // Reset chat manager messages
      if (window.chatManager) {
        window.chatManager.messages = [];
        window.chatManager.addWelcomeMessage();
        window.chatManager.renderMessages();
      }
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  bindEvents() {
    const clearButton = document.getElementById('clearHistoryBtn');
    if (clearButton) {
      clearButton.addEventListener('click', () => this.clearHistory());
    }
  }
}

// Initialize history manager
window.historyManager = new HistoryManager();
