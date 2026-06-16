let sidebarOpen = true;

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const btn = document.querySelector('.toggle-btn');
  sidebarOpen = !sidebarOpen;
  sidebar.classList.toggle('hidden', !sidebarOpen);
  btn.classList.toggle('open', sidebarOpen);
}

function toggleSection(sec) {
  const sub = document.getElementById('sub-' + sec);
  const chev = document.getElementById('chev-' + sec);
  const isOpen = sub.classList.contains('open');
  sub.classList.toggle('open', !isOpen);
  chev.classList.toggle('open', !isOpen);
}

function showSlide(sid) {
  // hide all
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.toc-sub-item').forEach(t => t.classList.remove('active'));
  // show target
  const el = document.getElementById('slide-' + sid);
  if (el) el.classList.add('active');
  // sidebar highlight
  const tocEl = document.getElementById('toc-' + sid);
  if (tocEl) {
    tocEl.classList.add('active');
    tocEl.scrollIntoView({ block: 'nearest' });
    // open parent section
    const sec = sid.split('-')[0];
    const sub = document.getElementById('sub-' + sec);
    const chev = document.getElementById('chev-' + sec);
    if (sub) { sub.classList.add('open'); chev.classList.add('open'); }
  }
  window.scrollTo(0, 0);
}

function carouselMove(carousel, dir) {
  const imgs = carousel.querySelectorAll('.carousel-frame img');
  let idx = +carousel.dataset.idx;
  imgs[idx].classList.remove('active');
  idx = (idx + dir + imgs.length) % imgs.length;
  imgs[idx].classList.add('active');
  carousel.dataset.idx = idx;
  carousel.nextElementSibling.textContent = (idx + 1) + ' / ' + imgs.length;
}

function copyText(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

// ── Dev mode (enabled via ?dev in URL) ──────────────────────────
let devFileHandle = null;

function getCleanHTML() {
  const clone = document.documentElement.cloneNode(true);
  clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
  // Reset to initial state: hub slide active, all sections collapsed, no highlights
  clone.querySelectorAll('.slide.active').forEach(el => el.classList.remove('active'));
  const hub = clone.querySelector('#slide-hub');
  if (hub) hub.classList.add('active');
  clone.querySelectorAll('.toc-sub-list.open').forEach(el => el.classList.remove('open'));
  clone.querySelectorAll('.toc-chevron.open').forEach(el => el.classList.remove('open'));
  clone.querySelectorAll('.toc-sub-item.active').forEach(el => el.classList.remove('active'));
  clone.querySelector('body').classList.remove('dev-mode');
  clone.querySelectorAll('.dev-panel').forEach(el => el.remove());
  clone.querySelector('body').classList.remove('dev-mode');
  return '<!DOCTYPE html>\n' + clone.outerHTML;
}

async function devSave() {
  const btn = document.querySelector('.dev-save-btn');
  try {
    if (!devFileHandle) {
      devFileHandle = await window.showSaveFilePicker({
        suggestedName: 'index.html',
        types: [{ description: 'HTML file', accept: { 'text/html': ['.html'] } }],
      });
    }
    const writable = await devFileHandle.createWritable();
    await writable.write(getCleanHTML());
    await writable.close();
    btn.textContent = 'Saved ✓';
    btn.classList.add('dev-saved');
    setTimeout(() => { btn.textContent = 'Save'; btn.classList.remove('dev-saved'); }, 2000);
  } catch (e) {
    if (e.name !== 'AbortError') { btn.textContent = 'Error'; setTimeout(() => { btn.textContent = 'Save'; }, 2000); }
  }
}

if (new URLSearchParams(window.location.search).has('dev')) {
  document.body.classList.add('dev-mode');
  const selectors = 'h1, h2, p, .eyebrow, .title-eyebrow, .title-h1, .title-sub, .callout, .hub-btn-title, .hub-btn-sub, code.inline';
  document.querySelectorAll(selectors).forEach(el => {
    el.contentEditable = 'true';
    el.spellcheck = false;
  });
  const panel = document.createElement('div');
  panel.className = 'dev-panel';
  panel.innerHTML = '<span class="dev-badge">DEV</span><button class="dev-save-btn" onclick="devSave()">Save</button>';
  document.body.appendChild(panel);
}
