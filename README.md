# Kritish Yadav — Portfolio

## 🚀 How to Use

Open `index.html` in any modern browser — **no build step, no server required**.
`index.html` now properly links to `style.css` and `script.js` (previously these
existed as separate files but weren't actually linked; the site was running on
one big self-contained file). Keep all four files in the same folder.

### Files
- `index.html` — Markup only
- `style.css` — All styles, organized into numbered sections (variables, reset,
  navbar, hero, about, experience/projects, research, skills, education,
  certifications, contact, footer, responsive)
- `script.js` — All behavior (cursor, nav, mobile menu, scroll reveal, project
  card glow, accuracy bar, contact form)
- `favicon.png` — Browser tab icon
- `README.md` — This file

### Required assets (add these — referenced by the site but not included)
Create an `assets/images/` folder next to `index.html` and add:
1. `assets/images/kritish.jpg` — your About section photo
2. `assets/images/certificate.png` — your NTC internship certificate. Clicking
   the certificate icon (top-right of the Experience card) opens this image
   in a new tab.

### Customize Links
Search for `href="#"` and replace with your actual project repo URLs.
- LinkedIn: already set to your full URL
- GitHub: search `github.com/kritish3228` → already correct
- Certification "View Credential" links currently point to `#` placeholders

### Deploy
- **GitHub Pages**: Push to a repo, enable Pages on the `main` branch
- **Vercel**: Drag and drop the folder at vercel.com
- **Netlify**: Drag and drop the folder at netlify.com

## ✨ Features
- Clean separation of HTML / CSS / JS, zero dependencies (no npm, no build step)
- Custom cursor with smooth follow animation
- Scroll-triggered reveal animations
- Vertical timeline layout shared by the Experience and Projects sections
- Animated accuracy progress bar
- Mobile responsive with hamburger menu
- Dark glassmorphism design with amber accent
- Interactive project/experience cards with mouse glow effect
- Skip-to-content link and keyboard-accessible mobile menu
