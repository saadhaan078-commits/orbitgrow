// ===== script.js — OrbitGrow Enhanced =====
(function () {
    'use strict';

    // ===== PAGE PRELOADER =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('loaded');
            document.body.classList.add('page-ready');
            setTimeout(() => preloader.remove(), 600);
        });
    }

    // ===== HEADER SCROLL (throttled) =====
    const header = document.getElementById('siteHeader');
    let lastScroll = 0;
    let headerTicking = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        if (header) {
            header.classList.toggle('scrolled', scrollY > 30);
            // Hide header on scroll down, show on scroll up
            if (scrollY > 300) {
                header.classList.toggle('header-hidden', scrollY > lastScroll && scrollY - lastScroll > 5);
            } else {
                header.classList.remove('header-hidden');
            }
        }
        lastScroll = scrollY;
        headerTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!headerTicking) {
            requestAnimationFrame(updateHeader);
            headerTicking = true;
        }
    }, { passive: true });

    // ===== MOBILE NAV =====
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navLinks.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.classList.remove('nav-open');
        }));
    }

    // ===== ACTIVE NAV LINK BASED ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    function highlightNav() {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navAnchors.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === '#' + id ||
                        a.getAttribute('href').includes(id)) {
                        a.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ===== REVEAL OBSERVER (unified, performant) =====
    const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-bottom, .reveal-scale';
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(revealSelectors).forEach(el => revealObserver.observe(el));

    // ===== STAGGER CHILDREN =====
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.stagger-children, .stagger-left').forEach(el => staggerObserver.observe(el));

    // ===== HERO COUNTERS (scroll-triggered) =====
    const heroStats = document.getElementById('heroStats');
    if (heroStats) {
        const numVals = heroStats.querySelectorAll('.num-val');
        let heroCountersAnimated = false;

        function animateHeroCounters() {
            if (heroCountersAnimated) return;
            heroCountersAnimated = true;
            numVals.forEach(el => {
                const target = parseFloat(el.dataset.target);
                const isDecimal = target % 1 !== 0;
                const duration = 1800;
                const start = performance.now();

                function tick(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const val = target * eased;
                    el.textContent = isDecimal ? val.toFixed(1) : Math.round(val);
                    if (progress < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            });
        }

        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !heroCountersAnimated) animateHeroCounters();
            });
        }, { threshold: 0.3 });
        heroObserver.observe(heroStats);

        if (heroStats.getBoundingClientRect().top < window.innerHeight) animateHeroCounters();
    }

    // ===== COUNTERS (section) =====
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const isDecimal = el.dataset.count.includes('.');
                const duration = 1600;
                const start = performance.now();

                function tick(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const val = target * eased;
                    el.textContent = isDecimal ? val.toFixed(1) : Math.round(val);
                    if (progress < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.4 });
    counters.forEach(el => counterObserver.observe(el));

    // ===== SERVICES LIST — slide from left =====
    const serviceRows = document.querySelectorAll('.service-row');
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                serviceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    serviceRows.forEach(row => serviceObserver.observe(row));

    // ===== PROCESS STEPS — staggered =====
    const processSteps = document.querySelectorAll('.p-step');
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                processObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    processSteps.forEach(step => processObserver.observe(step));

    // ===== INDUSTRIES — zoom in =====
    const industryItems = document.querySelectorAll('.industry-item');
    const industryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('zoom-in'), 50 + index * 60);
                industryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    industryItems.forEach(item => industryObserver.observe(item));

    // ===== BADGE COUNTERS =====
    const badgeEls = document.querySelectorAll('.count-badge');
    const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const isDecimal = el.dataset.target.includes('.');
                const duration = 1400;
                const start = performance.now();

                function tick(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const val = 1 + (target - 1) * eased;
                    el.textContent = isDecimal ? val.toFixed(1) : Math.round(val);
                    if (progress < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                badgeObserver.unobserve(el);
            }
        });
    }, { threshold: 0.3 });
    badgeEls.forEach(el => badgeObserver.observe(el));

    // ===== YEAR =====
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ===== SERVICES JS (HOME PAGE) =====
    const icons = {
        branding: `<svg viewBox="0 0 24 24" fill="none" stroke="#0d1f1e" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
        smm: `<svg viewBox="0 0 24 24" fill="none" stroke="#0d1f1e" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
        ads: `<svg viewBox="0 0 24 24" fill="none" stroke="#0d1f1e" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
        leads: `<svg viewBox="0 0 24 24" fill="none" stroke="#0d1f1e" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        seo: `<svg viewBox="0 0 24 24" fill="none" stroke="#0d1f1e" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
        webdev: `<svg viewBox="0 0 24 24" fill="none" stroke="#0d1f1e" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
    };

    const data = {
        branding: { num: '01', title: 'Branding', body: 'We craft powerful brand identities that resonate with your target audience. From logo design to complete brand guidelines, we build lasting impressions that set you apart from the competition and make your business unforgettable.', tags: ['Logo Design', 'Brand Strategy', 'Identity', 'Guidelines', 'Visual Language'] },
        smm: { num: '02', title: 'Social Media Marketing', body: 'We grow your presence across Instagram, Facebook, TikTok, LinkedIn and beyond. From content calendars to community management, we turn followers into customers with data-backed strategies tailored to your brand voice.', tags: ['Instagram', 'Facebook', 'TikTok', 'Content Creation', 'Community Management'] },
        ads: { num: '03', title: 'Meta and Google Ads', body: 'Maximize your ad spend with precision-targeted campaigns on Meta and Google. We research, build, and optimise paid campaigns that drive real conversions — not just clicks — so every rupee works harder for your business.', tags: ['Meta Ads', 'Google Ads', 'Retargeting', 'A/B Testing', 'Conversion Tracking'] },
        leads: { num: '04', title: 'Lead Generation', body: 'We build end-to-end lead generation systems that fill your sales pipeline with high-quality prospects. From landing pages to email funnels, we design every touchpoint to capture, nurture, and convert leads at scale.', tags: ['Landing Pages', 'Email Funnels', 'CRM Integration', 'Automation', 'Conversion Optimisation'] },
        seo: { num: '05', title: 'SEO', body: 'Data-driven search engine optimisation that drives organic traffic and boosts your rankings. We analyse, optimise, and monitor to ensure your business stays at the top of search results and attracts the right audience consistently.', tags: ['On-Page SEO', 'Link Building', 'Technical SEO', 'Keywords', 'Analytics'] },
        webdev: { num: '06', title: 'Web Development', body: 'We build fast, scalable, and visually striking websites that make a strong first impression. From landing pages to full e-commerce platforms, our development work is clean, responsive, and built to convert visitors into customers.', tags: ['React', 'Next.js', 'WordPress', 'E-Commerce', 'Responsive Design'] }
    };

    function renderCard(key) {
        const d = data[key];
        const card = document.getElementById('svc-card');
        if (!card) return;
        card.classList.remove('card-anim');
        void card.offsetWidth;
        card.classList.add('card-anim');
        card.innerHTML = `
          <div class="card-icon-wrap">${icons[key]}</div>
          <div class="card-title">${d.title}</div>
          <div class="card-body">${d.body}</div>
          <div class="card-tags">${d.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <div class="card-num">${d.num}</div>
        `;
    }

    function setActive(row) {
        document.querySelectorAll('.service-row').forEach(r => r.classList.remove('active'));
        row.classList.add('active');
        renderCard(row.dataset.key);
    }
    window.setActive = setActive;

    const serviceKeys = ['branding', 'smm', 'ads', 'leads', 'seo', 'webdev'];
    let currentIndex = 0;

    function nextService() {
        currentIndex = (currentIndex + 1) % serviceKeys.length;
        const rows = document.querySelectorAll('.service-row');
        rows.forEach(row => {
            if (row.dataset.key === serviceKeys[currentIndex]) setActive(row);
        });
    }
    window.nextService = nextService;

    const initialCard = document.querySelector('.service-row.active');
    if (initialCard) renderCard(initialCard.dataset.key);
    else if (document.getElementById('svc-card')) renderCard('branding');

    // ===== REVIEWS TICKER =====
    const reviewsData = [
        { name: "Ali Khan", company: "TechStart", quote: "OrbitGrow transformed our online presence completely. Our leads tripled within the first month." },
        { name: "Sara Ahmed", company: "Nexus Solutions", quote: "The team at OrbitGrow truly understands digital growth. Best investment we made for our business." },
        { name: "Usman Malik", company: "GrowFast", quote: "Professional, creative, and results-driven. ROI increased by 200% in just 60 days." },
        { name: "Fatima Noor", company: "StyleHub", quote: "Our social media engagement exploded. OrbitGrow delivered beyond our expectations." },
        { name: "Hassan Raza", company: "CodeCraft", quote: "The web development was top-notch. We saw immediate results from day one." },
        { name: "Zara Sheikh", company: "HealthPlus", quote: "Google Ads campaign was a game changer for our patient acquisition." },
        { name: "Imran Ali", company: "BuildRight", quote: "OrbitGrow helped us scale to new markets with their data-driven approach." },
        { name: "Ayesha Khan", company: "GlowUp", quote: "The branding work was exceptional. Our conversion rates have never been higher." },
        { name: "Bilal Ahmed", company: "E-Shop", quote: "A true partner in our growth journey. The team is responsive and innovative." },
        { name: "Nadia Hasan", company: "TravelX", quote: "We've seen consistent growth every month since partnering with OrbitGrow." },
        { name: "Omar Farooq", company: "FitLife", quote: "OrbitGrow made digital marketing simple and effective. Highly recommended!" },
        { name: "Hina Tariq", company: "GlobalTrade", quote: "Our B2B leads increased by 150% within the first quarter." },
        { name: "Salman Butt", company: "LuxeLiving", quote: "The team's strategic approach helped us dominate our local market." },
        { name: "Rabia Siddiqui", company: "BeautyCo", quote: "OrbitGrow's creative team brought our brand vision to life perfectly." },
        { name: "Faisal Javed", company: "SmartHome", quote: "We've saved 40% on ad spend while doubling our conversions." },
        { name: "Amna Sheikh", company: "EduFuture", quote: "Student enrollment increased by 75% through their targeted campaigns." },
        { name: "Tariq Mehmood", company: "GreenTech", quote: "OrbitGrow's SEO strategy put us on the first page for our key keywords." },
        { name: "Sana Khan", company: "FreshMart", quote: "Our online orders have grown 3x since we started working with OrbitGrow." }
    ];

    const tickerTrack = document.getElementById('tickerTrack');
    if (tickerTrack) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F1948A', '#82E0AA', '#F8C471', '#AF7AC5', '#5DADE2', '#58D68D', '#F5B7B1', '#D4E6F1'];
        const allReviews = [...reviewsData, ...reviewsData];
        tickerTrack.innerHTML = allReviews.map((review, index) => {
            const initials = review.name.split(' ').map(n => n[0]).join('');
            const color = colors[index % colors.length];
            return `
                <div class="ticker-item">
                    <div class="ticker-stars">
                        <svg viewBox="0 0 24 24"><path d="M12 2l3 7 7 .6-5.4 4.6 1.8 7-6.4-4-6.4 4 1.8-7L1 9.6 8 9z"/></svg>
                        <svg viewBox="0 0 24 24"><path d="M12 2l3 7 7 .6-5.4 4.6 1.8 7-6.4-4-6.4 4 1.8-7L1 9.6 8 9z"/></svg>
                        <svg viewBox="0 0 24 24"><path d="M12 2l3 7 7 .6-5.4 4.6 1.8 7-6.4-4-6.4 4 1.8-7L1 9.6 8 9z"/></svg>
                        <svg viewBox="0 0 24 24"><path d="M12 2l3 7 7 .6-5.4 4.6 1.8 7-6.4-4-6.4 4 1.8-7L1 9.6 8 9z"/></svg>
                        <svg viewBox="0 0 24 24"><path d="M12 2l3 7 7 .6-5.4 4.6 1.8 7-6.4-4-6.4 4 1.8-7L1 9.6 8 9z"/></svg>
                    </div>
                    <div class="ticker-quote">"${review.quote}"</div>
                    <div class="ticker-author">
                        <div class="ticker-avatar" style="background:${color}">${initials}</div>
                        <div>
                            <div class="ticker-name">${review.name}</div>
                            <div class="ticker-company">${review.company}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const top = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== PARALLAX ON HERO ELEMENTS =====
    const heroGlow = document.querySelector('.hero-glow');
    const floatCards = document.querySelectorAll('.float-card');

    function parallaxHero() {
        const scrollY = window.scrollY;
        if (scrollY > window.innerHeight) return;
        if (heroGlow) {
            heroGlow.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        floatCards.forEach((card, i) => {
            const speed = i === 0 ? 0.15 : 0.1;
            card.style.transform = `translateY(${scrollY * speed}px) ${card.classList.contains('fc-left') ? '' : ''}`;
        });
    }

    if (heroGlow || floatCards.length) {
        window.addEventListener('scroll', () => requestAnimationFrame(parallaxHero), { passive: true });
    }

    // ===== BACK TO TOP BUTTON =====
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 600);
        }, { passive: true });
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== LAZY IMAGE FADE-IN =====
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', () => { img.style.opacity = '1'; });
        }
    });

    // ===== SCROLL PROGRESS BAR =====
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / scrollHeight) * 100;
            progressBar.style.width = scrolled + '%';
        }, { passive: true });
    }

    // ===== ABOUT PAGE: STICKY IMAGE ON SCROLL =====
    const storyVisual = document.querySelector('.story-visual');
    const storySection = document.querySelector('.story-section');
    if (storyVisual && storySection) {
        let ticking = false;
        function updateSticky() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const rect = storySection.getBoundingClientRect();
                    const visualHeight = storyVisual.offsetHeight;
                    if (rect.top <= 100 && rect.bottom >= visualHeight + 100) {
                        storyVisual.style.position = 'sticky';
                        storyVisual.style.top = '100px';
                        storyVisual.style.alignSelf = 'start';
                    } else if (rect.bottom < visualHeight + 100) {
                        storyVisual.style.position = 'relative';
                        storyVisual.style.top = '0';
                        storyVisual.style.alignSelf = 'end';
                    } else {
                        storyVisual.style.position = 'sticky';
                        storyVisual.style.top = '100px';
                        storyVisual.style.alignSelf = 'start';
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }
        window.addEventListener('scroll', updateSticky, { passive: true });
        window.addEventListener('resize', updateSticky);
        setTimeout(updateSticky, 100);
    }

    // ===== TILT EFFECT ON CARDS (desktop only) =====
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const tiltCards = document.querySelectorAll('.svc-card, .main-card, .mission-card, .service-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ===== KEYBOARD ACCESSIBILITY: ESC closes mobile nav =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.classList.remove('nav-open');
        }
    });

})();
