
// Theme management
class ThemeManager {
  constructor() {
    this.theme = this.getStoredTheme() || this.getSystemTheme();
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
    this.applyTheme(this.theme);
    this.updateToggle();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme;
    localStorage.setItem('theme', theme);
  }

  updateToggle() {
    const toggle = document.getElementById('themeToggle');
    const label = document.getElementById('themeLabel');
    
    if (toggle && label) {
      if (this.theme === 'dark') {
        toggle.classList.add('active');
        label.textContent = 'Dark Mode';
      } else {
        toggle.classList.remove('active');
        label.textContent = 'Light Mode';
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
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        this.applyTheme(e.matches ? 'dark' : 'light');
        this.updateToggle();
      }
    });
  }
}

// Initialize theme manager
window.themeManager = new ThemeManager();
