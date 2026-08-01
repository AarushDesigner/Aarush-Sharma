/* ============================================================
   AARUSH DESIGNER — MOTION: typed text + animated counters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Rotating typed text (hero) ---------- */
  const typedEl = document.querySelector('[data-typed]');
  if (typedEl) {
    const words = JSON.parse(typedEl.getAttribute('data-typed'));
    let wordIndex = 0, charIndex = 0, deleting = false;

    function type() {
      const current = words[wordIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1600);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 40 : 80);
    }
    type();
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const counterIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-counter'));
      const suffix = el.getAttribute('data-suffix') || '';
      const isDecimal = target % 1 !== 0;
      const duration = 1800;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
        el.classList.add('is-counting');
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
      }
      requestAnimationFrame(step);
      counterIo.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIo.observe(c));

  /* ---------- Hero entrance (staggered, no GSAP dependency needed) ---------- */
  const heroEls = document.querySelectorAll('[data-hero-in]');
  heroEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    setTimeout(() => {
      el.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 140);
  });

});