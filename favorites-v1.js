(function () {
  'use strict';

  const KEY = 'churetube_favorites_v1';
  const MEMBERS = [
    { id: 'marin', name: '一ノ瀬まりん', short: 'まりん' },
    { id: 'karen', name: '東雲かれん', short: 'かれん' },
    { id: 'kuna', name: '泣久那くな', short: 'くな' },
    { id: 'anon', name: '椿木あのん', short: 'あのん' },
    { id: 'hia', name: '恋羽音ひあ', short: 'ひあ' }
  ];

  function load() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(value) ? value.filter((id) => MEMBERS.some((m) => m.id === id)) : [];
    } catch (_) {
      return [];
    }
  }

  function save(ids) {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch (_) {}
  }

  let favorites = load();

  const style = document.createElement('style');
  style.textContent = `
    #ct-fav-root { position: fixed; z-index: 9999; right: 14px; bottom: calc(72px + env(safe-area-inset-bottom)); font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    #ct-fav-button { border: 0; border-radius: 999px; padding: 12px 16px; background: #fff; color: #333; box-shadow: 0 5px 22px rgba(0,0,0,.18); font-size: 14px; font-weight: 700; cursor: pointer; }
    #ct-fav-button .heart { color: #e889ad; font-size: 19px; vertical-align: -1px; margin-right: 5px; }
    #ct-fav-panel { display: none; position: fixed; left: 14px; right: 14px; bottom: calc(128px + env(safe-area-inset-bottom)); max-height: min(70vh, 520px); overflow: auto; background: rgba(255,255,255,.98); border-radius: 22px; box-shadow: 0 12px 40px rgba(0,0,0,.25); padding: 18px; color: #222; }
    #ct-fav-panel.open { display: block; }
    #ct-fav-head { display:flex; align-items:center; justify-content:space-between; margin-bottom: 12px; }
    #ct-fav-title { font-size: 18px; font-weight: 800; }
    #ct-fav-close { border:0; background:#f2f2f2; width:32px; height:32px; border-radius:50%; font-size:18px; }
    .ct-fav-item { display:flex; align-items:center; gap:10px; padding:10px 0; border-top:1px solid #eee; }
    .ct-fav-item:first-child { border-top:0; }
    .ct-fav-check { width:20px; height:20px; accent-color:#e889ad; }
    .ct-fav-name { flex:1; font-size:15px; font-weight:700; }
    .ct-fav-link { text-decoration:none; color:#777; font-size:12px; }
    #ct-fav-note { margin-top: 12px; color:#888; font-size:11px; line-height:1.5; }
    @media (min-width: 700px) { #ct-fav-root { right: 24px; } #ct-fav-panel { left:auto; width:360px; right:24px; } }
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'ct-fav-root';
  root.innerHTML = `
    <button id="ct-fav-button" type="button" aria-expanded="false"><span class="heart">♡</span>お気に入り</button>
    <section id="ct-fav-panel" aria-label="お気に入りメンバー">
      <div id="ct-fav-head"><div id="ct-fav-title">お気に入りメンバー</div><button id="ct-fav-close" type="button" aria-label="閉じる">×</button></div>
      <div id="ct-fav-list"></div>
      <div id="ct-fav-note">この設定はこのiPhoneのブラウザ内だけに保存されます。</div>
    </section>
  `;
  document.body.appendChild(root);

  const button = document.getElementById('ct-fav-button');
  const panel = document.getElementById('ct-fav-panel');
  const list = document.getElementById('ct-fav-list');
  const close = document.getElementById('ct-fav-close');

  function render() {
    list.innerHTML = MEMBERS.map((m) => {
      const checked = favorites.includes(m.id);
      return `<div class="ct-fav-item">
        <input class="ct-fav-check" type="checkbox" id="ct-fav-${m.id}" data-id="${m.id}" ${checked ? 'checked' : ''}>
        <label class="ct-fav-name" for="ct-fav-${m.id}">${m.name}</label>
        <a class="ct-fav-link" href="/members/${m.id}">詳細 ›</a>
      </div>`;
    }).join('');

    list.querySelectorAll('.ct-fav-check').forEach((input) => {
      input.addEventListener('change', function () {
        const id = this.getAttribute('data-id');
        if (this.checked && !favorites.includes(id)) favorites.push(id);
        if (!this.checked) favorites = favorites.filter((x) => x !== id);
        save(favorites);
        updateButton();
      });
    });
  }

  function updateButton() {
    button.innerHTML = `<span class="heart">${favorites.length ? '♥' : '♡'}</span>お気に入り${favorites.length ? ' ' + favorites.length : ''}`;
  }

  button.addEventListener('click', function () {
    const open = panel.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    if (open) render();
  });
  close.addEventListener('click', function () {
    panel.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', function (event) {
    if (!root.contains(event.target)) {
      panel.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  updateButton();
})();
