// ── Hero Slider ──
let heroIndex = 0;
const heroSlides = 3;

function heroSlide(dir) {
  heroIndex = (heroIndex + dir + heroSlides) % heroSlides;
  const track = document.getElementById('heroTrack');
  if (!track) return;
  track.style.transform = `translateX(-${heroIndex * (100 / heroSlides)}%)`;
}

// ── Plans Carousel ──
let plansIndex = 0;
const plansTrack = document.getElementById('plansTrack');

function plansSlide(dir) {
  if (!plansTrack) return;
  const cards = plansTrack.querySelectorAll('.plan-card');
  const cardWidth = cards[0].offsetWidth + 10;
  const visibleWidth = plansTrack.parentElement.offsetWidth - 20;
  const maxIndex = Math.max(0, cards.length - Math.floor(visibleWidth / cardWidth));

  plansIndex = Math.max(0, Math.min(plansIndex + dir, maxIndex));
  plansTrack.style.transform = `translateX(-${plansIndex * cardWidth}px)`;

  const prev = document.querySelector('.plans__nav--prev');
  const next = document.querySelector('.plans__nav--next');
  if (prev) prev.style.opacity = plansIndex > 0 ? '1' : '0';
  if (next) next.style.opacity = plansIndex < maxIndex ? '1' : '0';
}

// ── Help Carousel ──
let helpIndex = 0;
const helpTrack = document.getElementById('helpTrack');
const helpDots = document.querySelectorAll('.help__dot');

function helpSlide(dir) {
  if (!helpTrack) return;
  const cards = helpTrack.querySelectorAll('.help__card');
  const cardWidth = cards[0].offsetWidth + 10;
  const visibleWidth = helpTrack.parentElement.offsetWidth - 20;
  const cardsVisible = Math.floor(visibleWidth / cardWidth);
  const maxIndex = Math.max(0, cards.length - cardsVisible);

  helpIndex = Math.max(0, Math.min(helpIndex + dir, maxIndex));
  helpTrack.style.transform = `translateX(-${helpIndex * cardWidth}px)`;

  const prev = document.querySelector('.help__nav--prev');
  const next = document.querySelector('.help__nav--next');
  prev.style.opacity = helpIndex > 0 ? '1' : '0';
  next.style.opacity = helpIndex < maxIndex ? '1' : '0';

  const activeDot = cardsVisible >= 3
    ? (helpIndex === 0 ? 0 : 1)
    : helpIndex;
  helpDots.forEach((dot, i) => {
    dot.style.background = i === activeDot ? 'white' : 'rgba(255,255,255,0.5)';
  });
}

// ── Mobile Menu ──
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

// ── FAQ Accordion ──
function toggleFaq(btn) {
  const item = btn.closest('.faq__item');
  const answer = item.querySelector('.faq__answer');
  const isOpen = answer.classList.contains('open');

  document.querySelectorAll('.faq__answer.open').forEach(el => {
    el.classList.remove('open');
    el.closest('.faq__item').classList.remove('faq__item--open');
  });

  if (!isOpen) {
    answer.classList.add('open');
    item.classList.add('faq__item--open');
  }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', function () {
  helpSlide(0);
  if (window.innerWidth <= 768) {
    const next = document.querySelector('.plans__nav--next');
    if (next) next.style.opacity = '1';
  }
});
