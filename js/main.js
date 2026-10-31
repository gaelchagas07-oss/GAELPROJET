/* ═══ CONFIGURAÇÃO — edite aqui ═══ */
const CONFIG = {
  whatsapp: '5591980814834',            // DDI + DDD + número, só dígitos (ex.: 5511999999999)
  telefone: '(91) 98081-4834',          // como será exibido
  mensagemPadrao: 'Olá, Dr. Gael. Vim pelo site e preciso de orientação jurídica criminal.'
};

(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const wa = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

  /* Links de WhatsApp / telefone */
  $$('.js-wa').forEach(a => a.href = wa(a.dataset.msg || CONFIG.mensagemPadrao));
  $$('.js-tel').forEach(a => { a.href = 'tel:+' + CONFIG.whatsapp; if (!a.classList.contains('keep')) a.textContent = CONFIG.telefone; });
  $('#ano').textContent = new Date().getFullYear();

  /* Header */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 30);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  /* Menu mobile */
  const burger = $('#burger'), nav = $('#nav');
  const setMenu = (open) => { nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* Reveal ao rolar (com atraso escalonado em grades) */
  $$('.cards,.method,.pillars,.chips,.facts').forEach(g => $$('.reveal, li, div', g).forEach((el, i) => el.style.setProperty('--d', (i % 3) * 0.09 + 's')));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('in'));

  /* Link ativo no menu */
  const links = $$('.nav a[href^="#"]:not(.btn)');
  const secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => spy.observe(s));

  /* Spotlight nos cards */
  $$('.card').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* Abas (fases) — acessível por teclado */
  const tabs = $$('[role=tab]');
  const select = (t, focus) => {
    tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
    if (focus) t.focus();
    t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
    });
  });

  /* FAQ: abre um por vez */
  const dets = $$('.faq details');
  dets.forEach(d => d.addEventListener('toggle', () => { if (d.open) dets.forEach(o => { if (o !== d) o.open = false; }); }));

  /* Formulário → WhatsApp */
  const form = $('#form'), note = $('#note');
  const mask = v => { v = v.replace(/\D/g, '').slice(0, 11); return v.length > 10 ? v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') : v.length > 6 ? v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3') : v.length > 2 ? v.replace(/(\d{2})(\d*)/, '($1) $2') : v; };
  $('#tel').addEventListener('input', e => e.target.value = mask(e.target.value));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = form.elements;
    let ok = true;
    [f.nome, f.tel, f.situ].forEach(el => { const bad = !el.value.trim() || (el === f.tel && el.value.replace(/\D/g, '').length < 10); el.classList.toggle('invalid', bad); if (bad) ok = false; });
    if (!f.lgpd.checked) ok = false;
    note.classList.toggle('err', !ok);
    if (!ok) { note.textContent = 'Preencha nome, telefone, situação e aceite o uso dos dados.'; return; }
    const msg = `Olá, Dr. Gael. Meu nome é ${f.nome.value.trim()}.\nSituação: ${f.situ.value}.\nUrgência: ${form.urg.value}.\nTelefone: ${f.tel.value}.` + (f.msg.value.trim() ? `\nResumo: ${f.msg.value.trim()}` : '');
    note.textContent = 'Abrindo o WhatsApp…';
    window.open(wa(msg), '_blank', 'noopener');
  });
  $$('.field input,.field select').forEach(el => el.addEventListener('input', () => el.classList.remove('invalid')));

  /* Poeira dourada no hero */
  const cv = $('#dust');
  if (cv && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = cv.getContext('2d'); let W, H, ps = [], raf, vis = true;
    const resize = () => { const d = Math.min(devicePixelRatio || 1, 2); W = cv.width = cv.offsetWidth * d; H = cv.height = cv.offsetHeight * d; ps = Array.from({ length: Math.round(Math.min(70, cv.offsetWidth / 18)) }, () => mk(true, d)); };
    const mk = (init, d = 1) => ({ x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: (Math.random() * 1.6 + .4) * d, vy: (Math.random() * .25 + .06) * d, vx: (Math.random() - .5) * .12 * d, a: Math.random() * .6 + .2, t: Math.random() * 6.28 });
    const tick = () => {
      if (!vis) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.y -= p.vy; p.x += p.vx + Math.sin(p.t += .01) * .15; if (p.y < -10) Object.assign(p, mk(false, W / cv.offsetWidth));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        const al = p.a * (.6 + .4 * Math.sin(p.t * 3));
        g.addColorStop(0, `rgba(255,232,153,${al})`); g.addColorStop(1, 'rgba(225,169,73,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) tick(); }).observe(cv);
    addEventListener('resize', resize); resize(); tick();
  }
})();
