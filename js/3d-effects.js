// 3D Effects and Advanced Interactions
class ThreeDEffects {
    constructor() {
        this.tiltElements = [];
        this.init();
    }
    
    init() {
        this.initProjectTilt();
        this.initHeroParallax();
        this.initMouseTracking();
    }
    
    // 3D tilt effect for project cards
    initProjectTilt() {
        const projectCards = document.querySelectorAll('.project-card[data-tilt]');
        
        projectCards.forEach(card => {
            const tiltElement = {
                element: card,
                maxTilt: 15,
                perspective: 1000,
                scale: 1.05,
                speed: 400,
                glare: true
            };
            
            this.tiltElements.push(tiltElement);
            this.bindTiltEvents(tiltElement);
        });
    }
    
    bindTiltEvents(tiltElement) {
        const { element } = tiltElement;
        
        element.addEventListener('mouseenter', () => {
            element.classList.add('tilt-active');
        });
        
        element.addEventListener('mousemove', (e) => {
            this.updateTilt(tiltElement, e);
        });
        
        element.addEventListener('mouseleave', () => {
            this.resetTilt(tiltElement);
        });
    }
    
    updateTilt(tiltElement, event) {
        const { element, maxTilt, perspective, scale } = tiltElement;
        const rect = element.getBoundingClientRect();
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = event.clientX - centerX;
        const mouseY = event.clientY - centerY;
        
        const rotateX = (mouseY / (rect.height / 2)) * maxTilt;
        const rotateY = (mouseX / (rect.width / 2)) * -maxTilt;
        
        const transform = `
            perspective(${perspective}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(${scale}, ${scale}, ${scale})
        `;
        
        element.style.transform = transform;
        
        // Add glare effect
        if (tiltElement.glare) {
            this.updateGlare(element, mouseX, mouseY, rect);
        }
    }
    
    updateGlare(element, mouseX, mouseY, rect) {
        let glareElement = element.querySelector('.tilt-glare');
        
        if (!glareElement) {
            glareElement = document.createElement('div');
            glareElement.className = 'tilt-glare';
            glareElement.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: inherit;
                pointer-events: none;
                background: linear-gradient(45deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 70%);
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            element.appendChild(glareElement);
        }
        
        const glareX = (mouseX / rect.width) * 100;
        const glareY = (mouseY / rect.height) * 100;
        
        glareElement.style.background = `
            linear-gradient(${Math.atan2(mouseY, mouseX) * 180 / Math.PI}deg,
            rgba(255,255,255,0) 30%,
            rgba(255,255,255,0.2) 50%,
            rgba(255,255,255,0) 70%)
        `;
        glareElement.style.opacity = '1';
    }
    
    resetTilt(tiltElement) {
        const { element, speed } = tiltElement;
        
        element.classList.remove('tilt-active');
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        element.style.transition = `all ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
        
        const glareElement = element.querySelector('.tilt-glare');
        if (glareElement) {
            glareElement.style.opacity = '0';
        }
        
        setTimeout(() => {
            element.style.transition = '';
        }, speed);
    }
    
    // Hero section parallax effect
    initHeroParallax() {
        const floatingElements = document.querySelectorAll('.floating-element');
        if (floatingElements.length === 0) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const viewport = window.innerHeight;
            const rate = scrolled * -0.5;
            
            floatingElements.forEach((element, index) => {
                const speed = 0.2 + (index * 0.1);
                const yPos = rate * speed;
                const rotation = scrolled * 0.1;
                
                element.style.transform = `
                    translateY(${yPos}px) 
                    rotate(${rotation}deg)
                `;
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Advanced mouse tracking for hero section
    initMouseTracking() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        });
        
        const animate = () => {
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;
            
            const floatingElements = heroSection.querySelectorAll('.floating-element');
            floatingElements.forEach((element, index) => {
                const intensity = (index + 1) * 5;
                const x = targetX * intensity;
                const y = targetY * intensity;
                
                element.style.transform += ` translate(${x}px, ${y}px)`;
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Sticky scroll effects for projects section
class StickyScrollEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.initProjectsSticky();
        this.initScrollProgress();
    }
    
    initProjectsSticky() {
        const projectsSection = document.querySelector('.projects-section');
        const stickyContent = document.querySelector('.sticky-content');
        const projectsRight = document.querySelector('.projects-right');
        
        if (!projectsSection || !stickyContent || !projectsRight) return;
        
        let ticking = false;
        
        const updateSticky = () => {
            const sectionRect = projectsSection.getBoundingClientRect();
            const rightRect = projectsRight.getBoundingClientRect();
            
            // Calculate progress through the section
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;
            const viewportHeight = window.innerHeight;
            
            const progress = Math.max(0, Math.min(1, 
                (viewportHeight - sectionTop) / (sectionHeight + viewportHeight)
            ));
            
            // Apply subtle scaling and opacity effects based on progress
            const scale = 1 + (progress * 0.05);
            const opacity = 0.8 + (progress * 0.2);
            
            stickyContent.style.transform = `scale(${scale})`;
            stickyContent.style.opacity = opacity;
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateSticky);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    initScrollProgress() {
        // Create progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #2563EB, #3B82F6);
            z-index: 9999;
            transition: width 0.1s ease-out;
        `;
        
        document.body.appendChild(progressBar);
        
        let ticking = false;
        
        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = `${scrollPercent}%`;
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
}

// Advanced image effects
class ImageEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.initImageReveal();
        this.initImageHover();
    }
    
    initImageReveal() {
        const images = document.querySelectorAll('img');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealImage(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transform = 'scale(1.1)';
            img.style.transition = 'all 0.8s ease-out';
            observer.observe(img);
        });
    }
    
    revealImage(img) {
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
    }
    
    initImageHover() {
        const projectImages = document.querySelectorAll('.project-mockup img');
        
        projectImages.forEach(img => {
            const container = img.closest('.project-mockup');
            
            container.addEventListener('mouseenter', () => {
                img.style.filter = 'brightness(1) contrast(1.1) saturate(1.2)';
                img.style.transform = 'scale(1.05)';
            });
            
            container.addEventListener('mouseleave', () => {
                img.style.filter = 'brightness(0.7) contrast(1.2)';
                img.style.transform = 'scale(1)';
            });
        });
    }
}

// Smooth reveal animations for sections
class SectionReveal {
    constructor() {
        this.sections = [];
        this.init();
    }
    
    init() {
        this.prepareSections();
        this.observeSections();
    }
    
    prepareSections() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 1s ease-out';
            this.sections.push(section);
        });
    }
    
    observeSections() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// Initialize all 3D effects
function init3DEffects() {
    // Only initialize on non-mobile devices for performance
    if (window.innerWidth > 768) {
        new ThreeDEffects();
        new StickyScrollEffects();
        new ImageEffects();
        new SectionReveal();
    } else {
        // Lighter version for mobile
        new SectionReveal();
    }
}

// Export for use in main.js
window.init3DEffects = init3DEffects;