/* ============================================================
   KRITISH YADAV — PORTFOLIO SCRIPT
   ============================================================ */

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();


// ---- HERO IMAGE FALLBACK ----
const heroImg = document.getElementById('heroImg');
const heroPlaceholder = document.getElementById('heroPlaceholder');
if (heroImg) {
  heroImg.addEventListener('error', () => {
    heroImg.style.display = 'none';
    if (heroPlaceholder) heroPlaceholder.style.display = 'flex';
  });
  heroImg.addEventListener('load', () => {
    if (heroPlaceholder) heroPlaceholder.style.display = 'none';
  });
  // Trigger check in case already errored
  if (!heroImg.complete || heroImg.naturalWidth === 0) {
    heroImg.dispatchEvent(new Event('error'));
  }
}


// ---- NAVBAR SCROLL EFFECT ----
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});


// ---- SMOOTH SCROLL ----
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}


// ---- MOBILE MENU OPEN/CLOSE ----
function toggleMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenu.classList.toggle('active');
}


// ---- CLOSE MENU AFTER CLICK ----
function closeMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenu.classList.remove('active');
}

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});


// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));


// ---- ACTIVE NAV LINK ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar .nav-link');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => activeObserver.observe(section));


// ---- PROJECT CARD GLOW EFFECT ----
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});


// ---- TYPED TITLE EFFECT (optional hero subtitle) ----
function typeText(element, text, speed = 60) {
  let i = 0;
  element.textContent = '';
  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}


// ---- STAGGERED SKILL TAG ANIMATION ----
const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach((tag, i) => {
  tag.style.transitionDelay = `${i * 0.05}s`;
  tag.style.opacity = '0';
  tag.style.transform = 'translateY(10px)';
  tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
});

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-tag').forEach(tag => {
        tag.style.opacity = '1';
        tag.style.transform = 'translateY(0)';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));


// ---- PERFORMANCE: Preload fonts check ----
document.fonts.ready.then(() => {
  document.body.classList.add('fonts-loaded');
});


function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}