// DOM Elements
const navbar = document.getElementById('mainNavbar');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const cursorFollow = document.querySelector('.cursor-follow');
const bottomBlurOverlay = document.querySelector('.bottom-blur-overlay');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeProjectCards();
    initializeCertificateModal();
    initializeScrollEffects();
    initializeCursor();
    initializeTheme();
});

// Custom Cursor
function initializeCursor() {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        const diffX = mouseX - cursorX;
        const diffY = mouseY - cursorY;
        
        cursorX += diffX * 0.1;
        cursorY += diffY * 0.1;
        
        cursorFollow.style.left = cursorX + 'px';
        cursorFollow.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
}

// Theme Toggle
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    updateThemeIcon();
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon();
    });
}

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-mode');
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);
    
    // Active section detection
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Scroll Effects
function initializeScrollEffects() {
    // Bottom blur effect
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
        
        if (scrollPercentage > 0.9) {
            bottomBlurOverlay.style.opacity = Math.max(0, 1 - (scrollPercentage - 0.9) * 10);
        } else {
            bottomBlurOverlay.style.opacity = 1;
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.fade-in-up, .project-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize Animations
function initializeAnimations() {
    // Add fade-in-up class to elements that should animate
    const animatableElements = document.querySelectorAll('.about-card, .certificate-card, .all-skills, .testimonials-cards, .contact-section');
    animatableElements.forEach(el => {
        el.classList.add('fade-in-up');
    });
}

// Project Cards 3D Effect
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const projectBrowser = card.querySelector('.project-browser');
        
        card.addEventListener('', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            projectBrowser.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                scale(1.02)
            `;
        });
        
        card.addEventListener('', function() {
            projectBrowser.style.transform = `
                perspective(1000px) 
                rotateX(5deg) 
                rotateY(-5deg)
                scale(1)
            `;
        });
        
        // Animate cards on scroll
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.2
        });
        
        observer.observe(card);
    });
}

// Certificate Modal
function initializeCertificateModal() {
    const certificateBtns = document.querySelectorAll('.certificate-btn');
    const certificateModal = new bootstrap.Modal(document.getElementById('certificateModal'));
    const certificateImage = document.getElementById('certificateImage');
    
    certificateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const certificateUrl = this.getAttribute('data-certificate');
            certificateImage.src = certificateUrl;
            certificateModal.show();
        });
    });
    
    // Close modal on outside click or escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            certificateModal.hide();
        }
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Close mobile menu after clicking a link
            const navbarCollapse = document.getElementById('navbarNav');
            const navbarToggler = document.querySelector('.navbar-toggler');

            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                // Use Bootstrap's collapse method to close the menu
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                } else {
                    // Fallback: manually close the menu
                    navbarCollapse.classList.remove('show');
                    navbarToggler.classList.add('collapsed');
                    navbarToggler.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const scrolled = window.scrollY;
    const parallaxElements = document.querySelectorAll('.floating-shape');
    
    parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Button Hover Effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Loading Animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger hero content animation
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 300);
});

// Optimize animations for performance
function optimizeAnimations() {
    // Reduce animations on mobile for better performance
    if (window.innerWidth < 768) {
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.3s !important;
                transition-duration: 0.3s !important;
            }
            .floating-shape {
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Call optimization on load and resize
window.addEventListener('load', optimizeAnimations);
window.addEventListener('resize', optimizeAnimations);

// Intersection Observer for better performance
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Error Handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// Service Worker Registration (Optional for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you want to add PWA functionality
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('SW registered: ', registration);
        }).catch(function(registrationError) {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('click', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Performance monitoring
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        // Monitor long tasks for optimization
        if (entry.entryType === 'longtask') {
            console.warn('Long task detected:', entry);
        }
    }
});

// Start observing
try {
    observer.observe({ entryTypes: ['longtask'] });
} catch (e) {
    // Fallback for browsers that don't support longtask
    console.log('Performance monitoring not available');
}