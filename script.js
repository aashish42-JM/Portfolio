// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Scroll to Top Button
let scrollToTopBtn = document.getElementById("scrollToTopBtn");

if (scrollToTopBtn) {
    window.onscroll = function() {
        scrollFunction();
    };

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    }

    scrollToTopBtn.onclick = function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').className = 'fas fa-moon';
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        }
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    section.animate {
        opacity: 1;
        transform: translateY(0);
    }

    .nav-links.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: #fff;
        padding: 1rem 0;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }

    body.dark-mode .nav-links.active {
        background-color: #34495e;
    }
`;
document.head.appendChild(style);

// Simple animation on scroll for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});
