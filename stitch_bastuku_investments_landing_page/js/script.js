// Bastuku Investments Landing Page - Main Script

// ==========================================
// Theme Toggle (Dark Mode)
// ==========================================
function initThemeToggle() {
    const buttons = [
        { id: 'themeToggle', sunIcon: 'sunIcon', moonIcon: 'moonIcon' },
        { id: 'themeToggleMobile', sunIcon: 'sunIconMobile', moonIcon: 'moonIconMobile' }
    ];
    
    const isDark = localStorage.getItem('theme') === 'dark' || 
                  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
        document.documentElement.classList.add('dark');
    }
    
    buttons.forEach(btn => {
        const toggle = document.getElementById(btn.id);
        if (!toggle) return;
        
        toggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcons();
        });
    });
    
    function updateIcons() {
        buttons.forEach(btn => {
            const sun = document.getElementById(btn.sunIcon);
            const moon = document.getElementById(btn.moonIcon);
            const isDark = document.documentElement.classList.contains('dark');
            
            if (sun && moon) {
                sun.classList.toggle('hidden', !isDark);
                moon.classList.toggle('hidden', isDark);
            }
        });
    }
    
    updateIcons();
}

// ==========================================
// Mobile Menu Toggle
// ==========================================
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    if (!toggleBtn) return;

    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    if (!mobileMenu) return;

    toggleBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden');
        toggleBtn.setAttribute('aria-expanded', !isHidden);

        if (menuIcon && closeIcon) {
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        }
    });

    // Close menu when a link or button is clicked
    mobileMenu.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            toggleBtn.setAttribute('aria-expanded', 'false');
            if (menuIcon) menuIcon.classList.remove('hidden');
            if (closeIcon) closeIcon.classList.add('hidden');
        });
    });
}

// ==========================================
// Scroll-based Animations
// ==========================================
function initScrollAnimations() {
    // Original scroll-animate observer
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        sectionObserver.observe(el);
    });

    // Reveal animations for individual elements
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
    });

    // Section-level reveals — more generous threshold
    const sectionRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                sectionRevealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.section-reveal').forEach(el => {
        sectionRevealObserver.observe(el);
    });
}

// ==========================================
// Animated Stat Counters
// ==========================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
}

function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    const suffix = el.dataset.suffix || '';

    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth ease-out expo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.round(eased * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// ==========================================
// Subtle Parallax on Scroll
// ==========================================
function initParallax() {
    const floatingEls = document.querySelectorAll('.floating, .floating-reverse, .floating-slow');
    if (!floatingEls.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                floatingEls.forEach(el => {
                    const speed = el.classList.contains('floating-slow') ? 0.02 : 0.04;
                    const direction = el.classList.contains('floating-reverse') ? -1 : 1;
                    el.style.transform = `translateY(${scrollY * speed * direction}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ==========================================
// Smooth Scroll to Contact
// ==========================================
function scrollToContact() {
    const quoteSection = document.getElementById('quote');
    if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
        // Focus the first input after scroll for better UX
        setTimeout(() => {
            const firstInput = quoteSection.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 600);
    }
}

// Make function globally available
window.scrollToContact = scrollToContact;

// ==========================================
// Initialize on Page Load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    initScrollAnimations();
    initCounters();
    initParallax();
    initQuoteForm();

    // Unified scroll handler — header shadow + progress bar
    const header = document.querySelector('header');
    const progressBar = document.getElementById('scrollProgress');
    let scrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // Header shadow
                if (scrollY > 10) {
                    header.classList.add('shadow-lg');
                } else {
                    header.classList.remove('shadow-lg');
                }

                // Scroll progress bar
                if (progressBar) {
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
                    progressBar.style.width = progress + '%';
                }

                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });
});

// ==========================================
// Quote Form Handler
// ==========================================
function initQuoteForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(form);
        const name = data.get('name');
        const phone = data.get('phone');
        const email = data.get('email') || 'Not provided';
        const service = data.get('service');
        const message = data.get('message') || 'No details provided';

        // Build mailto or WhatsApp link
        const subject = encodeURIComponent(`Quote Request: ${service}`);
        const body = encodeURIComponent(
            `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nDetails: ${message}`
        );

        // Open email client with pre-filled details
        window.location.href = `mailto:info@bastuku.com?subject=${subject}&body=${body}`;

        // Show success state
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined text-lg">check_circle</span> Sent! We\'ll be in touch soon';
        btn.classList.add('bg-green-600');
        btn.classList.remove('bg-primary');
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('bg-green-600');
            btn.classList.add('bg-primary');
            btn.disabled = false;
            form.reset();
        }, 4000);
    });
}

