/* ============================================================
   KRITISH YADAV — PORTFOLIO SCRIPT
   Loaded with `defer`, so the DOM is already parsed when this runs.
   ============================================================
   TABLE OF CONTENTS
   1. Custom Cursor
   2. Section Scroll Helper
   3. Mobile Menu
   4. Navbar Scroll + Active Section Highlight
   5. Scroll Reveal Animations
   6. Project / Experience Card Glow (mouse parallax)
   7. Publication Accuracy Bar
   8. Contact Form
   ============================================================ */

/* ---------- 1. CUSTOM CURSOR ---------- */
(function initCursor() {
  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();
})();

/* ---------- 2. SECTION SCROLL HELPER ---------- */
/* Used by the navbar, mobile menu, and hero CTA buttons. */
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ---------- 3. MOBILE MENU ---------- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let isMenuOpen = false;

function toggleMenu() {
  isMenuOpen = !isMenuOpen;
  mobileMenu.classList.toggle('open', isMenuOpen);
  hamburger.classList.toggle('open', isMenuOpen);
  hamburger.setAttribute('aria-expanded', String(isMenuOpen));
  document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

function closeMenu() {
  isMenuOpen = false;
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ---------- 4. NAVBAR SCROLL + ACTIVE SECTION HIGHLIGHT ---------- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links .nav-link');
const SECTION_IDS = [
  'hero', 'about', 'experience', 'skills', 'projects',
  'publications', 'education', 'certifications', 'contact',
];
/* Nav link labels that don't match their section id 1:1. */
const NAV_LABEL_TO_ID = { research: 'publications', certs: 'certifications' };

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  let currentId = 'hero';
  SECTION_IDS.forEach((id) => {
    const section = document.getElementById(id);
    if (section && window.scrollY >= section.offsetTop - 160) currentId = id;
  });

  navLinks.forEach((link) => {
    const label = link.textContent.toLowerCase();
    const id = NAV_LABEL_TO_ID[label] || label;
    link.classList.toggle('active', id === currentId);
  });
});

/* ---------- 5. SCROLL REVEAL ANIMATIONS ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
);
revealEls.forEach((el) => revealObserver.observe(el));

/* ---------- 6. PROJECT / EXPERIENCE CARD GLOW (mouse parallax) ---------- */
/* Applies to every .project-card — both Experience and Projects sections. */
document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
    card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
  });
});

/* ---------- 7. PUBLICATION ACCURACY BAR ---------- */
const barFill = document.getElementById('barFill');
const accuracyBar = document.getElementById('accBar');
if (accuracyBar && barFill) {
  const barObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        barFill.style.width = '97.60%';
        barObserver.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  barObserver.observe(accuracyBar);
}

/* ---------- 8. CONTACT FORM ---------- */
function handleSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('submitBtn');
  const formWrap = document.getElementById('formWrap');

  submitBtn.disabled = true;
  submitBtn.textContent = '⏳ Sending...';

  // Simulated send — replace with a real endpoint when one is available.
  setTimeout(() => {
    formWrap.innerHTML = `
      <div class="form-success">
        ✅ Message sent! I'll get back to you within 24 hours.<br/>
        <a href="mailto:yadavkritish99@gmail.com" class="form-success-link">
          Or reach me directly at yadavkritish99@gmail.com
        </a>
      </div>`;
  }, 1500);
}
