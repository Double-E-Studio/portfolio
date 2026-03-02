/* ============================================
   DOUBLE-E STUDIO — script.js
   ============================================ */

(function () {
  'use strict';

  /* ─── Navbar scroll behaviour ────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* ─── Hamburger menu ─────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ─── Scroll-triggered fade-in ───────────── */
  const fadeEls = document.querySelectorAll('.fade-in, .app-card, .team-card, .studio-contact-card, .connect-card, .form-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Slight stagger for sibling elements
        const siblings = [...entry.target.parentElement.children];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 0.08) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeEls.forEach(el => observer.observe(el));

  /* ─── Floating particles ─────────────────── */
  const container = document.getElementById('particles');
  if (container) {
    const PARTICLE_COUNT = 28;
    const colors = ['rgba(124,58,237,0.5)', 'rgba(59,130,246,0.4)', 'rgba(34,197,94,0.35)', 'rgba(167,139,250,0.45)'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const size  = Math.random() * 3 + 1.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left  = Math.random() * 100;
      const dur   = Math.random() * 14 + 10;
      const delay = Math.random() * 18;

      p.style.cssText = `
        width:${size}px;
        height:${size}px;
        background:${color};
        left:${left}%;
        animation-duration:${dur}s;
        animation-delay:-${delay}s;
        border-radius:50%;
      `;
      container.appendChild(p);
    }
  }

  /* ─── Smooth anchor scroll ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Tilt effect on app cards ───────────── */
  document.querySelectorAll('.app-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const maxRot = 3;
      card.style.transform = `perspective(1000px) rotateY(${dx * maxRot}deg) rotateX(${-dy * maxRot}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── Count-up animation for hero stats ──── */
  (function initCountUp() {
    const counters = document.querySelectorAll('.stat-value[data-target]');
    if (!counters.length) return;

    const DURATION = 1600; // ms
    const DELAY    = 400;  // wait a bit after page load

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function animateCounter(el) {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const start  = performance.now() + DELAY;

      function step(now) {
        const elapsed  = Math.max(0, now - start);
        const progress = Math.min(elapsed / DURATION, 1);
        const value    = Math.round(easeOutQuart(progress) * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    // Trigger once the hero brand becomes visible
    const heroBrand = document.querySelector('.hero-brand');
    if (!heroBrand) return;

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(animateCounter);
          heroObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    heroObserver.observe(heroBrand);
  })();

  /* ─── Active nav link highlight ───────────── */
  (function initActiveNav() {
    const path = window.location.pathname;
    const isContact = path.endsWith('contact.html');
    const allNavLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    function clearActive() {
      allNavLinks.forEach(a => a.classList.remove('active'));
    }
    function setActive(href) {
      clearActive();
      allNavLinks.forEach(a => {
        if (a.getAttribute('href') === href) a.classList.add('active');
      });
    }

    // Contact page: always highlight Contact, no scroll tracking needed
    if (isContact) {
      setActive('contact.html');
      return;
    }

    // Index page: switch between Home and Projects based on scroll position
    const appsSection = document.getElementById('apps');
    function updateScroll() {
      if (appsSection && window.scrollY >= appsSection.offsetTop - 150) {
        setActive('#apps');
      } else {
        setActive('index.html');
      }
    }
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
  })();

  /* ─── Micro-copy year updater ─────────────── */
  document.querySelectorAll('.year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

})();
