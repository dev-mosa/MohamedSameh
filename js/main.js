// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initTheme();
    initSmoothScroll();
    initScrollAnimations();
    initCustomCursor();
    initCertificateModal();
    initBottomBlur();
    
    // Initialize 3D effects after DOM is loaded
    setTimeout(() => {
        init3DEffects();
    }, 100);
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Mobile menu functionality
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navbarToggler.addEventListener('click', () => {
        navbarToggler.classList.toggle('collapsed');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close mobile menu using Bootstrap collapse
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
                bsCollapse.hide();
            } else {
                // Fallback: manually hide the menu
                navbarCollapse.classList.remove('show');
                navbarToggler.classList.add('collapsed');
                navbarToggler.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Theme toggle functionality
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Smooth scrolling functionality
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .rotate-in, .project-card'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add fade-in class to elements that should animate
    const elementsToAnimate = document.querySelectorAll(
        '.about-card, .service-card, .testimonial-card, .certificate-item'
    );
    
    elementsToAnimate.forEach((element, index) => {
        element.classList.add('fade-in', `stagger-${(index % 6) + 1}`);
        observer.observe(element);
    });
}

// Custom cursor functionality
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        const delay = 0.1;
        cursorX += (mouseX - cursorX) * delay;
        cursorY += (mouseY - cursorY) * delay;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hide cursor on touch devices
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
    }
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll(
        'button, a, .project-card, .certificate-btn, .about-card'
    );
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.background = 'rgba(37, 99, 235, 0.8)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'rgba(255, 255, 255, 0.8)';
        });
    });
}

// Certificate modal functionality
function initCertificateModal() {
    const modal = document.getElementById('certificateModal');
    const modalImage = document.getElementById('certificateImage');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const certificateButtons = document.querySelectorAll('.certificate-btn');
    
    // Certificate images (placeholder URLs)
    const certificates = {
        google: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg',
        meta: 'https://images.pexels.com/photos/159613/ghc-sample-certificate-of-achievement-159613.jpeg',
        microsoft: 'https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg'
    };
    
    certificateButtons.forEach(button => {
        button.addEventListener('click', () => {
            const certificateType = button.getAttribute('data-certificate');
            const imageUrl = certificates[certificateType];
            
            if (imageUrl) {
                modalImage.src = imageUrl;
                modalImage.alt = `${certificateType} Certificate`;
                modal.style.display = 'block';
                
                // Focus management for accessibility
                modal.setAttribute('aria-hidden', 'false');
                modalClose.focus();
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal functionality
    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }
    
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    // Keyboard navigation
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Bottom blur effect
function initBottomBlur() {
    const bottomBlur = document.querySelector('.bottom-blur');
    if (!bottomBlur) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bottomBlur.classList.add('fade-out');
            } else {
                bottomBlur.classList.remove('fade-out');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });
    
    // Observe the last few sections
    const sectionsToWatch = document.querySelectorAll(
        '#contact, .two-panel-section, .testimonials-section'
    );
    
    sectionsToWatch.forEach(section => {
        if (section) observer.observe(section);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization for scroll events
const optimizedScrollHandler = throttle(() => {
    // Handle scroll-based animations here if needed
}, 16); // 60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Handle resize events
const optimizedResizeHandler = debounce(() => {
    // Handle responsive adjustments here if needed
}, 250);

window.addEventListener('resize', optimizedResizeHandler);