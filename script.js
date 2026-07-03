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
const skillCategoryCards = document.querySelectorAll('.skill-category-card');
const profileCard = document.querySelector('.profile-card');
const scrollProgress = document.getElementById('scroll-progress');
const header = document.querySelector('header');
const allNavLinks = document.querySelectorAll('.nav-links a');
const journeyCommentForm = document.getElementById('journey-comment-form');
const journeyFeedbackForm = document.getElementById('journey-feedback-form');
const journeyCommentsList = document.getElementById('journey-comments-list');
const journeyFeedbackList = document.getElementById('journey-feedback-list');
const reactionGroups = document.querySelectorAll('[data-reaction-group]');

// ========================================
// ANALYTICS: Event Tracking Functions
// ========================================
function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
        console.log('📊 Analytics Event:', eventName, eventParams);
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

// Journey community interaction storage
const JOURNEY_STORAGE_KEYS = {
    reactions: 'journeyReactions',
    comments: 'journeyComments',
    feedback: 'journeyFeedback'
};

function readJourneyStorage(key, fallbackValue) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallbackValue;
    } catch (error) {
        console.error('Journey storage read error:', error);
        return fallbackValue;
    }
}

function writeJourneyStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Journey storage write error:', error);
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function renderJourneyReactions() {
    const savedReactions = readJourneyStorage(JOURNEY_STORAGE_KEYS.reactions, {});

    reactionGroups.forEach(group => {
        group.querySelectorAll('.reaction-chip').forEach(button => {
            const reactionKey = button.dataset.reaction;
            const count = savedReactions[reactionKey] || 0;
            const countNode = button.querySelector('strong');
            if (countNode) {
                countNode.textContent = String(count);
            }
            button.classList.toggle('selected', count > 0);
        });
    });
}

function renderJourneyComments() {
    if (!journeyCommentsList) return;

    const savedComments = readJourneyStorage(JOURNEY_STORAGE_KEYS.comments, []);
    if (savedComments.length === 0) {
        journeyCommentsList.innerHTML = '<p class="community-empty">No comments yet. Be the first to leave one.</p>';
        return;
    }

    journeyCommentsList.innerHTML = savedComments.slice().reverse().map(comment => `
        <article class="community-comment card">
            <div class="community-comment-header">
                <strong>${escapeHtml(comment.name)}</strong>
                <span>${escapeHtml(comment.timestamp)}</span>
            </div>
            <p>${escapeHtml(comment.message)}</p>
        </article>
    `).join('');
}

function renderJourneyFeedback() {
    if (!journeyFeedbackList) return;

    const savedFeedback = readJourneyStorage(JOURNEY_STORAGE_KEYS.feedback, []);
    if (savedFeedback.length === 0) {
        journeyFeedbackList.innerHTML = '<p class="community-empty">No feedback submitted yet.</p>';
        return;
    }

    journeyFeedbackList.innerHTML = savedFeedback.slice().reverse().map(item => `
        <article class="community-comment card">
            <div class="community-comment-header">
                <strong>${escapeHtml(item.topic)}</strong>
                <span>${escapeHtml(item.timestamp)}</span>
            </div>
            <p>${escapeHtml(item.message)}</p>
        </article>
    `).join('');
}

function addJourneyComment(name, message) {
    const savedComments = readJourneyStorage(JOURNEY_STORAGE_KEYS.comments, []);
    savedComments.push({
        name,
        message,
        timestamp: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    });
    writeJourneyStorage(JOURNEY_STORAGE_KEYS.comments, savedComments);
    renderJourneyComments();
}

function addJourneyFeedback(topic, message) {
    const savedFeedback = readJourneyStorage(JOURNEY_STORAGE_KEYS.feedback, []);
    savedFeedback.push({
        topic,
        message,
        timestamp: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    });
    writeJourneyStorage(JOURNEY_STORAGE_KEYS.feedback, savedFeedback);
}

function incrementJourneyReaction(reactionKey) {
    const savedReactions = readJourneyStorage(JOURNEY_STORAGE_KEYS.reactions, {});
    savedReactions[reactionKey] = (savedReactions[reactionKey] || 0) + 1;
    writeJourneyStorage(JOURNEY_STORAGE_KEYS.reactions, savedReactions);
    renderJourneyReactions();
}

// Track scroll depth
let maxScrollDepth = 0;
function trackScrollDepth() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const scrollPercent = Math.round((window.scrollY / docHeight) * 100);
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
    
    // Set initial animated elements to hidden (subtle)
    const animatedElements = document.querySelectorAll('.about-left, .about-right, .profile-card, .project-card, .timeline-item, .education-item, .achievement-item, .skill-category-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    // Initialize skill progress bars as a fallback
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width') || '80%';
        bar.style.width = width;
    });

    renderJourneyReactions();
    renderJourneyComments();
    renderJourneyFeedback();

    const homeHero = document.querySelector('.home-page .hero');
    if (homeHero) {
        const resetGlow = () => {
            homeHero.style.setProperty('--hero-glow-x', '50%');
            homeHero.style.setProperty('--hero-glow-y', '20%');
        };

        const updateGlow = (event) => {
            const rect = homeHero.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            homeHero.style.setProperty('--hero-glow-x', `${Math.max(0, Math.min(100, x)).toFixed(2)}%`);
            homeHero.style.setProperty('--hero-glow-y', `${Math.max(0, Math.min(100, y)).toFixed(2)}%`);
        };

        resetGlow();
        homeHero.addEventListener('pointermove', updateGlow, { passive: true });
        homeHero.addEventListener('pointerleave', resetGlow, { passive: true });
    }

    updateScrollProgress();
    updateActiveNavLink();
});

