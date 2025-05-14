/**
 * Portfolio Main JavaScript
 * Handles core functionality, content loading, and initialization
 */

// Global Configuration
const CONFIG = {
    contentPath: 'data/content.json',
    schemaPath: 'data/schema.json',
    defaultThemeColor: 'orange',
    defaultAccentColor: 'amber'
};

// Main application state
const APP_STATE = {
    content: null,
    schema: null,
    themeColors: {
        blue: { 
            primary: '#2563eb', 
            secondary: '#1e40af'
        },
        green: { 
            primary: '#10b981', 
            secondary: '#047857'
        },
        purple: { 
            primary: '#8b5cf6', 
            secondary: '#6d28d9'
        },
        orange: { 
            primary: '#f97316', 
            secondary: '#ea580c' 
        },
        // Add more theme color options here
    }
};

/**
 * Initialize the application
 */
async function initializeApp() {
    try {
        // Load content and schema
        await loadContent();
        
        // Render content
        renderPortfolio(APP_STATE.content);
        
        // Initialize all interactive functionality
        initializeInteractivity();
        
        console.log('Portfolio initialized successfully');
    } catch (error) {
        console.error('Error initializing portfolio:', error);
        showErrorMessage();
    }
}

/**
 * Load content and schema from JSON files
 */
async function loadContent() {
    try {
        // Fetch content
        const contentResponse = await fetch(CONFIG.contentPath);
        if (!contentResponse.ok) {
            throw new Error(`Failed to load content (${contentResponse.status})`);
        }
        APP_STATE.content = await contentResponse.json();
        
        // Fetch schema (optional, used for validation)
        try {
            const schemaResponse = await fetch(CONFIG.schemaPath);
            if (schemaResponse.ok) {
                APP_STATE.schema = await schemaResponse.json();
                // Validate content against schema (if available)
                if (APP_STATE.schema) {
                    // Basic validation (more complete validation would use a library like Ajv)
                    validateRequiredFields();
                }
            }
        } catch (schemaError) {
            console.warn('Schema not available, skipping validation');
        }
        
        return APP_STATE.content;
    } catch (error) {
        console.error('Error loading content:', error);
        throw error;
    }
}

/**
 * Simple validation of required fields
 */
function validateRequiredFields() {
    // Check minimal required fields
    if (!APP_STATE.content.meta?.title) {
        console.warn('Missing required field: meta.title');
    }
    
    if (!APP_STATE.content.profile?.name) {
        console.warn('Missing required field: profile.name');
    }
    
    if (!APP_STATE.content.profile?.title) {
        console.warn('Missing required field: profile.title');
    }
}

/**
 * Initialize all interactive functionality
 */
function initializeInteractivity() {
    // Initialize intersection observer for animation on scroll
    initializeScrollAnimations();
    
    // Initialize skill bar animations
    initializeSkillBars();
    
    // Initialize smooth scrolling
    initializeSmoothScroll();
    
    // Initialize back to top button
    initializeBackToTop();
    
    // Initialize mobile menu
    initializeMobileMenu();
}

/**
 * Initialize animations triggered by scrolling
 */
