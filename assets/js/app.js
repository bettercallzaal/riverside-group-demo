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

  // Single-page inquiry form
  const form = document.querySelector('.inquiry-form');
  if (form) {
    const btnNext = form.querySelector('.btn-next');
    const complete = form.querySelector('.form-complete');
    const formNav = form.querySelector('.form-nav');
    const steps = Array.from(form.querySelectorAll('.form-step'));
    const answers = {};

    function validate() {
      const required = form.querySelectorAll('[data-required]');
      let ok = true;
      required.forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
          if (!el.value.trim()) ok = false;
        } else if (el.classList.contains('option-grid')) {
          if (!el.querySelector('.option.selected')) ok = false;
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
        validate();
      });
    });

    form.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('input', () => {
        answers[el.name] = el.value;
        validate();
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (btnNext.disabled) return;
      steps.forEach(s => s.classList.remove('active'));
      formNav.style.display = 'none';
      complete.classList.add('show');
      console.log('Inquiry submitted:', answers);
    });

    validate();
  }

  // ===== Capabilities-page features =====

  // Scroll reveal
  const reveal = document.querySelectorAll('[data-reveal]');
  if (reveal.length) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveal.forEach(el => ro.observe(el));
  }

  // Animated stat counters
  const stats = document.querySelectorAll('.stat-num[data-count]');
  if (stats.length) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const dur = 1400;
        const start = performance.now();
        function tick(t) {
          const p = Math.min((t - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        so.unobserve(el);
      });
    }, { threshold: 0.4 });
    stats.forEach(el => so.observe(el));
  }

  // Style-finder quiz
  const quiz = document.querySelector('.quiz-card');
  if (quiz) {
    const steps = Array.from(quiz.querySelectorAll('.quiz-step'));
    const result = quiz.querySelector('.quiz-result');
    const progressBar = quiz.querySelector('.quiz-progress-bar');
    const restart = quiz.querySelector('.quiz-restart');
    const titleEl = quiz.querySelector('#quizResultTitle');
    const bodyEl = quiz.querySelector('#quizResultBody');
    const answers = {};
    let qi = 0;

    const recommend = (a) => {
      if (a.goal === 'maintain') return { t: 'Stewardship engagement', b: 'Annual care plan, seasonal walk-throughs, fine pruning, and replanting. From $18K per year.' };
      if (a.goal === 'restore') return { t: 'Restoration package', b: 'Site assessment, invasive removal, planting plan, and a phased install. Typical 4-9 month engagement.' };
      if (a.property === 'coastal-estate') return { t: 'Schooner package', b: 'Full master plan, hardscape, planting design, and construction with stewardship included for the first season.' };
      if (a.property === 'working-land') return { t: 'Working land plan', b: 'Productive landscape design - orchards, meadows, drainage, and access. Built to be worked.' };
      if (a.style === 'wild') return { t: 'Meadow package', b: 'Naturalistic design with native meadows, edge-of-woods plantings, and minimal hardscape.' };
      if (a.property === 'cottage') return { t: 'Cottage garden', b: 'Period-true planting and stonework scaled to a smaller property. Thoughtful, not fussy.' };
      return { t: 'Custom design', b: 'Master plan, planting scheme, and selective install tuned to your property.' };
    };

    const updateProgress = () => {
      progressBar.style.width = ((qi / steps.length) * 100) + '%';
    };

    const advance = () => {
      qi += 1;
      if (qi < steps.length) {
        steps.forEach((s, i) => s.classList.toggle('active', i === qi));
      } else {
        steps.forEach(s => s.classList.remove('active'));
        const r = recommend(answers);
        titleEl.textContent = r.t;
        bodyEl.textContent = r.b;
        result.classList.add('active');
      }
      updateProgress();
    };

    quiz.querySelectorAll('.quiz-options').forEach(grp => {
      grp.addEventListener('click', e => {
        const opt = e.target.closest('.quiz-opt');
        if (!opt) return;
        grp.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        answers[grp.dataset.name] = opt.dataset.value;
        setTimeout(advance, 220);
      });
    });

    if (restart) {
      restart.addEventListener('click', () => {
        qi = 0;
        Object.keys(answers).forEach(k => delete answers[k]);
        quiz.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('selected'));
        result.classList.remove('active');
        steps.forEach((s, i) => s.classList.toggle('active', i === 0));
        updateProgress();
      });
    }
  }

  // Portfolio filter
  const portfolioFilter = document.getElementById('portfolioFilter');
  if (portfolioFilter) {
    const cards = document.querySelectorAll('.portfolio-grid .project-card');
    portfolioFilter.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        portfolioFilter.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        const f = chip.dataset.filter;
        cards.forEach(card => {
          const tags = (card.dataset.tags || '').split(/\s+/);
          const show = f === 'all' || tags.includes(f);
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Cost estimator
  const estimator = document.querySelector('.estimator-card');
  if (estimator) {
    const finishLabel = estimator.querySelector('.estimator-finish-label');
    const outputEl = estimator.querySelector('.estimator-output-value');
    const finishLabels = ['Refined entry', 'Refined', 'Heirloom'];
    const finishMult = [0.7, 1, 1.55];
    const state = { scope: 120000, size: 1, finish: 1 };

    const fmt = (n) => '$' + Math.round(n / 1000) + 'K';

    const compute = () => {
      const base = state.scope * state.size * finishMult[state.finish];
      const low = base * 0.85;
      const high = base * 1.2;
      outputEl.textContent = fmt(low) + ' - ' + fmt(high);
      finishLabel.textContent = finishLabels[state.finish];
    };

    estimator.querySelectorAll('.estimator-chips').forEach(grp => {
      grp.addEventListener('click', e => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        grp.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        const name = grp.dataset.name;
        if (name === 'scope') state.scope = parseFloat(chip.dataset.cost);
        if (name === 'size') state.size = parseFloat(chip.dataset.mult);
        compute();
      });
    });

    const slider = estimator.querySelector('.estimator-slider');
    if (slider) {
      slider.addEventListener('input', () => {
        state.finish = parseInt(slider.value, 10) - 1;
        compute();
      });
    }

    compute();
  }
})();
