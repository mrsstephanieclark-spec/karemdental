/* ============================================
   KAREM DENTAL & AESTHETICS — APP JS
   Scroll reveals, navigation, testimonial carousel,
   micro-interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initTestimonialCarousel();
  initSmoothScroll();
});

/* ---------- Navigation ---------- */
function initNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__mobile-toggle');
  const links = document.querySelector('.nav__links');
  const overlay = document.querySelector('.nav__mobile-overlay');
  let lastScroll = 0;

  // Scroll behavior
  function onScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
      if (overlay) overlay.classList.toggle('visible');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });

    // Close on overlay click
    if (overlay) {
      overlay.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
      });
    }

    // Close on link click (mobile)
    links.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
        if (overlay) overlay.classList.remove('visible');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* ---------- Testimonial Carousel ---------- */
function initTestimonialCarousel() {
  const track = document.querySelector('.testimonials__track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dots = document.querySelectorAll('.testimonials__dot');

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  let cardsPerView = getCardsPerView();
  let maxIndex = Math.max(0, cards.length - cardsPerView);

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 24;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    // Update button states
    if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
    if (nextBtn) nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      currentIndex = Math.min(i, maxIndex);
      updateCarousel();
    });
  });

  // Recalc on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cardsPerView = getCardsPerView();
      maxIndex = Math.max(0, cards.length - cardsPerView);
      currentIndex = Math.min(currentIndex, maxIndex);
      updateCarousel();
    }, 200);
  });

  // Touch / swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < maxIndex) {
        currentIndex++;
      } else if (diff < 0 && currentIndex > 0) {
        currentIndex--;
      }
      updateCarousel();
    }
  }, { passive: true });

  // Auto-rotate every 5 seconds
  let autoRotate = setInterval(() => {
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  }, 5000);

  // Pause auto-rotate on hover
  track.addEventListener('mouseenter', () => clearInterval(autoRotate));
  track.addEventListener('mouseleave', () => {
    autoRotate = setInterval(() => {
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateCarousel();
    }, 5000);
  });

  updateCarousel();
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}
