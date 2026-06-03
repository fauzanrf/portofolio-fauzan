// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const themeToggle = document.getElementById('themeToggle');
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const statNumbers = document.querySelectorAll('.stat-number');

// ===== Theme Management =====
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  if (theme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

themeToggle.addEventListener('click', toggleTheme);

// ===== Navbar Scroll =====
let lastScroll = 0;

function handleScroll() {
  const scrollY = window.scrollY;

  // Navbar styling
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to top button
  if (scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Active nav link
  updateActiveNav();

  lastScroll = scrollY;
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ===== Active Navigation =====
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// ===== Mobile Menu =====
mobileToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('active');

  if (isOpen) {
    closeMobileMenu();
  } else {
    mobileMenu.classList.add('active');
    mobileToggle.querySelector('i').className = 'fas fa-times';
    document.body.style.overflow = 'hidden';
  }
});

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  mobileToggle.querySelector('i').className = 'fas fa-bars';
  document.body.style.overflow = '';
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Back to top
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Scroll Reveal Animations =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
);

revealElements.forEach(el => revealObserver.observe(el));

// ===== Counter Animation =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * easeOut);

    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach(el => counterObserver.observe(el));

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const btn = this.querySelector('.btn-submit');
  const originalText = btn.textContent;

  // Simulate send
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'var(--success)';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 2000);
  }, 1500);
});

// ===== Typing Effect for Hero =====
const typingTexts = [
  'Network Engineer Support',
  'IT Support Specialist',
  'Infrastructure Engineer'
];

let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typingText');

function typeText() {
  const current = typingTexts[typingIndex];

  if (isDeleting) {
    typingElement.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 50 : 80;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typingIndex = (typingIndex + 1) % typingTexts.length;
    delay = 500;
  }

  setTimeout(typeText, delay);
}

// Start typing effect
setTimeout(typeText, 1000);

// ===== Skill Cards Stagger Animation =====
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 100);
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

skillCards.forEach(card => {
  card.classList.add('reveal');
  skillObserver.observe(card);
});

// ===== Project Cards Stagger =====
const projectCards = document.querySelectorAll('.project-card');
const projectObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 150);
        projectObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

projectCards.forEach(card => {
  card.classList.add('reveal');
  projectObserver.observe(card);
});

// ===== Tool Items Stagger =====
const toolItems = document.querySelectorAll('.tool-item');
const toolObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        toolObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.05 }
);

toolItems.forEach(item => {
  item.classList.add('reveal');
  toolObserver.observe(item);
});

// ===== Initialize =====
initTheme();
handleScroll();
