/* ==========================================================================
   MOHAN VIKNESH S — PORTFOLIO SCRIPT
   Vanilla JavaScript — no dependencies
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     1. FOOTER YEAR
  --------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ---------------------------------------------------------------------
     2. STICKY NAVIGATION + SCROLL PROGRESS BAR
     Both read scroll position once per animation frame for performance.
  --------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollY = window.scrollY;

    // Sticky nav background after slight scroll
    navbar.classList.toggle('scrolled', scrollY > 40);

    // Scroll progress bar (% of page scrolled)
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    // Back-to-top button visibility
    backToTop.classList.toggle('show', scrollY > 600);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------------------------------------------------------------------
     3. MOBILE MENU TOGGLE
  --------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });


  /* ---------------------------------------------------------------------
     4. ACTIVE NAV LINK HIGHLIGHTING (based on section in view)
  --------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => navObserver.observe(section));


  /* ---------------------------------------------------------------------
     5. SCROLL REVEAL (fade-in on scroll, via IntersectionObserver)
  --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el, i) => {
    // Small stagger for elements that reveal in the same viewport pass
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
    revealObserver.observe(el);
  });


  /* ---------------------------------------------------------------------
     6. TYPING ANIMATION (hero headline)
  --------------------------------------------------------------------- */
  const typedTextEl = document.getElementById('typedText');
  const phrases = [
    'Finding patterns where others see noise.',
    'Curious first. Certain later.',
    'I build to understand — then build again.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      typedTextEl.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1800); // pause at full phrase
        return;
      }
    } else {
      charIndex--;
      typedTextEl.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 35 : 55;
    setTimeout(typeLoop, speed);
  }

  if (typedTextEl) typeLoop();


  /* ---------------------------------------------------------------------
     7. BUTTON RIPPLE EFFECT
  --------------------------------------------------------------------- */
  document.querySelectorAll('.ripple').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      circle.classList.add('ripple-circle');
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;

      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });


  /* ---------------------------------------------------------------------
     8. HERO MOUSE GLOW
  --------------------------------------------------------------------- */
  const hero = document.querySelector('.hero');
  const heroGlow = document.getElementById('heroGlow');

  if (hero && heroGlow) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroGlow.style.transform = `translate(${x - 240}px, ${y - 240}px)`;
    });
  }


  /* ---------------------------------------------------------------------
     9. HERO CANVAS — SUBTLE CONNECTED-NODE SIGNAL
     A quiet constellation of drifting nodes with faint connecting lines,
     evoking "finding patterns" without stealing focus from the type.
  --------------------------------------------------------------------- */
  const canvas = document.getElementById('heroCanvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width, height, nodes;

    function resize() {
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }

    function createNodes() {
      const count = Math.max(18, Math.floor((width * height) / 60000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      // Move nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      });

      // Draw connections between nearby nodes
      const maxDist = 130;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(255, 214, 10, ${0.12 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 214, 10, 0.45)';
        ctx.fill();
      });

      requestAnimationFrame(step);
    }

    resize();
    createNodes();
    step();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        createNodes();
      }, 200);
    });
  }


  /* ---------------------------------------------------------------------
     10. CONTACT FORM (client-side only — no backend wired up)
  --------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      if (!contactForm.checkValidity()) {
        formStatus.textContent = 'Please fill in every field before sending.';
        formStatus.style.color = '#FF6B6B';
        return;
      }

      formStatus.style.color = '#FFD60A';
      formStatus.textContent = `Thanks, ${name.split(' ')[0]} — this message is stored locally only. Wire up a backend or a service like Formspree to actually receive it.`;
      contactForm.reset();
    });
  }

});
