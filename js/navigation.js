// Navigation management
class NavigationManager {
  constructor() {
    this.currentPage = 'chat';
    this.bindEvents();
    this.updateActiveLink();
    this.initLanguageSelector();
  }

  initLanguageSelector() {
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
      const savedLanguage = localStorage.getItem('language') || 'en';
      languageSelect.value = savedLanguage;
      
      // Apply translation if not English
      if (savedLanguage !== 'en') {
        window.translationManager?.translatePageContent(savedLanguage);
      }
    }
  }

  bindEvents() {
    // Mobile toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        
        menuIcon.style.display = isActive ? 'none' : 'block';
        closeIcon.style.display = isActive ? 'block' : 'none';
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      }
    });

    // Handle navigation links
    document.addEventListener('click', (e) => {
      const navLink = e.target.closest('.nav-link');
      if (navLink) {
        e.preventDefault();
        const page = navLink.getAttribute('data-page');
        if (page) {
          this.showPage(page);
        }
      }
    });

    // Language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
      languageSelect.addEventListener('change', async (e) => {
        const selectedLanguage = e.target.value;
        localStorage.setItem('language', selectedLanguage);
        
        // Translate page content
        if (window.translationManager) {
          await window.translationManager.translatePageContent(selectedLanguage);
        }
      });
    }
  }

  showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageId + 'Page');
    if (targetPage) {
      targetPage.classList.add('active');
      this.currentPage = pageId;
      this.updateActiveLink();
    }

    // Close mobile menu
    const navMenu = document.getElementById('navMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    
    if (navMenu) {
      navMenu.classList.remove('active');
      if (menuIcon) menuIcon.style.display = 'block';
      if (closeIcon) closeIcon.style.display = 'none';
    }

    // Update page-specific content
    if (pageId === 'history') {
      window.historyManager?.loadHistory();
    }
  }

  updateActiveLink() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[data-page="${this.currentPage}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
}

// Global function for navigation (used in HTML onclick)
function showPage(pageId) {
  window.navigationManager?.showPage(pageId);
}

// Initialize navigation manager
window.navigationManager = new NavigationManager();
