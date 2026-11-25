/* Ellie Lin portfolio: shared interactions for every page */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const EMAIL = 'elly95021@gmail.com';

  /* smooth scroll */
  let lenis = null;
  if (!reduce && window.Lenis) lenis = new Lenis({ lerp: 0.09 });
  window.__lenis = lenis;
  const scrollToEl = (el, off = -80) => {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: off });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  window.__scrollToEl = scrollToEl;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#') return;
    const t = $(id);
    if (!t) return;
    e.preventDefault();
    scrollToEl(t, id === '#works' ? -20 : -80);
  });
  $$('[data-top]').forEach(b => b.addEventListener('click', () => lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })));

  /* reveal on scroll */
  $$('[data-auto]').forEach(sec => [...sec.children].forEach((c, i) => { if (!c.hasAttribute('data-r')) { c.setAttribute('data-r', ''); } }));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('[data-r]').forEach(el => io.observe(el));

  /* videos play only when visible */
  const vio = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { v.play().catch(() => {}); } else v.pause(); }), { threshold: 0.2 });
  $$('video[data-auto-play]').forEach(v => { v.muted = true; vio.observe(v); });

  /* cursor */
  const cur = document.createElement('div'), ring = document.createElement('div');
  cur.className = 'cur'; ring.className = 'ring'; ring.innerHTML = '<span>View ↗</span>';
  document.body.append(cur, ring);
  let mx = -100, my = -100, rx = -100, ry = -100;
  const hoverHooks = [];
  window.__onPointer = fn => hoverHooks.push(fn);
  if (fine && !reduce) {
    document.body.classList.add('cursor-on');
    addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY; cur.classList.add('on'); ring.classList.add('on');
      const t = e.target.closest('a,button,summary,.zoomable,[data-cursor]');
      const view = !!(t && t.dataset.cursor === 'view' && !document.body.classList.contains('no-view'));
      ring.classList.toggle('view', view);
      ring.classList.toggle('link', !!t && !view);
      hoverHooks.forEach(f => f(mx, my));
    });
    addEventListener('pointerdown', () => ring.classList.add('down'));
    addEventListener('pointerup', () => ring.classList.remove('down'));
    document.addEventListener('pointerleave', () => { cur.classList.remove('on'); ring.classList.remove('on'); });
  }

  /* flower petals */
  const petals = [];
  function burst(x, y, n, rain) {
    if (reduce) return;
    for (let k = 0; k < n; k++) {
      const im = new Image(); im.src = 'flower.png'; im.className = 'petal'; im.alt = ''; document.body.appendChild(im);
      const a = Math.random() * Math.PI * 2, v = rain ? 0 : 4 + Math.random() * 7;
      petals.push({ im, x: rain ? Math.random() * innerWidth : x, y: rain ? -40 - Math.random() * innerHeight * 0.8 : y,
        vx: rain ? (Math.random() - 0.5) * 1.5 : Math.cos(a) * v, vy: rain ? 1 + Math.random() * 2 : Math.sin(a) * v - 3,
        r: Math.random() * 360, vr: (Math.random() - 0.5) * 12, s: 0.5 + Math.random() * 0.9, life: rain ? 400 : 90 });
    }
  }
  window.__burst = burst;
  function renderPetals() {
    for (let k = petals.length - 1; k >= 0; k--) {
      const p = petals[k]; p.vy += 0.18; p.vx *= 0.99; p.x += p.vx; p.y += Math.min(p.vy, 9); p.r += p.vr; p.life--;
      p.im.style.transform = `translate(${p.x - 13}px,${p.y - 13}px) rotate(${p.r}deg) scale(${p.s})`;
      p.im.style.opacity = Math.min(1, p.life / 30);
      if (p.life <= 0 || p.y > innerHeight + 60) { p.im.remove(); petals.splice(k, 1); }
    }
  }
  const logo = $('.logo');
  if (logo && document.body.dataset.page === 'home') logo.addEventListener('click', e => { e.preventDefault(); const b = logo.getBoundingClientRect(); burst(b.left + 20, b.top + 20, 18); });
  const fl = $$('.flowers button');
  fl.forEach(b => b.addEventListener('click', () => {
    b.classList.add('got'); const r = b.getBoundingClientRect(); burst(r.left + 17, r.top + 17, 10);
    if (fl.every(x => x.classList.contains('got'))) { const f = $('.found'); if (f) f.style.opacity = 1; burst(innerWidth / 2, 0, 50, true); }
  }));
  let typed = '';
  addEventListener('keydown', e => { if (e.key.length !== 1 || e.target.closest('input,textarea')) return; typed = (typed + e.key.toLowerCase()).slice(-5); if (typed === 'ellie') burst(0, 0, 70, true); });

  /* email: copy address */
  const toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast);
  let tt;
  const say = msg => { toast.textContent = msg; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 2400); };
  $$('[data-email]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(EMAIL); say('Email copied: ' + EMAIL); }
    catch { location.href = 'mailto:' + EMAIL; }
  }));

  /* lightbox */
  const lb = document.createElement('div'); lb.className = 'lb'; lb.innerHTML = '<img alt=""><button aria-label="Close">×</button>'; document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');
  const close = () => { lb.classList.remove('on'); lenis && lenis.start(); };
  $$('img.zoomable').forEach(img => img.addEventListener('click', () => { lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt; lb.classList.add('on'); lenis && lenis.stop(); }));
  lb.addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  /* persona carousel */
  $$('[data-track]').forEach(wrap => {
    const track = $('.persona-track', wrap);
    $$('button[data-dir]', wrap).forEach(b => b.addEventListener('click', () => track.scrollBy({ left: +b.dataset.dir * track.clientWidth * 0.9, behavior: 'smooth' })));
  });

  /* about: skill tabs */
  $$('.skill-tabs').forEach(tabs => {
    const out = tabs.nextElementSibling;
    $$('button', tabs).forEach(b => b.addEventListener('click', () => {
      $$('button', tabs).forEach(x => x.setAttribute('aria-selected', x === b));
      out.textContent = b.dataset.text;
    }));
  });

  /* about: polaroid stack */
  $$('.stack').forEach(st => {
    const cards = $$('.polaroid', st); const rots = [-6, 4, -2, 7, -4];
    let order = cards.map((_, i) => i);
    const lay = () => order.forEach((ci, pos) => {
      const c = cards[ci]; c.style.zIndex = cards.length - pos;
      c.style.transform = `translate(${pos * 4}px,${pos * 4}px) rotate(${rots[ci % rots.length]}deg)`;
    });
    lay();
    const next = () => {
      const top = cards[order[0]];
      if (!reduce) { top.style.transform = 'translate(120%,-10%) rotate(18deg)'; top.style.opacity = 0; }
      setTimeout(() => { order.push(order.shift()); top.style.opacity = 1; lay(); }, reduce ? 0 : 320);
    };
    st.addEventListener('click', next);
    st.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } });
  });

  /* main loop */
  const frameHooks = [];
  window.__onFrame = fn => frameHooks.push(fn);
  function frame(t) {
    lenis && lenis.raf(t);
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    cur.style.transform = `translate(${mx}px,${my}px)`; ring.style.transform = `translate(${rx}px,${ry}px)`;
    frameHooks.forEach(f => f(t));
    renderPetals();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
