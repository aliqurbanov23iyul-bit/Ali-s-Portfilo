// AOS init
AOS.init({
  duration: 900,
  easing: 'ease-out-quad',
  once: false,
  offset: 80,
});

// GSAP hero animasiyaları
gsap.from(".hero-title", { y: -40, opacity: 0, duration: 1 });
gsap.from(".hero-sub", { y: 40, opacity: 0, duration: 1, delay: 0.3 });
gsap.from(".hero-actions", { scale: 0.9, opacity: 0, duration: 1, delay: 0.6 });

// Stat sayğacları
function animateCounters(selector) {
  const items = document.querySelectorAll(selector);
  items.forEach(el => {
    const target = parseInt(el.getAttribute("data-count") || "0", 10);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60)); // ~1s animasiya
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 16);
  });
}
animateCounters(".stat-number");

// About countrləri scroll ilə
const aboutObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters(".counter-number");
      aboutObserver.disconnect();
    }
  });
}, { threshold: 0.4 });
const aboutSection = document.querySelector("#about");
if (aboutSection) aboutObserver.observe(aboutSection);

// Canvas particles (yüngül)
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d', { alpha: true });
let W, H, particles;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initParticles();
}
function rand(min, max) { return Math.random() * (max - min) + min; }
function initParticles() {
  const count = Math.floor((W * H) / 25000); // açıq fonda daha az hissəcik
  particles = new Array(count).fill().map(() => ({
    x: rand(0, W),
    y: rand(0, H),
    vx: rand(-0.3, 0.3),
    vy: rand(-0.3, 0.3),
    r: rand(0.6, 1.6),
    a: rand(0.10, 0.30),
    c: Math.random() < 0.6 ? 'rgba(29,53,87,' : 'rgba(230,57,70,',
  }));
}
function step() {
  ctx.clearRect(0, 0, W, H);
  for (let p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;

    ctx.beginPath();
    ctx.fillStyle = `${p.c}${p.a})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  // yaxın hissəcikləri xəttlə bağla
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i], p2 = particles[j];
      const dx = p1.x - p2.x, dy = p1.y - p2.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 110) {
        const alpha = 1 - dist / 110;
        ctx.strokeStyle = `rgba(69,123,157,${alpha * 0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(step);
}
window.addEventListener('resize', resize);
resize();
step();

// Mobile menu aç-bağla
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
navToggle?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Naviqasiya smooth scroll
document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    const isHash = href && href.startsWith('#');
    if (isHash) {
      e.preventDefault();
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      mobileMenu.classList.remove('open');
    }
  });
});

// Form submit demo + GSAP feedback
document.querySelector('.contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  gsap.fromTo('.contact-form', { scale: 1 }, { scale: 1.02, duration: 0.2, yoyo: true, repeat: 1 });
  alert('Mesajınız göndərildi (demo). Backend qoşulduqdan sonra real göndərmə aktiv olacaq.');
});

// Kartlar üçün hover mikro-animasiyalar
function hoverAnimate(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { duration: 0.2, y: -6, boxShadow: '0 14px 40px rgba(13,27,58,0.15)' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { duration: 0.2, y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' });
    });
  });
}
hoverAnimate('.project-card');
hoverAnimate('.service-card');
hoverAnimate('.blog-card');
hoverAnimate('.counter-card');
hoverAnimate('.contact-info');

// Header shadow on scroll
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.style.boxShadow = y > 20 ? '0 10px 24px rgba(13,27,58,0.15)' : 'none';
});

// AOS refresh
window.addEventListener('load', () => {
  AOS.refresh();
});
