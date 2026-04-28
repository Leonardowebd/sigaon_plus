// ── Empresas Plans Carousel ──
let eplansIndex = 0;
const eplansTrack = document.getElementById('eplansTrack');

function eplansSlide(dir) {
  if (!eplansTrack) return;
  const cards = eplansTrack.querySelectorAll('.eplan-card');
  const cardWidth = cards[0].offsetWidth + 10;
  const visibleWidth = eplansTrack.parentElement.offsetWidth - 20;
  const maxIndex = Math.max(0, cards.length - Math.floor(visibleWidth / cardWidth));

  eplansIndex = Math.max(0, Math.min(eplansIndex + dir, maxIndex));
  eplansTrack.style.transform = `translateX(-${eplansIndex * cardWidth}px)`;

  const prev = document.querySelector('.eplans__nav--prev');
  const next = document.querySelector('.eplans__nav--next');
  if (prev) prev.style.opacity = eplansIndex > 0 ? '1' : '0';
  if (next) next.style.opacity = eplansIndex < maxIndex ? '1' : '0';
}

document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth <= 768) {
    const next = document.querySelector('.eplans__nav--next');
    if (next) next.style.opacity = '1';
  }
});
