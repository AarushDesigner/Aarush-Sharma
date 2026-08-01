/* ============================================================
   AARUSH DESIGNER — CORE INTERACTIONS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading screen ---------- */
  const loader = document.querySelector('.loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('is-hidden'), 500);
  });

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
    updateScrollProgress();
    toggleBackToTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.navbar__toggle');
  const links = document.querySelector('.navbar__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-open');
      links.classList.toggle('is-open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      links.classList.remove('is-open');
    }));
  }

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.querySelector('.scroll-progress');
  function updateScrollProgress() {
    if (!progressBar) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.querySelector('.back-to-top');
  function toggleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 600) backToTop.classList.add('is-visible');
    else backToTop.classList.remove('is-visible');
  }
  backToTop && backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Custom cursor (desktop only) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (dot) { dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; }
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ring) { ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px'; }
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .card, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => ring && ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring && ring.classList.remove('is-active'));
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main [id]');
  const navLinks = document.querySelectorAll('.navbar__links a[href*="#"]');
  if (sections.length && navLinks.length) {
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`.navbar__links a[href*="#${id}"]`);
        if (entry.isIntersecting && link) {
          navLinks.forEach(l => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(s => navIo.observe(s));
  }

});