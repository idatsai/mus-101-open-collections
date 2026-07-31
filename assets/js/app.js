const app = document.querySelector('#app');
const D = window.DATA;
const nav = document.querySelector('nav');
const menu = document.querySelector('.menu');
const topBtn = document.querySelector('.top');

const heading = (en, zh, light = '') => `
  <div class="heading ${light}">
    <small>${en}</small>
    <h2>${zh}</h2>
  </div>`;

function cards() {
  return D.lessons.map(x => `
    <a class="card" href="#${x.id}">
      <b>${x.n}</b><em>${x.status}</em>
      <span><small>${x.date}</small><strong>${x.title}</strong><i>${x.work}</i></span>
      <u>↗</u>
    </a>`).join('');
}

function overview() {
  app.innerHTML = `
    <section class="hero">
      <img src="assets/images/hero.jpg" alt="MUS 101 活動主視覺">
      <div>
        <small>MUSEUM EDUCATION PROGRAM · 2026</small>
        <h1><span>MUS 101: 魔法博物學院</span>打開典藏庫</h1>
        <p>${D.intro}</p>
        <a class="btn" href="#series">探索四場活動 ↓</a>
      </div>
    </section>
    <section class="section intro">
      ${heading('ABOUT THE PROGRAM', '從「收藏」開始，打開博物館的後台')}
      <div class="twocol">
        <p class="big">以美術館與自然史博物館的典藏為基礎，將專業工作轉譯成每個人都能參與的學習旅程。</p>
        <div class="facts"><div><b>2</b><span>合作館所</span></div><div><b>4</b><span>系列課程</span></div><div><b>20</b><span>每場名額</span></div></div>
      </div>
    </section>
    <section class="section goals">
      ${heading('PROGRAM GOALS', '活動規劃目標', 'light')}
      <div class="goalgrid">${D.goals.map((g, i) => `<article><b>0${i + 1}</b><h3>${g[0]}</h3><p>${g[1]}</p></article>`).join('')}</div>
    </section>
    <section class="section" id="series">
      ${heading('FOUR SESSIONS', '四場活動，循序走進典藏世界')}
      <div class="cards">${cards()}</div>
    </section>
    <section class="partners"><small>CO-ORGANIZED BY</small><p>國立臺灣美術館 <b>×</b> 國立自然科學博物館</p></section>`;
}

function albumMarkup(x) {
  const items = x.gallery.map((caption, i) => x.photos?.[i]
    ? `<figure class="gallery-item">
         <button class="gallery-photo" data-src="${x.photos[i]}">
           <img src="${x.photos[i]}" alt="${caption}" loading="lazy">
         </button>
         <figcaption>${caption}</figcaption>
       </figure>`
    : `<figure class="gallery-item">
         <div class="photo-placeholder"><b>0${i + 1}</b><small>PHOTO PLACEHOLDER</small></div>
         <figcaption>${caption}</figcaption>
       </figure>`).join('');

  return `
    <div class="gallery-shell">
      <button class="gallery-arrow gallery-prev" type="button" aria-label="上一張照片">←</button>
      <div class="gallery" tabindex="0" aria-label="活動照片，可左右滑動">${items}</div>
      <button class="gallery-arrow gallery-next" type="button" aria-label="下一張照片">→</button>
    </div>
    ${x.photos ? '' : '<p class="note">照片版位已預留；提供照片後即可替換。</p>'}`;
}

