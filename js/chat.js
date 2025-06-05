// Chat management
class ChatManager {
  constructor() {
    this.messages = [];
    this.isLoading = false;
    this.loadMessages();
    this.bindEvents();
    this.addWelcomeMessage();
  }

  loadMessages() {
    const stored = localStorage.getItem('chatHistory');
    if (stored) {
      this.messages = JSON.parse(stored).map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      this.renderMessages();
    }
  }

  saveMessages() {
    localStorage.setItem('chatHistory', JSON.stringify(this.messages));
  }

  addWelcomeMessage() {
    if (this.messages.length === 0) {
      this.addMessage({
        text: "Hello! I'm your aquaculture assistant. Ask me anything about fish farming, feed, diseases, water quality, or government schemes. I can help in English, Hindi, and Telugu!",
        isUser: false,
        timestamp: new Date()
      });
    }
  }

  addMessage(message) {
    const messageWithId = {
      id: Date.now().toString(),
      ...message
    };
    
    this.messages.push(messageWithId);
    this.saveMessages();
    this.renderMessage(messageWithId);
    this.scrollToBottom();
  }

  renderMessages() {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    container.innerHTML = '';
    this.messages.forEach(message => this.renderMessage(message));
    this.scrollToBottom();
  }

  renderMessage(message) {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${message.isUser ? 'user' : 'bot'}`;
    
    const time = message.timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const iconHtml = message.isUser 
      ? '<i data-lucide="user" class="chat-icon"></i>' 
      : '<i data-lucide="bot" class="chat-icon"></i>';

    bubble.innerHTML = `
      ${iconHtml}
      <div class="chat-content">
        <div class="message-text">${this.escapeHtml(message.text)}</div>
        <div class="message-time">${time}</div>
      </div>
    `;

    container.appendChild(bubble);
    
    // Re-initialize Lucide icons for the new elements
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  showLoadingMessage() {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'chat-bubble loading bot';
    loadingBubble.id = 'loadingMessage';
    loadingBubble.innerHTML = `
      <i data-lucide="bot" class="chat-icon"></i>
      <div class="chat-content">
        <div class="loading-dots">
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
        </div>
      </div>
    `;

    container.appendChild(loadingBubble);
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    this.scrollToBottom();
  }

  hideLoadingMessage() {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
      loadingMessage.remove();
    }
  }

  async sendMessage(text) {
    if (!text.trim() || this.isLoading) return;

    this.isLoading = true;
    this.updateInputState();

    // Add user message
    this.addMessage({
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    });

    // Show loading
    this.showLoadingMessage();

    // Generate bot response
    setTimeout(async () => {
      this.hideLoadingMessage();
      
      const botResponse = await this.generateBotResponse(text);
      this.addMessage({
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      });

      this.isLoading = false;
      this.updateInputState();
    }, 1500);
  }

  async generateBotResponse(userInput) {
    const input = userInput.toLowerCase();
    let response = "";
    
    if (input.includes('feed') || input.includes('nutrition')) {
      response = "For optimal fish growth, consider a balanced diet with 25-35% protein content. Feed frequency depends on fish size and water temperature. Would you like specific recommendations for your fish species?";
    } else if (input.includes('disease') || input.includes('sick')) {
      response = "Common fish diseases include bacterial infections, parasites, and viral diseases. Key prevention measures: maintain good water quality, avoid overcrowding, and quarantine new fish. What symptoms are you observing?";
    } else if (input.includes('water') || input.includes('quality')) {
      response = "Important water parameters: pH (6.5-8.5), dissolved oxygen (>5mg/L), ammonia (<0.25mg/L), and temperature. Regular testing and water changes are crucial. Do you need help with specific water quality issues?";
    } else if (input.includes('scheme') || input.includes('subsidy') || input.includes('government')) {
      response = "Several government schemes support aquaculture: PM-KISAN, Blue Revolution, and state-specific fisheries programs. These offer subsidies for pond construction, equipment, and training. Would you like details about eligibility criteria?";
    } else {
      response = "I'm here to help with all aspects of aquaculture! You can ask me about fish feed, disease management, water quality, pond construction, government schemes, or any other fish farming questions. How can I assist you today?";
    }

    // Translate response if not in English
    const currentLanguage = localStorage.getItem('language') || 'en';
    if (currentLanguage !== 'en' && window.translationManager) {
      response = await window.translationManager.translateText(response, currentLanguage);
    }

    return response;
  }

  async translateMessages(language) {
    if (!window.translationManager) return;

    // Re-render messages with translations
    this.renderMessages();
  }

  updateInputState() {
    const input = document.getElementById('messageInput');
    const button = document.getElementById('sendButton');

    if (input && button) {
      input.disabled = this.isLoading;
      button.disabled = this.isLoading;
    }
  }

  scrollToBottom() {
    const container = document.getElementById('chatMessages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  bindEvents() {
    const input = document.getElementById('messageInput');
    const button = document.getElementById('sendButton');

    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });

      input.addEventListener('input', () => {
        if (button) {
          button.disabled = !input.value.trim() || this.isLoading;
        }
      });
    }

    if (button) {
      button.addEventListener('click', () => this.handleSend());
    }
  }

  handleSend() {
    const input = document.getElementById('messageInput');
    if (input) {
      const text = input.value;
      input.value = '';
      this.sendMessage(text);
      
      // Update button state
      const button = document.getElementById('sendButton');
      if (button) {
        button.disabled = true;
      }
    }
  }
}

// Initialize chat manager
window.chatManager = new ChatManager();
