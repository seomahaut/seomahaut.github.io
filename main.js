/*
 * South Korea Travel Website - Core JavaScript
 * University project by Mahaut Seo (Konkuk University Exchange Student)
 * Handles navigation, interactive tabs, gallery filters, image lightbox, and text-to-speech engine.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Execute interactive features
  initMobileNavigation();
  initStickyHeader();
  initScrollAnimations();
  initFoodTabs();
  initPhraseSpeaker();
  initGalleryLightbox();
  initGalleryFiltering();
});

/**
 * 1. Mobile Navigation Menu Toggle
 */
function initMobileNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    // Toggle menu visibility
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
}

/**
 * 2. Sticky Header shadow on scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

/**
 * 3. Intersection Observer for Scroll Reveal Animations
 */
function initScrollAnimations() {
  // Elements to reveal
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once element is revealed, stop observing it
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1, // trigger when 10% of element is visible
      rootMargin: '0px 0px -40px 0px' // offset to trigger slightly before coming into full view
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }
}

/**
 * 4. Food Guide - Feature Tabs Interactivity
 */
function initFoodTabs() {
  const tabContainers = document.querySelectorAll('.food-body');
  
  tabContainers.forEach(container => {
    const tabButtons = container.querySelectorAll('.food-tab-btn');
    const tabPanes = container.querySelectorAll('.food-tab-pane');
    
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabTarget = btn.getAttribute('data-tab');
        
        // Remove active state from current buttons & panes in this container
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active state to target button & pane
        btn.classList.add('active');
        const targetPane = container.querySelector(`.food-tab-pane[data-pane="${tabTarget}"]`);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  });
}

/**
 * 5. Travel Tips - Interactive Pronunciation Helper (Web Speech API)
 */
function initPhraseSpeaker() {
  const speakButtons = document.querySelectorAll('.speak-btn');
  
  if (speakButtons.length > 0) {
    // Check browser support
    const supportsSpeech = 'speechSynthesis' in window;
    
    speakButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Find adjacent Korean character element
        const row = button.closest('tr');
        const koreanTextEl = row ? row.querySelector('.korean-text') : null;
        
        if (koreanTextEl) {
          const phrase = koreanTextEl.textContent.trim();
          
          if (supportsSpeech) {
            // Cancel current speech output
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(phrase);
            utterance.lang = 'ko-KR'; // Crucial: sets pronunciation to Korean
            utterance.rate = 0.85;     // Slightly slower speed for language learning clarity
            utterance.pitch = 1.0;
            
            // Speak phrase
            window.speechSynthesis.speak(utterance);
            
            // Micro-animation trigger for button on speak
            button.style.transform = 'scale(1.2)';
            button.style.backgroundColor = 'var(--primary-color)';
            button.style.color = '#fff';
            
            setTimeout(() => {
              button.style.transform = '';
              button.style.backgroundColor = '';
              button.style.color = '';
            }, 500);
            
          } else {
            alert('Sorry, your browser does not support voice pronunciation synthesis.');
          }
        }
      });
    });
  }
}

/**
 * 6. Photo Gallery - Lightbox Modal Overlay
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  
  if (galleryItems.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const overlayTitle = item.querySelector('.gallery-item-overlay h3');
        const overlaySubtitle = item.querySelector('.gallery-item-overlay p');
        
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          
          // Generate caption from image info
          let captionText = "";
          if (overlayTitle) captionText += overlayTitle.textContent;
          if (overlaySubtitle) captionText += ` — ${overlaySubtitle.textContent}`;
          
          if (lightboxCaption) {
            lightboxCaption.textContent = captionText;
          }
          
          // Open lightbox
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden'; // Lock background scrolling
        }
      });
    });
    
    // Close lightbox helpers
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Restore scroll
    };
    
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Close on clicking overlay backing area
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
}

/**
 * 7. Photo Gallery - Category Grid Filters
 */
function initGalleryFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterVal = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          
          if (filterVal === 'all' || itemCategory === filterVal) {
            item.style.display = 'block';
            // Trigger animation repaint
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300); // match standard transitions
          }
        });
      });
    });
  }
}
