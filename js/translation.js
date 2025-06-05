
// Translation management using Google Translate API
class TranslationManager {
  constructor() {
    this.currentLanguage = 'en';
    this.apiKey = null; // Will be set from settings or environment
    this.translations = {};
    this.init();
  }

  init() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    this.currentLanguage = savedLanguage;
    this.loadGoogleTranslateScript();
  }

  loadGoogleTranslateScript() {
    if (!window.google || !window.google.translate) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
      
      window.googleTranslateElementInit = () => {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi,te',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      };
    }
  }

  async translateText(text, targetLanguage) {
    if (targetLanguage === 'en' || !text) {
      return text;
    }

    try {
      // Using Google Translate API (requires API key)
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLanguage,
          format: 'text'
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.translations[0].translatedText;
      }
    } catch (error) {
      console.log('Translation API not available, using fallback translations');
    }

    // Fallback to predefined translations for common phrases
    return this.getFallbackTranslation(text, targetLanguage);
  }

  getFallbackTranslation(text, targetLanguage) {
    const translations = {
      hi: {
        'Chat': 'चैट',
        'History': 'इतिहास',
        'Settings': 'सेटिंग्स',
        'Ask about fish farming, feed, diseases, water quality...': 'मछली पालन, चारा, बीमारी, पानी की गुणवत्ता के बारे में पूछें...',
        'Hello! I\'m your aquaculture assistant.': 'नमस्ते! मैं आपका मत्स्य पालन सहायक हूँ।',
        'Chat History': 'चैट इतिहास',
        'Clear All': 'सभी साफ करें',
        'No chat history yet.': 'अभी तक कोई चैट इतिहास नहीं।',
        'Light Mode': 'लाइट मोड',
        'Dark Mode': 'डार्क मोड',
        'Reset Chatbot': 'चैटबॉट रीसेट करें'
      },
      te: {
        'Chat': 'చాట్',
        'History': 'చరిత్ర',
        'Settings': 'సెట్టింగులు',
        'Ask about fish farming, feed, diseases, water quality...': 'చేప పెంపకం, మేత, వ్యాధులు, నీటి నాణ్యత గురించి అడగండి...',
        'Hello! I\'m your aquaculture assistant.': 'నమస్కారం! నేను మీ మత్స్య పెంపకం సహాయకుడిని.',
        'Chat History': 'చాట్ చరిత్ర',
        'Clear All': 'అన్నీ క్లియర్ చేయండి',
        'No chat history yet.': 'ఇంకా చాట్ చరిత్ర లేదు.',
        'Light Mode': 'లైట్ మోడ్',
        'Dark Mode': 'డార్క్ మోడ్',
        'Reset Chatbot': 'చాట్‌బాట్‌ను రీసెట్ చేయండి'
      }
    };

    return translations[targetLanguage]?.[text] || text;
  }

  async translatePageContent(language) {
    this.currentLanguage = language;
    
    // Translate navigation elements
    const elementsToTranslate = [
      { selector: '[data-translate="chat"]', key: 'Chat' },
      { selector: '[data-translate="history"]', key: 'History' },
      { selector: '[data-translate="settings"]', key: 'Settings' },
      { selector: '[data-translate="placeholder"]', key: 'Ask about fish farming, feed, diseases, water quality...', attr: 'placeholder' },
      { selector: '[data-translate="chat-history"]', key: 'Chat History' },
      { selector: '[data-translate="clear-all"]', key: 'Clear All' },
      { selector: '[data-translate="no-history"]', key: 'No chat history yet.' },
      { selector: '[data-translate="light-mode"]', key: 'Light Mode' },
      { selector: '[data-translate="dark-mode"]', key: 'Dark Mode' },
      { selector: '[data-translate="reset-chatbot"]', key: 'Reset Chatbot' }
    ];

    for (const element of elementsToTranslate) {
      const nodes = document.querySelectorAll(element.selector);
      const translatedText = await this.translateText(element.key, language);
      
      nodes.forEach(node => {
        if (element.attr) {
          node.setAttribute(element.attr, translatedText);
        } else {
          node.textContent = translatedText;
        }
      });
    }

    // Translate existing chat messages
    if (window.chatManager) {
      window.chatManager.translateMessages(language);
    }
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
    localStorage.setItem('google_translate_api_key', apiKey);
  }

  getApiKey() {
    return this.apiKey || localStorage.getItem('google_translate_api_key');
  }
}

// Initialize translation manager
window.translationManager = new TranslationManager();
