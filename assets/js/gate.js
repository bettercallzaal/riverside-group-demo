(function () {
  var KEY = 'rs_gate_v1';
  var PASS = 'zaal';

  function isAuthed() {
    try { return localStorage.getItem(KEY) === 'ok'; } catch (e) { return false; }
  }

  function setAuthed() {
    try { localStorage.setItem(KEY, 'ok'); } catch (e) {}
  }

  function hideContent() {
    var s = document.createElement('style');
    s.id = 'gate-hide';
    s.textContent = 'body > *:not(.gate-overlay) { visibility: hidden !important; } html, body { overflow: hidden !important; }';
    document.head.appendChild(s);
  }

  function revealContent() {
    var s = document.getElementById('gate-hide');
    if (s) s.remove();
  }

  function showGate() {
    var overlay = document.createElement('div');
    overlay.className = 'gate-overlay';
    overlay.innerHTML = '' +
      '<style>' +
      '  .gate-overlay { position: fixed; inset: 0; background: #1f2e1a; display: flex; align-items: center; justify-content: center; z-index: 2147483647; visibility: visible !important; }' +
      '  .gate-card { max-width: 380px; width: calc(100% - 32px); background: rgba(232, 228, 216, 0.06); border: 1px solid rgba(232, 228, 216, 0.18); border-radius: 14px; padding: 32px 28px; color: #f5f2e8; text-align: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif; }' +
      '  .gate-card h1 { font-family: "Fraunces", Georgia, serif; font-style: italic; font-weight: 400; font-size: 30px; margin: 0 0 8px; color: #b89362; }' +
      '  .gate-card p { color: rgba(232, 228, 216, 0.72); font-size: 14px; line-height: 1.55; margin: 0 0 22px; }' +
      '  .gate-card input { width: 100%; padding: 12px 14px; background: rgba(232, 228, 216, 0.04); border: 1px solid rgba(232, 228, 216, 0.24); border-radius: 8px; color: #f5f2e8; font-size: 16px; outline: none; transition: border-color 0.15s; }' +
      '  .gate-card input:focus { border-color: #b89362; }' +
      '  .gate-card input.shake { animation: gate-shake 0.3s; border-color: #c87a4d; }' +
      '  @keyframes gate-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }' +
      '  .gate-card button { margin-top: 12px; width: 100%; padding: 12px 14px; background: #b89362; color: #1f2e1a; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.04em; cursor: pointer; transition: background 0.15s; }' +
      '  .gate-card button:hover { background: #d3ad7a; }' +
      '  .gate-card .err { color: #d89878; font-size: 12px; margin-top: 10px; min-height: 16px; }' +
      '</style>' +
      '<div class="gate-card">' +
      '  <h1>Riverside</h1>' +
      '  <p>Private build doc. Enter password to continue.</p>' +
      '  <input id="gate-input" type="password" autocomplete="current-password" autofocus />' +
      '  <button id="gate-btn">Enter</button>' +
      '  <div class="err" id="gate-err"></div>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = document.getElementById('gate-input');
    var btn = document.getElementById('gate-btn');
    var err = document.getElementById('gate-err');

    function check() {
      var val = (input.value || '').trim().toLowerCase();
      if (val === PASS) {
        setAuthed();
        overlay.remove();
        revealContent();
      } else {
        err.textContent = 'Wrong password.';
        input.classList.remove('shake');
        void input.offsetWidth;
        input.classList.add('shake');
        input.value = '';
        input.focus();
      }
    }

    btn.addEventListener('click', check);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
  }

  if (isAuthed()) return;

  hideContent();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showGate);
  } else {
    showGate();
  }
})();
