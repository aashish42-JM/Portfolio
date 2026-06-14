// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('theme-toggle');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const timelineItems = document.querySelectorAll('.timeline-item');
const skillProgressBars = document.querySelectorAll('.skill-progress');
const projectCards = document.querySelectorAll('.project-card');
const aboutLeft = document.querySelector('.about-left');
const aboutRight = document.querySelector('.about-right');
const statCards = document.querySelectorAll('.stat-card');
const educationItems = document.querySelectorAll('.education-item');
const achievementItems = document.querySelectorAll('.achievement-item');
const scrollProgress = document.getElementById('scroll-progress');
const header = document.querySelector('header');
const allNavLinks = document.querySelectorAll('.nav-links a');

// ========================================
// ANALYTICS: Event Tracking Functions
// ========================================
function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
        console.log(`📊 Analytics Event:', eventName, eventParams);
    } else {
        console.log('📊 Analytics Event (GTAG not loaded):', eventName, eventParams);
    }
}

function trackPageView(pageName) {
    trackEvent('page_view', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname
    });
}

// Track section visibility
function trackSectionEngagement(sectionId) {
    if (sectionId) {
        trackEvent('section_view', {
            section_id: sectionId
        });
    }
}

// Track button clicks
function trackButtonClick(buttonName, buttonLocation) {
    trackEvent('button_click', {
        button_name: buttonName,
        button_location: buttonLocation
    });
}

// Track project interactions
function trackProjectInteraction(projectName, action) {
    trackEvent('project_interaction', {
        project_name: projectName,
        action: action
    });
}

// Track scroll depth
let maxScrollDepth = 0;
function trackScrollDepth() {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        if (scrollPercent >= 25 && maxScrollDepth < 25) { trackEvent('scroll_depth', { depth: '25%' }); }
        if (scrollPercent >= 50 && maxScrollDepth < 50) { trackEvent('scroll_depth', { depth: '50%' }); }
        if (scrollPercent >= 75 && maxScrollDepth < 75) { trackEvent('scroll_depth', { depth: '75%' }); }
        if (scrollPercent >= 100 && maxScrollDepth < 100) { trackEvent('scroll_depth', { depth: '100%' }); }
    }
}

// Track page load
document.addEventListener('DOMContentLoaded', () => {
    trackPageView(document.title);
    
    // Set initial animated elements to hidden
    const animatedElements = document.querySelectorAll('.about-left, .about-right, .profile-card, .project-card, .timeline-item, .education-item, .achievement-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });
    
    // Initialize skill progress bars as a fallback
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width') || '80%';
        bar.style.width = width;
    });
});

// Scroll Progress Indicator
function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
}

// Active section highlighting for navbar
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            allNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}` || 
                    link.getAttribute('href') === `${sectionId}.html`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Hamburger Menu Toggle
hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks?.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
    });
});

// Theme Toggle (Dark/Light)
let isDarkMode = localStorage.getItem('darkMode') === 'true';

function updateTheme() {
    document.body.classList.toggle('dark-mode', isDarkMode);
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

themeToggle?.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    updateTheme();
});

// Initialize theme on page load
updateTheme();

// Scroll to Top Button
window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateActiveNavLink();
    trackScrollDepth();
    
    if (scrollToTopBtn) {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    }

    // Header scroll effect
    if (header) {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

scrollToTopBtn?.addEventListener('click', () => {
    trackButtonClick('Scroll to Top', 'Hero');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 80);
            animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe timeline items
timelineItems.forEach(item => {
    animationObserver.observe(item);
});

// Observe skill progress bars
skillProgressBars.forEach(bar => {
    animationObserver.observe(bar);
});

// Observe project cards
projectCards.forEach(card => {
    animationObserver.observe(card);
});

// Observe about section elements
if (aboutLeft) animationObserver.observe(aboutLeft);
if (aboutRight) animationObserver.observe(aboutRight);
statCards.forEach(card => {
    animationObserver.observe(card);
});

// Observe education items
educationItems.forEach(item => {
    animationObserver.observe(item);
});

// Observe achievement items
achievementItems.forEach(item => {
    animationObserver.observe(item);
});

// Typing effect for hero section (if available)
const typingText = document.getElementById('typing-text');
if (typingText) {
    const texts = [
        'Building AI-powered platforms',
        'Full Stack Developer',
        'AI Enthusiast',
        'CSIT Student'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(typeEffect, 500);
        } else {
            setTimeout(typeEffect, isDeleting ? 40 : 80);
        }
    }

    typeEffect();
}

// Animate skill progress bars when they come into view
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.getAttribute('data-width') || '80%';
            bar.style.width = width;
            skillObserver.unobserve(bar);
        }
    });
}, { threshold: 0.5 });

skillProgressBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Toast Notification Function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Update toast content
    toast.className = 'toast';
    toast.classList.add(type);
    
    toastIcon.className = 'toast-icon fas';
    if (type === 'success') {
        toastIcon.classList.add('fa-check-circle');
    } else {
        toastIcon.classList.add('fa-exclamation-circle');
    }
    
    toastMessage.textContent = message;
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://formspree.io/f/mreazaaw', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            showToast('Oops! Something went wrong. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}
