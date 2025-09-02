// Global Variables
let currentTheme = localStorage.getItem('theme') || 'light';
const typingTexts = ['Frontend Developer', 'UI/UX Designer', 'Web Developer', 'Creative Coder'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeTypingAnimation();
    initializeScrollAnimations();
    initializeContactForm();
    initializeScrollToTop();
    initializeDownloadButton();
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
}

// Navigation Management
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling and active section highlighting
    window.addEventListener('scroll', handleScroll);
    
    // Initialize active link
    updateActiveNavLink();
}

function handleScroll() {
    updateActiveNavLink();
    handleScrollAnimations();
    handleScrollToTopButton();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Typing Animation
function initializeTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    
    function type() {
        const currentText = typingTexts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % typingTexts.length;
                setTimeout(type, 500);
                return;
            }
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
        }
        
        const typeSpeed = isDeleting ? 50 : 100;
        setTimeout(type, typeSpeed);
    }
    
    // Start typing animation
    setTimeout(type, 1000);
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBar(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.skill-item, .timeline-item, .project-card').forEach(el => {
        observer.observe(el);
    });
}

function handleScrollAnimations() {
    // This function can be used for additional scroll-based animations
}

function animateSkillBar(skillItem) {
    const progressBar = skillItem.querySelector('.skill-progress');
    const width = progressBar.getAttribute('data-width');
    
    setTimeout(() => {
        progressBar.style.width = width + '%';
    }, 300);
}

// Contact Form Management
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', handleFormSubmission);
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrorMessage);
    });
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Validate name
    if (name === '') {
        showError('nameError', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (message === '') {
        showError('messageError', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    if (isValid) {
        // Simulate form submission
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you soon.');
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }
}

function validateField(e) {
    const field = e.target;
    const fieldName = field.name;
    const value = field.value.trim();
    
    switch (fieldName) {
        case 'name':
            if (value === '') {
                showError('nameError', 'Name is required');
            } else if (value.length < 2) {
                showError('nameError', 'Name must be at least 2 characters');
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value === '') {
                showError('emailError', 'Email is required');
            } else if (!emailRegex.test(value)) {
                showError('emailError', 'Please enter a valid email address');
            }
            break;
            
        case 'message':
            if (value === '') {
                showError('messageError', 'Message is required');
            } else if (value.length < 10) {
                showError('messageError', 'Message must be at least 10 characters');
            }
            break;
    }
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearErrorMessage(e) {
    const field = e.target;
    const errorId = field.name + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Scroll to Top Button
function initializeScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function handleScrollToTopButton() {
    const scrollButton = document.getElementById('scrollToTop');
    
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('show');
    } else {
        scrollButton.classList.remove('show');
    }
}

// Download Resume Button
function initializeDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    
    downloadBtn.addEventListener('click', function() {
        // Download the PDF resume
        const a = document.createElement('a');
        a.href = 'https://drive.google.com/file/d/1ooGeS2bOoqZeSnyCLOy3KiikMh7a1Drd/view?usp=drive_link';
        a.download = 'D_GUNABALA_Resume.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Show feedback
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Downloaded!';
        downloadBtn.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            downloadBtn.textContent = originalText;
            downloadBtn.style.background = '';
        }, 2000);
    });
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add some additional interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero');
        
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    });
});

// Additional utility functions
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(handleScroll, 10);
window.addEventListener('scroll', optimizedScrollHandler);

// Add loading animation for page elements
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate elements on page load
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate');
        }, index * 100);
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Enhanced accessibility
function enhanceAccessibility() {
    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll('button, a, input, textarea');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Performance optimization for animations
function requestAnimationFrame(callback) {
    return window.requestAnimationFrame || 
           window.webkitRequestAnimationFrame || 
           window.mozRequestAnimationFrame || 
           window.oRequestAnimationFrame || 
           window.msRequestAnimationFrame ||
           function(callback) {
               window.setTimeout(callback, 1000 / 60);
           };
}

// Preload images for better performance
function preloadImages() {
    const images = [
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/270348/pexels-photo-270348.jpg?auto=compress&cs=tinysrgb&w=600'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
document.addEventListener('DOMContentLoaded', preloadImages);