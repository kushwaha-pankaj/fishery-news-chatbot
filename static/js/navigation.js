// js/navigation.js

class NavigationManager {
  constructor() {
    this.currentPage = 'chat'; // Default page
    this.appSidebar = document.getElementById('appSidebar');
    this.mobileToggle = document.getElementById('mobileToggle');
    this.menuIcon = document.getElementById('menuIcon');
    this.closeIcon = document.getElementById('closeIcon');
    // navMenu is still the ID of the <nav> element inside the sidebar
    // but the toggle action is on appSidebar.
    this.navMenuContainer = document.getElementById('navMenu'); 

    this.bindEvents();
    this.updateActiveLink();
    this.initLanguageSelector();
  }

  initLanguageSelector() {
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
      const savedLanguage = localStorage.getItem('language') || 'en';
      languageSelect.value = savedLanguage;
      
      // Apply translation if not English and translationManager is ready
      if (savedLanguage !== 'en') {
        // Defer translation until translationManager is fully loaded if necessary
        // For now, assuming it's available or will be shortly after DOMContentLoaded
        if (window.translationManager) {
            window.translationManager.translatePageContent(savedLanguage);
        } else {
            // Optional: Handle case where translationManager might not be ready yet
            // document.addEventListener('translationManagerReady', () => { // Custom event
            //     window.translationManager.translatePageContent(savedLanguage);
            // });
        }
      }
    }
  }

  bindEvents() {
    // Mobile toggle for the new sidebar
    if (this.mobileToggle && this.appSidebar && this.menuIcon && this.closeIcon) {
      this.mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from immediately closing due to document listener
        this.appSidebar.classList.toggle('active');
        const isActive = this.appSidebar.classList.contains('active');
        
        this.menuIcon.style.display = isActive ? 'none' : 'block';
        this.closeIcon.style.display = isActive ? 'block' : 'none';
      });
    }

    // Close mobile sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (this.appSidebar && this.appSidebar.classList.contains('active')) {
        // Check if the click is outside the sidebar AND not on the toggle button
        const isClickInsideSidebar = this.appSidebar.contains(e.target);
        const isClickOnToggle = this.mobileToggle ? this.mobileToggle.contains(e.target) : false;

        if (!isClickInsideSidebar && !isClickOnToggle) {
          this.appSidebar.classList.remove('active');
          if (this.menuIcon) this.menuIcon.style.display = 'block';
          if (this.closeIcon) this.closeIcon.style.display = 'none';
        }
      }
    });

    // Handle navigation links (delegated to document for dynamically added content if any)
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
        
        if (window.translationManager) {
          await window.translationManager.translatePageContent(selectedLanguage);
        }
        // If sidebar is open on mobile, consider closing it after language change for better UX
        if (this.appSidebar && this.appSidebar.classList.contains('active') && window.innerWidth <= 768) {
            this.appSidebar.classList.remove('active');
            if (this.menuIcon) this.menuIcon.style.display = 'block';
            if (this.closeIcon) this.closeIcon.style.display = 'none';
        }
      });
    }
  }

  showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(pageEl => { // Renamed 'page' to 'pageEl' to avoid conflict
      pageEl.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageId + 'Page');
    if (targetPage) {
      targetPage.classList.add('active');
      this.currentPage = pageId;
      this.updateActiveLink();
    }

    // Close mobile sidebar if it's open
    if (this.appSidebar && this.appSidebar.classList.contains('active')) {
      // Only close if on mobile view where sidebar is an overlay
      if (window.innerWidth <= 768) { 
        this.appSidebar.classList.remove('active');
        if (this.menuIcon) this.menuIcon.style.display = 'block';
        if (this.closeIcon) this.closeIcon.style.display = 'none';
      }
    }

    // Update page-specific content
    if (pageId === 'history' && window.historyManager) {
      window.historyManager.loadHistory();
    }
  }

  updateActiveLink() {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to the current page's link
    const activeLink = document.querySelector(`.nav-link[data-page="${this.currentPage}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
}

// Global function for navigation (used in HTML onclick attributes)
function showPage(pageId) {
  // Ensure navigationManager is initialized
  if (window.navigationManager) {
    window.navigationManager.showPage(pageId);
  } else {
    // Fallback or error if manager not ready - though it should be.
    console.warn('NavigationManager not ready for showPage global call.');
  }
}

// Initialize navigation manager
// Ensure this runs after the DOM is fully loaded if elements are accessed immediately.
// If script is at the end of body, it's usually fine.
// Or wrap in DOMContentLoaded:
// document.addEventListener('DOMContentLoaded', () => {
//   window.navigationManager = new NavigationManager();
// });
// For now, direct initialization assuming script placement at end of body or DOMContentLoaded in app.js
window.navigationManager = new NavigationManager();