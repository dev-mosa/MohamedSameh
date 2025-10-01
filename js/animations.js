// Advanced animations and effects
class ScrollAnimations {
    constructor() {
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.createObservers();
        this.observeElements();
        this.initParallaxEffects();
        this.initCounterAnimations();
    }
    
    createObservers() {
        // Standard scroll observer
        this.observers.set('standard', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Trigger counter animation if element has counter
                    if (entry.target.hasAttribute('data-counter')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        }));
        
        // Parallax observer
        this.observers.set('parallax', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('parallax-active');
                }
            });
        }, {
            threshold: 0,
            rootMargin: '0px'
        }));
    }
    
    observeElements() {
        // Observe elements for standard animations
        const standardElements = document.querySelectorAll(
            '.fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .scale-up, .rotate-in'
        );
        
        standardElements.forEach(element => {
            this.observers.get('standard').observe(element);
        });
        
        // Observe parallax elements
        const parallaxElements = document.querySelectorAll('.parallax-element');
        parallaxElements.forEach(element => {
            this.observers.get('parallax').observe(element);
        });
    }
    
    initParallaxEffects() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax-active');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
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
    
    initCounterAnimations() {
        // Add counter data attributes to stat items
        const statItems = document.querySelectorAll('.stat-item h3');
        statItems.forEach(item => {
            const text = item.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            if (number > 0) {
                item.setAttribute('data-counter', number);
                item.textContent = '0' + text.replace(number.toString(), '');
            }
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const originalText = element.textContent;
        const suffix = originalText.replace(/\d/g, '');
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const current = Math.floor(easeOutExpo * target);
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
}

// Staggered animations for card grids
class StaggeredAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.observeCardGrids();
    }
    
    observeCardGrids() {
        const cardGrids = document.querySelectorAll('.about-cards, .projects-grid, .testimonials .row');
        
        cardGrids.forEach(grid => {
            const cards = grid.querySelectorAll('.about-card, .project-card, .testimonial-card, .power-section');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.staggerCards(cards);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            observer.observe(grid);
        });
    }
    
    staggerCards(cards) {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 100);
        });
    }
}

// Text reveal animations
class TextRevealAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.wrapTextElements();
        this.observeTextElements();
    }
    
    wrapTextElements() {
        const textElements = document.querySelectorAll('.text-reveal');
        
        textElements.forEach(element => {
            const text = element.textContent;
            const words = text.split(' ');
            
            element.innerHTML = words.map(word => 
                `<span class="word">${word}</span>`
            ).join(' ');
        });
    }
    
    observeTextElements() {
        const textElements = document.querySelectorAll('.text-reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateText(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        textElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    animateText(element) {
        const words = element.querySelectorAll('.word');
        
        words.forEach((word, index) => {
            setTimeout(() => {
                word.classList.add('revealed');
            }, index * 100);
        });
    }
}

// Morphing background shapes
class MorphingShapes {
    constructor() {
        this.shapes = [];
        this.init();
    }
    
    init() {
        this.createShapes();
        this.animateShapes();
    }
    
    createShapes() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        for (let i = 0; i < 3; i++) {
            const shape = document.createElement('div');
            shape.className = `morphing-shape shape-${i + 1}`;
            shape.style.cssText = `
                position: absolute;
                width: ${100 + Math.random() * 200}px;
                height: ${100 + Math.random() * 200}px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: ${30 + Math.random() * 40}%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                filter: blur(1px);
                z-index: 1;
            `;
            
            heroSection.appendChild(shape);
            this.shapes.push({
                element: shape,
                x: Math.random() * 100,
                y: Math.random() * 100,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                scale: 1,
                scaleSpeed: (Math.random() - 0.5) * 0.02
            });
        }
    }
    
    animateShapes() {
        const animate = () => {
            this.shapes.forEach(shape => {
                shape.x += shape.speedX;
                shape.y += shape.speedY;
                shape.scale += shape.scaleSpeed;
                
                // Bounce off edges
                if (shape.x <= 0 || shape.x >= 100) shape.speedX *= -1;
                if (shape.y <= 0 || shape.y >= 100) shape.speedY *= -1;
                
                // Scale limits
                if (shape.scale <= 0.5 || shape.scale >= 1.5) shape.scaleSpeed *= -1;
                
                // Apply transforms
                shape.element.style.transform = `translate(${shape.x}vw, ${shape.y}vh) scale(${shape.scale})`;
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Mouse trail effect
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 20;
        this.init();
    }
    
    init() {
        this.createTrail();
        this.bindEvents();
    }
    
    createTrail() {
        for (let i = 0; i < this.maxTrail; i++) {
            const dot = document.createElement('div');
            dot.className = 'trail-dot';
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(37, 99, 235, ${1 - (i / this.maxTrail)});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                opacity: 0;
            `;
            
            document.body.appendChild(dot);
            this.trail.push({ element: dot, x: 0, y: 0 });
        }
    }
    
    bindEvents() {
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animate = () => {
            let x = mouseX;
            let y = mouseY;
            
            this.trail.forEach((dot, index) => {
                dot.element.style.left = x + 'px';
                dot.element.style.top = y + 'px';
                dot.element.style.opacity = index === 0 ? '1' : '0.7';
                
                if (index < this.trail.length - 1) {
                    const nextDot = this.trail[index + 1];
                    x += (nextDot.x - x) * 0.3;
                    y += (nextDot.y - y) * 0.3;
                }
                
                dot.x = x;
                dot.y = y;
            });
            
            requestAnimationFrame(animate);
        };
        
        // Only show trail on non-touch devices
        if (!('ontouchstart' in window)) {
            animate();
        }
    }
}

// Initialize all animation systems
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        new ScrollAnimations();
        new StaggeredAnimations();
        
        // Only create expensive effects on non-mobile devices
        if (window.innerWidth > 768) {
            new TextRevealAnimations();
            new MorphingShapes();
            new MouseTrail();
        }
    }, 500);
});

// CSS classes for animations
const animationStyles = `
    .fade-in-up { 
        opacity: 0; 
        transform: translateY(30px); 
        transition: all 0.6s ease-out; 
    }
    
    .fade-in-up.animate { 
        opacity: 1; 
        transform: translateY(0); 
    }
    
    .fade-in-down { 
        opacity: 0; 
        transform: translateY(-30px); 
        transition: all 0.6s ease-out; 
    }
    
    .fade-in-down.animate { 
        opacity: 1; 
        transform: translateY(0); 
    }
    
    .fade-in-left { 
        opacity: 0; 
        transform: translateX(-30px); 
        transition: all 0.6s ease-out; 
    }
    
    .fade-in-left.animate { 
        opacity: 1; 
        transform: translateX(0); 
    }
    
    .fade-in-right { 
        opacity: 0; 
        transform: translateX(30px); 
        transition: all 0.6s ease-out; 
    }
    
    .fade-in-right.animate { 
        opacity: 1; 
        transform: translateX(0); 
    }
    
    .scale-up { 
        opacity: 0; 
        transform: scale(0.8); 
        transition: all 0.6s ease-out; 
    }
    
    .scale-up.animate { 
        opacity: 1; 
        transform: scale(1); 
    }
    
    .rotate-in { 
        opacity: 0; 
        transform: rotate(-10deg) scale(0.9); 
        transition: all 0.6s ease-out; 
    }
    
    .rotate-in.animate { 
        opacity: 1; 
        transform: rotate(0deg) scale(1); 
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    .text-reveal .word {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s ease-out;
    }
    
    .text-reveal .word.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .parallax-element {
        transition: transform 0.1s ease-out;
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);