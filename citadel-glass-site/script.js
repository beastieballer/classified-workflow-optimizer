(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('#nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const accordion = document.querySelector('[data-accordion]');
  if (accordion) {
    accordion.addEventListener('click', (event) => {
      const button = event.target.closest('button[aria-controls]');
      if (!button) return;

      const panel = document.getElementById(button.getAttribute('aria-controls'));
      if (!panel) return;

      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('in-view'));
  }

  // subtle ambient parallax for desktop polish
  if (!prefersReducedMotion) {
    const a1 = document.querySelector('.ambient-1');
    const a2 = document.querySelector('.ambient-2');
    window.addEventListener('pointermove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      if (a1) a1.style.transform = `translate(${x}px, ${y}px)`;
      if (a2) a2.style.transform = `translate(${-x}px, ${-y}px)`;
    });
  }

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