// Scroll Progress Indicator
function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
        scrollProgress.style.width = '0%';
        return;
    }
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
}

// Active section highlighting for navbar
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const journeyPaths = new Set(['/journey', '/journey.html']);

    if (journeyPaths.has(currentPath)) {
        allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            if (href === '/journey' || href === 'journey.html' || href === '/journey.html') {
                link.classList.add('active');
            }
        });
        return;
    }

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
    // Smooth theme transition helper
    document.body.classList.add('theme-transition');
    window.setTimeout(() => document.body.classList.remove('theme-transition'), 600);

    document.body.classList.toggle('dark-mode', isDarkMode);
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            // animate icon with class toggle for CSS-driven animation
            themeToggle.classList.add('toggling');
            // swap classes without removing other possible classes
            if (isDarkMode) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
            // update aria-pressed for accessibility
            themeToggle.setAttribute('aria-pressed', String(isDarkMode));
            // remove toggling state after animation
            setTimeout(() => themeToggle.classList.remove('toggling'), 600);
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

window.addEventListener('hashchange', updateActiveNavLink);

reactionGroups.forEach(group => {
    group.addEventListener('click', (event) => {
        const button = event.target.closest('.reaction-chip');
        if (!button) return;
        incrementJourneyReaction(button.dataset.reaction);
    });
});

journeyCommentForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!journeyCommentForm.checkValidity()) {
        journeyCommentForm.reportValidity();
        return;
    }

    const nameField = journeyCommentForm.querySelector('#journey-name');
    const messageField = journeyCommentForm.querySelector('#journey-message');
    const name = nameField.value.trim();
    const message = messageField.value.trim();

    if (!name || !message) return;

    addJourneyComment(name, message);
    journeyCommentForm.reset();
    showToast('Comment posted locally.', 'success');
});

journeyFeedbackForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!journeyFeedbackForm.checkValidity()) {
        journeyFeedbackForm.reportValidity();
        return;
    }

    const topicField = journeyFeedbackForm.querySelector('#feedback-topic');
    const messageField = journeyFeedbackForm.querySelector('#feedback-message');
    const topic = topicField.value;
    const message = messageField.value.trim();

    if (!message) return;

    addJourneyFeedback(topic, message);
    journeyFeedbackForm.reset();
    renderJourneyFeedback();
    showToast('Feedback saved locally. Thank you.', 'success');
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const el = entry.target;
            // Check if it's a skill progress bar
            if (el.classList.contains('skill-progress')) {
                const width = el.getAttribute('data-width') || '80%';
                el.style.width = width;
            } else {
                // For other animated elements
                const delay = index * 50;
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delay);
            }
            animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe timeline items