function lesson(x) {
  const ws = x.worksheet ? `
    <section class="section">
      ${heading('LEARNING SHEET', '學習單｜典藏登錄卡')}
      <p class="lead">正面記錄物件的登錄號、名稱、媒材、年代、尺寸、狀況與典藏條件；背面以文字和繪圖規劃典藏品從取得地點移動至博物館的路線。</p>
      <div class="sheets">
        <button data-src="assets/images/worksheet-1.png"><img src="assets/images/worksheet-1.png" alt="學習單第一頁"></button>
        <button data-src="assets/images/worksheet-2.png"><img src="assets/images/worksheet-2.png" alt="學習單第二頁"></button>
      </div>
      <a class="btn" href="assets/docs/lesson1-worksheet.pdf" target="_blank">開啟完整 PDF ↗</a>
    </section>` : '';

  app.innerHTML = `
    <section class="lessonHero"><img src="assets/images/hero.jpg" alt=""><div><a href="#overview">← 回到活動詳情</a><small>SESSION ${x.n} · ${x.status}</small><h1>${x.title}</h1><p>${x.work}</p></div></section>
    <section class="meta"><div><small>DATE</small><b>${x.date}</b></div><div><small>TIME</small><b>${x.time}</b></div><div><small>VENUE</small><b>${x.venue}</b></div><div><small>FEE</small><b>${x.fee}</b></div></section>
    <section class="section">${heading('THEME', '課程主題')}<p class="big">${x.lead}</p></section>
    <section class="section process">${heading('ACTIVITY FLOW', '活動步驟', 'light')}<ol>${x.steps.map((s, i) => `<li><b>0${i + 1}</b><span>${s}</span></li>`).join('')}</ol><p class="note">此區已建立可擴充版型，後續可加入各階段說明、講師提示與現場照片。</p></section>
    ${ws}
    <section class="section making"><div><small>HANDS-ON PRACTICE</small><h2>實作｜${x.work}</h2><p>${x.making}</p></div><aside><small>WORKSHOP</small><b>${x.work}</b></aside></section>
    <section class="section album-section">${heading('ACTIVITY ALBUM', '活動相簿')}${albumMarkup(x)}</section>
    <div class="pager">${pager(x)}</div>
    <div class="lightbox"><button aria-label="關閉大圖">×</button><img alt="放大圖片"></div>`;

  document.querySelectorAll('.sheets button,.gallery-photo').forEach(button => {
    button.onclick = () => {
      const lightbox = document.querySelector('.lightbox');
      lightbox.querySelector('img').src = button.dataset.src;
      lightbox.classList.add('open');
    };
  });

  const close = document.querySelector('.lightbox button');
  if (close) close.onclick = () => close.parentElement.classList.remove('open');
  initGallery();
}

function initGallery() {
  const track = document.querySelector('.gallery');
  if (!track) return;

  const shell = track.closest('.gallery-shell');
  const prev = shell.querySelector('.gallery-prev');
  const next = shell.querySelector('.gallery-next');
  const scrollAmount = () => {
    const item = track.querySelector('.gallery-item');
    if (!item) return track.clientWidth * 0.85;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return item.getBoundingClientRect().width + gap;
  };

  prev.onclick = () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  next.onclick = () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });

  const updateArrows = () => {
    const max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft >= max - 4;
    shell.classList.toggle('is-static', max <= 4);
  };

  let isDown = false;
  let startX = 0;
  let startLeft = 0;
  track.addEventListener('pointerdown', event => {
    if (event.target.closest('button')) return;
    isDown = true;
    startX = event.clientX;
    startLeft = track.scrollLeft;
    track.classList.add('is-dragging');
    track.setPointerCapture(event.pointerId);
  });
  track.addEventListener('pointermove', event => {
    if (!isDown) return;
    track.scrollLeft = startLeft - (event.clientX - startX);
  });
  const stopDrag = event => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('is-dragging');
    if (track.hasPointerCapture?.(event.pointerId)) track.releasePointerCapture(event.pointerId);
  };
  track.addEventListener('pointerup', stopDrag);
  track.addEventListener('pointercancel', stopDrag);
  track.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows, { passive: true });
  requestAnimationFrame(updateArrows);
}

function pager(x) {
  const i = D.lessons.indexOf(x);
  const p = D.lessons[i - 1];
  const n = D.lessons[i + 1];
  return `${p ? `<a href="#${p.id}">← ${p.title}</a>` : '<span></span>'}${n ? `<a href="#${n.id}">${n.title} →</a>` : '<a href="#overview">活動詳情 →</a>'}`;
}

function route() {
  const key = location.hash.slice(1) || 'overview';
  const x = D.lessons.find(v => v.id === key);
  x ? lesson(x) : overview();
  nav.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.hash === `#${x ? x.id : 'overview'}`));
  window.scrollTo(0, 0);
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}

window.onhashchange = route;
route();
menu.onclick = () => {
  nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', nav.classList.contains('open'));
};
onscroll = () => topBtn.classList.toggle('show', scrollY > 500);
topBtn.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
