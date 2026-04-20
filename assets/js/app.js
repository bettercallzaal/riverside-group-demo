(function () {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // Before/After slider
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const afterWrap = slider.querySelector('.ba-after-wrap');
    const divider = slider.querySelector('.ba-divider');
    const handle = slider.querySelector('.ba-handle');
    let dragging = false;

    function setPos(clientX) {
      const rect = slider.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const pct = (x / rect.width) * 100;
      afterWrap.style.width = pct + '%';
      divider.style.left = pct + '%';
      handle.style.left = pct + '%';
    }

    const start = (e) => { dragging = true; e.preventDefault(); };
    const move = (e) => {
      if (!dragging) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(cx);
    };
    const end = () => { dragging = false; };

    slider.addEventListener('mousedown', start);
    slider.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);

    slider.addEventListener('click', (e) => {
      if (dragging) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(cx);
    });
  });

  // Multi-step form
  const form = document.querySelector('.inquiry-form');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.form-step'));
  const progress = Array.from(form.querySelectorAll('.form-progress-step'));
  const btnNext = form.querySelector('.btn-next');
  const btnBack = form.querySelector('.btn-back');
  const complete = form.querySelector('.form-complete');
  const formNav = form.querySelector('.form-nav');
  const answers = {};
  let current = 0;

  function render() {
    steps.forEach((s, i) => s.classList.toggle('active', i === current));
    progress.forEach((p, i) => p.classList.toggle('active', i <= current));
    btnBack.style.visibility = current === 0 ? 'hidden' : 'visible';
    btnNext.textContent = current === steps.length - 1 ? 'Send inquiry' : 'Continue';
    validateStep();
  }

  function validateStep() {
    const active = steps[current];
    const required = active.querySelectorAll('[data-required]');
    let ok = true;
    required.forEach(el => {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (!el.value.trim()) ok = false;
      } else if (el.classList.contains('option-grid')) {
        if (!active.querySelector('.option.selected')) ok = false;
      }
    });
    btnNext.disabled = !ok;
  }

  form.querySelectorAll('.option-grid').forEach(grid => {
    grid.addEventListener('click', (e) => {
      const opt = e.target.closest('.option');
      if (!opt) return;
      const multi = grid.dataset.multi === 'true';
      if (multi) {
        opt.classList.toggle('selected');
      } else {
        grid.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      }
      const values = Array.from(grid.querySelectorAll('.option.selected')).map(o => o.dataset.value);
      answers[grid.dataset.name] = multi ? values : values[0];
      validateStep();
    });
  });

  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', () => {
      answers[el.name] = el.value;
      validateStep();
    });
  });

  btnNext.addEventListener('click', (e) => {
    e.preventDefault();
    if (btnNext.disabled) return;
    if (current < steps.length - 1) {
      current += 1;
      render();
    } else {
      steps.forEach(s => s.classList.remove('active'));
      progress.forEach(p => p.classList.add('active'));
      formNav.style.display = 'none';
      complete.classList.add('show');
      console.log('Inquiry submitted:', answers);
    }
  });

  btnBack.addEventListener('click', (e) => {
    e.preventDefault();
    if (current > 0) { current -= 1; render(); }
  });

  render();
})();
