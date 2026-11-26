/* Ellie Lin portfolio: shared interactions for every page */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const EMAIL = 'elly95021@gmail.com';


  /* Chinese version (EN / 中 toggle) */
  const ZH = window.__zh || null;
  const L = (en) => (ZH && ZH.ui[en]) || en;
  const units = root => {
 const B=new Set(['P','Q','H1','H2','H3','H4','H5','H6','LI','FIGCAPTION','SUMMARY','TD','TH','DIV','SECTION','HEADER','FOOTER','NAV','FIGURE','BLOCKQUOTE','BUTTON','LABEL','DD','DT','UL','OL','TABLE','TBODY','THEAD','TR','DETAILS','MAIN','ARTICLE','ASIDE','BODY']);
 const sel=[...B].join(',');
 const out=[];const seen=new Set();
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
 while((n=w.nextNode())){
  if(!/[A-Za-z]/.test(n.nodeValue))continue;
  const el=n.parentElement; if(!el||el.closest('script,style,svg,noscript,[data-noi18n]'))continue;
  let u=el; while(u&&!B.has(u.tagName))u=u.parentElement;
  if(!u)continue;
  if(u.querySelector(sel)){
    if(B.has(el.tagName)){ u=n; }
    else { u=el; while(u.parentElement&&!B.has(u.parentElement.tagName)&&!u.parentElement.querySelector(sel))u=u.parentElement; }
  }
  if(seen.has(u))continue; seen.add(u); out.push(u);
 }
 return out;
};
  if (ZH) {
    document.documentElement.lang = 'zh-Hant';
    const norm = s => s.replace(/\s+/g, ' ').trim();
    units(document.body).forEach(u => {
      if (u.nodeType === 3) { const z = ZH.t[norm(u.nodeValue)]; if (z != null) u.nodeValue = u.nodeValue.replace(u.nodeValue.trim(), z); return; }
      let z = ZH.t[norm(u.textContent)]; if (z == null) return; if (u.tagName === 'Q') z = z.replace(/^<q>|<\/q>$/g, '');
      const svgs = [...u.querySelectorAll('svg')], imgs = [...u.querySelectorAll('img')], links = [...u.querySelectorAll('a')];
      u.innerHTML = z.replace(/\{\{SVG(\d+)\}\}/g, '<i data-svg="$1"></i>');
      u.querySelectorAll('i[data-svg]').forEach(i => { const s = svgs[+i.dataset.svg]; s ? i.replaceWith(s) : i.remove(); });
      const copy = (fresh, old) => fresh.forEach((el, i) => { const o = old[i]; if (o) [...o.attributes].forEach(a => { if (!el.hasAttribute(a.name)) el.setAttribute(a.name, a.value); }); });
      copy([...u.querySelectorAll('img')], imgs); copy([...u.querySelectorAll('a')], links);
    });
    $$('[data-text]').forEach(b => { const z = ZH.t[norm(b.dataset.text)]; if (z) b.dataset.text = z; });
    $$('[data-toc]').forEach(s => { const z = ZH.toc[s.dataset.toc]; if (z) s.dataset.toc = z; });
    if (ZH.title[document.title]) document.title = ZH.title[document.title];
  }
  $$('.langsel').forEach(w => {
    const btn = $('.lang', w), cur = ZH ? 'zh' : 'en';
    $$('[data-lang]', w).forEach(o => { o.classList.toggle('on', o.dataset.lang === cur); o.addEventListener('click', () => { if (o.dataset.lang !== cur) { try { localStorage.setItem('lang', o.dataset.lang); } catch (e) {} location.reload(); } else close(); }); });
    const close = () => { w.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', e => { e.stopPropagation(); const o = !w.classList.contains('open'); w.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); });
    document.addEventListener('click', e => { if (!w.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  });
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

  const onScr = () => document.body.classList.toggle('scrolled', scrollY > innerHeight * 0.6);
  onScr(); addEventListener('scroll', onScr, { passive: true });

  /* opening animation (preview with ?intro=a|b|c) */
  const introKind = document.documentElement.dataset.intro;
  if (introKind) {
    const ov = document.createElement('div'); ov.id = 'intro'; ov.className = 'intro-' + introKind; ov.setAttribute('aria-hidden', 'true');
    let finished = false;
    const finish = () => { if (finished) return; finished = true; window.__introDone && window.__introDone(); };
    const lift = (ms) => { ov.style.transition = `transform ${ms}ms cubic-bezier(.7,0,.25,1)`; ov.classList.add('up'); setTimeout(() => { ov.remove(); fl && fl.remove(); document.documentElement.classList.remove('intro-hold'); }, ms + 50); };
    let fl = null, skipT = [];
    const skip = () => { skipT.forEach(clearTimeout); finish(); ov.style.transition = 'opacity .3s'; ov.style.opacity = 0; fl && (fl.style.transition = 'opacity .3s', fl.style.opacity = 0); setTimeout(() => { ov.remove(); fl && fl.remove(); document.documentElement.classList.remove('intro-hold'); }, 320); };
    const at = (ms, fn) => skipT.push(setTimeout(fn, ms));
    {
      const sp = document.body.dataset.page === 'home' ? 1 : .7;
      fl = document.createElement('div'); fl.id = 'intro-flower';
      fl.innerHTML = '<img class="o" src="logo.png" alt=""><img class="f" src="logo-fill.png?v=3" alt="">';
      document.body.append(ov, fl);
      const o = fl.querySelector('.o'); const t0 = performance.now();
      const sweep = now => { const k = Math.min(1, (now - t0) / (750 * sp)); const e = 1 - Math.pow(1 - k, 3); o.style.setProperty('--a', (e * 360) + 'deg'); if (k < 1) requestAnimationFrame(sweep); };
      requestAnimationFrame(sweep);
      at(780 * sp, () => fl.classList.add('bloom'));
      at(1250 * sp, () => {
        const lg = $('.logo'); const r = lg && getComputedStyle(lg).display !== 'none' ? lg.getBoundingClientRect() : null;
        const cx = innerWidth / 2, cy = innerHeight / 2;
        fl.classList.add('fly');
        fl.style.transform = r ? `translate(${r.left + r.width / 2 - cx}px, ${r.top + r.height / 2 - cy}px) scale(${r.width / 96})` : 'translate(0,-40vh) scale(.4)';
        if (!r) fl.style.opacity = 0;
        finish(); lift(700);
      });
      at(1900 * sp, () => { fl.style.opacity = 0; });
    }
    document.documentElement.classList.add('intro-hold', 'intro-started');
    ov.addEventListener('click', skip); fl && fl.addEventListener('click', skip);
    addEventListener('keydown', skip, { once: true });
  }

  /* light / dark switch */
  const root = document.documentElement;
  const syncThemeBtn = () => $$('.theme').forEach(b => b.setAttribute('aria-label', L(root.dataset.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode')));
  syncThemeBtn();
  $$('.theme').forEach(b => b.addEventListener('click', () => {
    const light = root.dataset.theme !== 'light';
    if (light) root.dataset.theme = 'light'; else delete root.dataset.theme;
    try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {}
    syncThemeBtn();
  }));

  /* reveal on scroll */
  $$('[data-auto]').forEach(sec => [...sec.children].forEach((c, i) => { if (!c.hasAttribute('data-r')) { c.setAttribute('data-r', ''); } }));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const t = e.target; t.classList.add('in'); io.unobserve(t); setTimeout(() => { t.removeAttribute('data-r'); t.classList.remove('in'); }, 1400 + (parseFloat(t.style.getPropertyValue('--d')) || 0) * 1000); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('[data-r]').forEach(el => io.observe(el));

  /* videos play only when visible */
  const vio = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { v.play().catch(() => {}); } else v.pause(); }), { threshold: 0.2 });
  $$('video[data-auto-play]').forEach(v => { v.muted = true; vio.observe(v); });

  /* cursor */
  const cur = document.createElement('div'), ring = document.createElement('div');
  cur.className = 'cur'; ring.className = 'ring'; ring.innerHTML = '<span>' + L('View ↗') + '</span>';
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
  $$('details.rq summary').forEach(su => su.dataset.tip = L('Click to view details'));
  const logo = $('.logo');
  if (logo) {
    const home = document.body.dataset.page === 'home', touch = matchMedia('(hover: none)').matches;
    const tip = document.createElement('div'); tip.className = 'logo-tip'; tip.setAttribute('aria-hidden', 'true');
    tip.textContent = home ? L('Click to make it bloom') : L('Back home');
    document.body.appendChild(tip);
    let armed = false, tt;
    const show = () => { const b = logo.getBoundingClientRect(); tip.style.left = b.left + 'px'; tip.style.top = (b.bottom + 10) + 'px'; tip.classList.add('on'); };
    const hide = () => { tip.classList.remove('on'); armed = false; clearTimeout(tt); };
    if (!touch) { logo.addEventListener('mouseenter', show); logo.addEventListener('mouseleave', hide); }
    if (home) logo.addEventListener('click', e => {
      e.preventDefault();
      if (touch && !armed) { tip.textContent = L('Tap again to make it bloom'); show(); armed = true; clearTimeout(tt); tt = setTimeout(hide, 3000); return; }
      hide();
      const b = logo.getBoundingClientRect(); burst(b.left + 20, b.top + 20, 18); history.replaceState(null, '', location.pathname); lenis ? lenis.scrollTo(0, { duration: 1.4 }) : scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
    else logo.addEventListener('click', hide);
  }
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
    try { await navigator.clipboard.writeText(EMAIL); say(L('Email copied: ') + EMAIL); }
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

  /* about: polaroids scatter on hover (desktop) / tap to flip through (phone) */
  $$('.scatter').forEach(sc => {
    const cards = $$('.polaroid', sc);
    const wide = matchMedia('(min-width: 761px)');
    let order = cards.map((_, i) => cards.length - 1 - i); // top card first
    const stackLay = () => order.forEach((ci, pos) => { cards[ci].style.zIndex = cards.length - pos; });
    const fit = () => {
      const stack = !wide.matches;
      sc.classList.toggle('stackmode', stack);
      if (stack) { sc.classList.remove('open'); sc.style.transform = ''; sc.parentElement.style.height = ''; stackLay(); return; }
      cards.forEach(c => c.style.zIndex = '');
      const k = Math.min(1, (sc.parentElement.clientWidth) / 940); sc.style.transform = `scale(${k})`; sc.parentElement.style.height = 560 * k + 'px';
    };
    fit(); addEventListener('resize', fit);
    sc.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && wide.matches) sc.classList.add('open'); });
    sc.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && wide.matches) sc.classList.remove('open'); });
    const next = () => {
      const top = cards[order[0]];
      if (!reduce) top.classList.add('toss');
      setTimeout(() => { order.push(order.shift()); top.classList.remove('toss'); stackLay(); }, reduce ? 0 : 300);
    };
    sc.addEventListener('click', () => { if (sc.classList.contains('stackmode')) next(); else if (!fine) sc.classList.toggle('open'); });
    sc.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sc.classList.contains('stackmode') ? next() : sc.classList.toggle('open'); } });
  });

  /* case study: contents sidebar */
  const tocSecs = $$('[data-toc]');
  if (tocSecs.length > 2) {
    const toc = document.createElement('nav'); toc.className = 'toc'; toc.setAttribute('aria-label', L('Contents'));
    toc.innerHTML = '<div class="ticks" aria-hidden="true">' + tocSecs.map(() => '<i></i>').join('') + '</div><div class="panel"><span>' + L('Contents') + '</span>' +
      tocSecs.map((s, i) => `<a href="#" data-i="${i}">${s.dataset.toc}</a>`).join('') + '</div>';
    document.body.appendChild(toc);
    const ticks = $$('.ticks i', toc), links = $$('.panel a', toc);
    links.forEach(a => a.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); a.blur(); const s = tocSecs[+a.dataset.i]; s === tocSecs[0] && s.classList.contains('cs-hero') ? (lenis ? lenis.scrollTo(0) : scrollTo(0, 0)) : scrollToEl(s, -100); }));
    const foot = $('.others') || $('.foot');
    const upd = () => {
      let cur = 0; const y = innerHeight * 0.35;
      tocSecs.forEach((s, i) => { if (s.getBoundingClientRect().top < y) cur = i; });
      ticks.forEach((t, i) => t.classList.toggle('on', i === cur)); links.forEach((t, i) => t.classList.toggle('on', i === cur));
      const fb = foot ? foot.getBoundingClientRect().top : 1e9;
      toc.classList.toggle('on', fb > innerHeight * 0.6);
    };
    upd(); addEventListener('scroll', upd, { passive: true });
  }

  /* letter-by-letter title (same as the home hero) */
  $$('[data-letters]').forEach(h => {
    h.innerHTML = [...h.textContent].map((c, i) => c === ' ' ? ' ' : `<span class="ch" style="display:inline-block;transition-delay:${reduce ? 0 : .15 + i * .05}s">${c}</span>`).join('');
    const chars = $$('.ch', h);
    if (!reduce) {
      chars.forEach(c => { c.style.transform = 'translateY(10px)'; c.style.opacity = 0; c.style.filter = 'blur(10px)'; });
      (window.__introWait || Promise.resolve()).then(() => { requestAnimationFrame(() => requestAnimationFrame(() => chars.forEach(c => { c.style.transition = 'transform .45s cubic-bezier(.2,.8,.2,1),opacity .45s ease-out,filter .45s ease-out'; c.style.transform = ''; c.style.opacity = 1; c.style.filter = ''; })));
        setTimeout(() => chars.forEach(c => { c.style.transition = 'transform .35s cubic-bezier(.3,1.5,.5,1)'; c.style.transitionDelay = '0s'; c.style.removeProperty('filter'); }), 750 + chars.length * 50); });
      window.__onPointer((mx, my) => chars.forEach(c => { const b = c.getBoundingClientRect(), d = Math.hypot(b.left + b.width / 2 - mx, b.top + b.height / 2 - my); c.style.transform = d < 110 ? `translateY(${-(1 - d / 110) * 14}px)` : ''; }));
    }
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