timelineItems.forEach(item => {
    animationObserver.observe(item);
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

// Observe skill category cards
skillCategoryCards.forEach(card => {
    animationObserver.observe(card);
});

// Observe profile card
if (profileCard) animationObserver.observe(profileCard);

// Observe skill progress bars
skillProgressBars.forEach(bar => {
    animationObserver.observe(bar);
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

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            showToast('Please fill out the form correctly before sending.', 'error');
            return;
        }
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const formEndpoint = contactForm.getAttribute('action') || 'https://formspree.io/f/mreazaaw';
        const requestTimeoutMs = 15000;

        if (!navigator.onLine) {
            console.error('Form submission blocked: browser is offline.');
            showToast('You appear to be offline. Please reconnect and try again.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const abortController = new AbortController();
            const timeoutId = window.setTimeout(() => abortController.abort(), requestTimeoutMs);

            const response = await fetch(formEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                },
                signal: abortController.signal
            });
            window.clearTimeout(timeoutId);
            
            if (response.ok) {
                showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                const contentType = response.headers.get('content-type') || '';
                let errorMessage = `Failed to send message (${response.status}).`;

                try {
                    if (contentType.includes('application/json')) {
                        const data = await response.json();
                        if (data?.errors?.length) {
                            errorMessage = data.errors.map((entry) => entry.message).join(' ');
                        }
                    } else {
                        const responseText = await response.text();
                        if (responseText.trim()) {
                            errorMessage = responseText.slice(0, 240);
                        }
                    }
                } catch {
                    // Keep the generic error message when the response body cannot be parsed.
                }

                console.error('Form submission failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorMessage
                });
                throw new Error(errorMessage);
            }
        } catch (error) {
            const isTransportFailure = error?.name === 'AbortError' || /failed to fetch|networkerror|load failed/i.test(error?.message || '');

            console.error('Form submission error:', error);

            if (isTransportFailure && !contactForm.dataset.fallbackSubmitted) {
                contactForm.dataset.fallbackSubmitted = 'true';
                contactForm.target = '_blank';
                showToast('Connection issue detected. Retrying with the browser form fallback.', 'error');
                contactForm.submit();
                return;
            }

            showToast(error.message || 'Oops! Something went wrong. Please try again.', 'error');
        } finally {
            if (contactForm.dataset.fallbackSubmitted) {
                delete contactForm.dataset.fallbackSubmitted;
                contactForm.target = '';
            }

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

/* ---------------------------------------------------------------------------
   Cinematic Animation Enhancements (stagger reveals, parallax, tilt, glow)
   - Optimized with requestAnimationFrame
   - Disabled when prefers-reduced-motion or on touch-only devices
   --------------------------------------------------------------------------- */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// Stagger reveal helper: mark child --stagger-index and add reveal-in
function staggerReveal(container, staggerDelay = 70) {
    const children = Array.from(container.querySelectorAll('.reveal'));
    children.forEach((child, i) => {
        child.style.setProperty('--stagger-index', i);
        child.classList.add('reveal-in');
        // Ensure final state
        child.style.opacity = '1';
        child.style.transform = 'translateY(0) scale(1)';
        child.style.filter = 'blur(0)';
    });
}

// Enhanced observer for section reveals with staggering
if (!prefersReducedMotion) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                // reveal section title and children with stagger
                const reveals = section.querySelectorAll('.reveal');
                if (reveals.length > 0) {
                    reveals.forEach((el, idx) => {
                        el.style.transitionDelay = `${idx * 80}ms`;
                        el.classList.add('reveal-in');
                    });
                }
                // if container has .stagger, call helper
                if (section.classList.contains('stagger')) {
                    staggerReveal(section);
                }
                sectionObserver.unobserve(section);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));
}

// Parallax on scroll for elements with data-parallax-depth
const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
let parallaxTicking = false;
function onParallaxScroll() {
    if (parallaxTicking) return;
    parallaxTicking = true;
    requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        parallaxEls.forEach(el => {
            const depth = parseFloat(el.getAttribute('data-parallax')) || 0.2;
            const rect = el.getBoundingClientRect();
            const offset = (scrolled - (rect.top + window.scrollY)) * depth * -0.06;
            el.style.transform = `translate3d(0, ${offset}px, 0)`;
        });
        parallaxTicking = false;
    });
}
if (!isTouchDevice) {
    window.addEventListener('scroll', onParallaxScroll, { passive: true });
    onParallaxScroll();
}

// Mouse reactive glow and tilt for cards
const tiltTargets = Array.from(document.querySelectorAll('.tilt, .project-card, .skill-category-card, .card'));
let tiltState = { hovering: null };

function handleCardMove(e) {
    const target = tiltState.hovering;
    if (!target) return;
    if (prefersReducedMotion || isTouchDevice) return;
    const rect = target.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    const px = Math.min(Math.max(mx, 0), 1) * 100;
    const py = Math.min(Math.max(my, 0), 1) * 100;

    // apply CSS variables for glow position
    target.style.setProperty('--mx', `${px}%`);
    target.style.setProperty('--my', `${py}%`);

    // tilt transform
    const rotateY = (mx - 0.5) * 8; // degrees
    const rotateX = (0.5 - my) * 6; // degrees
    const translateZ = 8;
    target.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
}

function handleCardEnter(e) {
    const el = e.currentTarget;
    if (prefersReducedMotion || isTouchDevice) return;
    tiltState.hovering = el;
    el.classList.add('tilt-active');
    // create glow element if missing
    if (!el.querySelector('.card-glow')) {
        const glow = document.createElement('div');
        glow.className = 'card-glow';
        el.appendChild(glow);
    }
}

function handleCardLeave(e) {
    const el = e.currentTarget;
    tiltState.hovering = null;
    el.classList.remove('tilt-active');
    // reset transform smoothly
    el.style.transform = '';
    // fade out glow
    const glow = el.querySelector('.card-glow');
    if (glow) {
        glow.style.opacity = '0';
        setTimeout(() => { if (glow.parentNode) glow.parentNode.removeChild(glow); }, 350);
    }
}

if (!isTouchDevice && !prefersReducedMotion) {
    tiltTargets.forEach(t => {
        t.addEventListener('mousemove', handleCardMove);
        t.addEventListener('mouseenter', handleCardEnter);
        t.addEventListener('mouseleave', handleCardLeave);
    });
    // global mousemove to update hovered card via rAF
    document.addEventListener('mousemove', (e) => {
        if (prefersReducedMotion || isTouchDevice) return;
        requestAnimationFrame(() => handleCardMove(e));
    });
}

