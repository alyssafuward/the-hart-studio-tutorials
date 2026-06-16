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

function copyText(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}
