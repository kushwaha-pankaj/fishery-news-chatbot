// js/theme.js

// Immediately-invoked function expression (IIFE) to set the initial theme
// This runs as soon as this script file is parsed.
(function() {
  try {
    // Apply 'dark' theme ONLY if it's explicitly stored in localStorage.
    // Otherwise, the browser uses the default CSS (light theme).
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {
    // In case localStorage is unavailable or an error occurs
    console.warn('Initial theme check at top of theme.js failed:', e);
  }
})();

// Theme management class
class ThemeManager {
  constructor() {
    const storedTheme = this.getStoredTheme();
    // If a theme is stored, use it. Otherwise, default to 'light'.
    // This ensures the site loads light by default if no prior selection.
    // The IIFE above handles applying 'dark' early if it *is* stored.
    this.theme = storedTheme || 'light'; 
    
    // initTheme will ensure the theme is correctly applied (even if IIFE did it)
    // and, importantly, updates the toggle state.
    this.initTheme();
    this.bindEvents();
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  initTheme() {
    // Apply the theme determined in the constructor.
    // This re-application is generally harmless and ensures consistency.
    this.applyTheme(this.theme); 
    this.updateToggle();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme; // Update the instance's theme state
    localStorage.setItem('theme', theme); // Save the newly applied theme
  }

  updateToggle() {
    const toggle = document.getElementById('themeToggle');
    const label = document.getElementById('themeLabel');
    
    if (toggle && label) {
      const isDark = this.theme === 'dark';
      toggle.classList.toggle('active', isDark);
      
      let labelText = isDark ? 'Dark Mode' : 'Light Mode';
      let translationKey = isDark ? 'dark-mode' : 'light-mode';

      // Attempt to use translation if available
      if (window.translationManager && typeof window.translationManager.getFallbackTranslation === 'function') {
        labelText = window.translationManager.getFallbackTranslation(labelText, window.translationManager.currentLanguage) || labelText;
      }
      
      label.textContent = labelText;
      if (label.hasAttribute('data-translate')) {
        label.setAttribute('data-translate', translationKey);
        // If you have a function to actively re-translate a single element, you could call it here.
        // e.g., window.translationManager?.translateElement(label);
      }
    }
  }

  toggle() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    this.updateToggle();
  }

  bindEvents() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggle());
    }

    // Listen for system theme changes
    // This listener will only apply the system theme IF NO THEME IS CURRENTLY STORED by user choice.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) { 
        const systemTheme = e.matches ? 'dark' : 'light';
        // Check if this.theme (which defaults to 'light' if nothing stored) is different
        // from the new systemTheme to avoid unnecessary apply/toggle updates if they align.
        if (this.theme !== systemTheme) {
            this.applyTheme(systemTheme);
            this.updateToggle();
        }
      }
    });
  }
}

// Initialize theme manager
window.themeManager = new ThemeManager();