function initializeScrollAnimations() {
    try {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // If user prefers reduced motion, apply animations immediately without transitions
        if (prefersReducedMotion) {
            console.info('User prefers reduced motion, applying animations instantly');
            document.querySelectorAll('[data-animation]').forEach(element => {
                // Add the class without animation classes
                element.classList.add('animated-content');
                // Remove animate.css classes that might cause motion
                element.classList.remove('animate__animated');
                // Make sure element is visible
                element.style.opacity = '1';
            });
            return;
        }
        
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, animations may not work');
            // Apply animations immediately as fallback
            document.querySelectorAll('[data-animation]').forEach(element => {
                const animation = element.dataset.animation;
                const delay = element.dataset.animationDelay;
                
                if (animation) {
                    if (delay) {
                        element.style.animationDelay = delay;
                    }
                    element.classList.add('animate__animated', animation);
                }
            });
            return;
        }
        
        // Create intersection observer with improved settings
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animation = entry.target.dataset.animation;
                    const delay = entry.target.dataset.animationDelay;
                    
                    if (animation) {
                        // Apply delay if specified
                        if (delay) {
                            entry.target.style.animationDelay = delay;
                        }
                        
                        // Add animation classes
                        entry.target.classList.add('animate__animated', animation);
                        
                        // Add a class to mark as animated
                        entry.target.classList.add('has-animated');
                        
                        // Stop observing this element
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, { 
            // Increased threshold - element must be 25% visible to trigger animation
            threshold: 0.25, 
            // No negative margin to ensure element is actually visible
            rootMargin: '0px 0px 0px 0px' 
        });
        
        // Add initial state for elements that will be animated
        document.querySelectorAll('[data-animation]').forEach(element => {
            // Start with opacity 0 to prevent flash of content
            // Only if the element doesn't already have a specific opacity set
            if (!element.style.opacity) {
                element.style.opacity = '0';
            }
            observer.observe(element);
        });
        
        // Handle elements that are already in the viewport on page load
        setTimeout(() => {
            document.querySelectorAll('[data-animation]:not(.has-animated)').forEach(element => {
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                
                if (rect.top <= windowHeight * 0.75) {
                    const animation = element.dataset.animation;
                    const delay = element.dataset.animationDelay;
                    
                    if (animation) {
                        if (delay) {
                            element.style.animationDelay = delay;
                        }
                        element.classList.add('animate__animated', animation, 'has-animated');
                        observer.unobserve(element);
                    }
                }
            });
        }, 300);
        
    } catch (error) {
        console.error('Error initializing scroll animations:', error);
        // Apply animations immediately as fallback
        document.querySelectorAll('[data-animation]').forEach(element => {
            const animation = element.dataset.animation;
            // Make elements visible without animation
            element.style.opacity = '1';
            element.classList.add('animated-content');
        });
    }
}

/**
 * Initialize skill bar animations
 */
function initializeSkillBars() {
    try {
        const skillBars = document.querySelectorAll('.skill-bar');
        
        if (skillBars.length === 0) {
            return;
        }
        
        // Create an observer for skill bars
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const level = bar.getAttribute('data-level') || '0%';
                    
                    // Set CSS variable for the skill level
                    bar.style.setProperty('--skill-level', level);
                    
                    // Force reflow to ensure animation works
                    void bar.offsetWidth;
                    
                    // Add animated class after a short delay
                    setTimeout(() => {
                        bar.classList.add('animated');
                        // Direct style as fallback
                        bar.style.width = level;
                    }, 400);
                    
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.2 });
        
        // Observe all skill bars
        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    } catch (error) {
        console.error('Error initializing skill bars:', error);
        
        // Fallback method if observer fails
        document.querySelectorAll('.skill-bar').forEach(bar => {
            const level = bar.getAttribute('data-level') || '0%';
            bar.style.width = level;
        });
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                const mobileMenuButton = document.getElementById('mobile-menu-button');
                
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    if (mobileMenuButton) {
                        mobileMenuButton.setAttribute('aria-expanded', 'false');
                    }
                }
                
                // Scroll to target
                window.scrollTo({
                    top: target.offsetTop - 80, // Adjusted for header
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize back to top button
 */
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    
    // Show button after scrolling down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
            backToTopButton.style.display = 'flex';
        } else {
            backToTopButton.classList.remove('visible');
            setTimeout(() => {
                if (!backToTopButton.classList.contains('visible')) {
                    backToTopButton.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Update aria-expanded state
            const isExpanded = !mobileMenu.classList.contains('hidden');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded.toString());
        });
        
        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

/**
 * Show error message if initialization fails
 */
function showErrorMessage() {
    document.getElementById('app').innerHTML = `
        <div class="flex justify-center items-center min-h-screen">
            <div class="text-center">
                <div class="text-red-600 text-6xl mb-4">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h1 class="text-2xl font-bold mb-2">Error Loading Portfolio</h1>
                <p>Sorry, we couldn't load the portfolio content. Please try again later.</p>
            </div>
        </div>
    `;
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);