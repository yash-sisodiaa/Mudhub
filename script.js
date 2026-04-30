/* ═══════════════════════════════════════════════════════
   MudHub — Premium Handcrafted Pottery Website
   JavaScript: Animations, Navigation & Interactions
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar Scroll Effect ── */
  const navbar = document.getElementById('navbar');
  const heroSection = document.getElementById('home');

  const handleNavbarScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  /* ── Mobile Navigation Toggle ── */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile nav when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });


  /* ── Scroll-triggered Animations ── */
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animations for elements in the same section
        const parent = entry.target.closest('.section') || entry.target.closest('.hero');
        const siblings = parent ? parent.querySelectorAll('[data-animate]') : [];
        let staggerIndex = 0;

        siblings.forEach((sibling, i) => {
          if (sibling === entry.target) {
            staggerIndex = i;
          }
        });

        setTimeout(() => {
          entry.target.classList.add('animated');
        }, staggerIndex * 120);

        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => animationObserver.observe(el));


  /* ── Active Navigation Link Highlighting ── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });


  /* ── Smooth Scroll for CTA buttons ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight - 10;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  /* ── Gallery Hover Parallax Effect ── */
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const img = item.querySelector('img');

      img.style.transform = `scale(1.1) translate(${x * 10}px, ${y * 10}px)`;
    });

    item.addEventListener('mouseleave', () => {
      const img = item.querySelector('img');
      img.style.transform = 'scale(1)';
    });
  });


  /* ── Contact Form Handling ── */
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('contact-submit');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Sending...';
    submitBtn.style.pointerEvents = 'none';
    submitBtn.style.opacity = '0.7';

    const data = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        submitBtn.textContent = '✓ Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #4a8c5c, #2d6b3f)';
        contactForm.reset();
      } else {
        submitBtn.textContent = '❌ Error!';
      }

    } catch (error) {
      submitBtn.textContent = '❌ Failed!';
    }

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.pointerEvents = '';
      submitBtn.style.opacity = '';
      submitBtn.style.background = '';
    }, 3000);
  });


  /* ── Parallax Effect on Hero ── */
  const heroBg = document.querySelector('.hero-bg img');

  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      const offset = window.scrollY * 0.4;
      heroBg.style.transform = `scale(1.05) translateY(${offset}px)`;
    }
  }, { passive: true });


  /* ── Stat Counter Animation ── */
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalText = target.textContent;
        const numericValue = parseInt(finalText.replace(/\D/g, ''));
        const suffix = finalText.replace(/[0-9]/g, '');
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(eased * numericValue);

          target.textContent = currentVal + suffix;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            target.textContent = finalText;
          }
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => counterObserver.observe(stat));


  /* ── Testimonial Cards Tilt Effect ── */
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  testimonialCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `
        translateY(-4px)
        rotateX(${y * -6}deg)
        rotateY(${x * 6}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
  });


  /* ── Product Cards Glow Effect ── */
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--glow-x', `${x}px`);
      card.style.setProperty('--glow-y', `${y}px`);
    });
  });


  /* ── Preloader / Initial Animation ── */
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';

    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });

    // Trigger hero animations after load
    setTimeout(() => {
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        heroContent.classList.add('animated');
      }
    }, 300);
  });

});
