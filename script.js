document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initAnimations();
  initContactForm();
  initThemeToggle();
});

function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }
}

function initScrollEffects() {
  const scrollProgress = document.getElementById('scroll-progress');
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    updateScrollProgress(scrollProgress);
    updateScrollToTopBtn(scrollToTopBtn);
    updateActiveNavLink();
    
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
  
  scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function updateScrollProgress(element) {
  if (!element) return;
  
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  
  element.style.width = `${progress}%`;
}

function updateScrollToTopBtn(btn) {
  if (!btn) return;
  
  if (window.scrollY > 300) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

function initAnimations() {
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        if (element.classList.contains('skill-progress')) {
          const width = element.getAttribute('data-width') || '80%';
          setTimeout(() => {
            element.style.width = width;
          }, 150);
        } else {
          element.classList.add('reveal-in');
        }
        
        observer.unobserve(element);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.reveal, .skill-progress').forEach(el => {
    observer.observe(el);
  });
  
  staggerAnimations();
}

function staggerAnimations() {
  const staggeredContainers = document.querySelectorAll('.stagger');
  
  staggeredContainers.forEach(container => {
    const elements = container.querySelectorAll('.reveal');
    elements.forEach((el, index) => {
      el.style.transitionDelay = `${index * 120}ms`;
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!form.checkValidity()) {
      form.reportValidity();
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
      const formData = new FormData(form);
      const response = await fetch(form.action || 'https://formspree.io/f/mreazaaw', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showToast('There was an error sending your message. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  
  // Initialize theme
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  // Update icon initially
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  updateThemeIcon(themeToggle, isDark);
  
  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(themeToggle, newTheme === 'dark');
  });
}

function updateThemeIcon(element, isDark) {
  const icon = element?.querySelector('i');
  if (!icon) return;
  
  if (isDark) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  const toastIcon = toast.querySelector('.toast-icon');
  const toastMessage = toast.querySelector('.toast-message');
  
  toast.className = `toast ${type}`;
  
  if (toastIcon) {
    toastIcon.className = 'toast-icon fas';
    if (type === 'success') {
      toastIcon.classList.add('fa-check-circle');
    } else {
      toastIcon.classList.add('fa-exclamation-circle');
    }
  }
  
  if (toastMessage) {
    toastMessage.textContent = message;
  }
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
