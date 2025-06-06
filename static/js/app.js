
// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('Fishery.News Aquaculture Chatbot initialized');
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Set initial input state
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  
  if (messageInput && sendButton) {
    messageInput.disabled = false;
    sendButton.disabled = true;
    
    // Enable send button when there's text
    messageInput.addEventListener('input', () => {
      sendButton.disabled = !messageInput.value.trim();
    });
  }

  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.chatManager) {
      // Refresh when page becomes visible
      window.chatManager.scrollToBottom();
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.chatManager) {
      window.chatManager.scrollToBottom();
    }
  });

  // Global error handler
  window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
  });

  // Service worker registration (for future PWA features)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
});

// Utility functions
window.fisheryUtils = {
  formatDate: (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  },

  escapeHtml: (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ThemeManager,
    NavigationManager,
    ChatManager,
    HistoryManager,
    SettingsManager
  };
}
