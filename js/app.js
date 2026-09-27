// ============================================================
// HỘ CHIẾU SỐ – trang học sinh. Web tĩnh, không máy chủ:
// bài làm lưu trong localStorage của máy, nộp sản phẩm qua Padlet.
// ============================================================
(function () {
  const CFG = window.B10_CONFIG || {};
  const D = window.B10;
  const COLS = CFG.padletColumns || {};
  const KEY = 'b10_passport_v5';
  const PKEY = 'b10_padlet';
  const app = document.getElementById('app');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ABCD = 'ABCD';
  const ST = Object.fromEntries(D.stations.map((s) => [s.id, s]));

  // ---------- lưu trữ ----------
  const fresh = () => ({
    name: '', cls: '', group: '',
    warm: { pick: null }, tools: {}, toolsRead: false, locks: {}, lic: {}, licOrder: {},
    desk: { tr: '' },
    hunt: { topic: null, url: '', site: '' },
    submitted: false,
    exit: { picks: {}, reflect: '', done: false, score: null },
    stamps: {},
  });
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* trình duyệt chặn lưu trữ */ } },
  };
  function deepMerge(a, b) { for (const k in b) a[k] = (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) ? deepMerge(a[k], b[k]) : b[k]; return a; }
  let S = fresh();
  try { const raw = store.get(KEY); if (raw) S = deepMerge(fresh(), JSON.parse(raw)); } catch (e) { /* dữ liệu hỏng: bắt đầu lại */ }
  const save = () => { store.set(KEY, JSON.stringify(S)); paintBar(); };

  // Link Padlet: ?padlet=... (từ mã QR của GV) → lưu lại; nếu không có thì lấy từ config.js
  (function readPadletParam() {
    const p = new URLSearchParams(location.search).get('padlet');
    if (p && /^https?:\/\//i.test(p)) store.set(PKEY, p);
  })();
  const padlet = () => store.get(PKEY) || CFG.padletUrl || '';

  // ---------- tiện ích ----------
  function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 2400); }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (_) { /* bỏ qua */ } ta.remove(); return ok;
    }
  }
  const gt = (text, sl, tl) => `https://translate.google.com/?sl=${sl}&tl=${tl}&text=${encodeURIComponent(text)}&op=translate`;
  const PREFIX = /^(the|a|an|con|qua|trai|hoa|cay|tu|la|mot|chu|word|is)\s+/;
  function norm(s) {
    let t = String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    while (PREFIX.test(t)) t = t.replace(PREFIX, '').trim();
    return t;
  }
  function hash(s) { let x = 0x811c9dc5; const t = norm(s); for (let i = 0; i < t.length; i++) { x ^= t.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; } return x.toString(36); }
  const now = () => { const d = new Date(); return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString('vi-VN'); };
  const shortDate = (ts) => { const d = new Date(ts); return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`; };
  // Chữ chỉ tiếng Việt mới có (không trùng tiếng Pháp/Đức) – dùng để đoán ngôn ngữ của đoạn dán vào
  const VI_ONLY = /[ăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỷỹỵĩũ]/gi;
  const viCount = (t) => (t.match(VI_ONLY) || []).length;
  const SCRIPT = { ja: /[぀-ヿ一-鿿]/, ko: /[가-힯]/, 'zh-CN': /[一-鿿]/, ru: /[Ѐ-ӿ]/ };

  // Ảnh minh hoạ tuỳ chọn trong assets/tram1: thử .png → .jpg → không có thì ẩn khung
  const fig = (name, alt) => `<figure class="fig"><img data-fallback src="assets/tram1/${name}.png" alt="${esc(alt)}"></figure>`;
  function bindFigs() {
    $$('img[data-fallback]').forEach((im) => {
      const fail = () => { if (!im.dataset.tried) { im.dataset.tried = '1'; im.src = im.src.replace(/\.png$/, '.jpg'); } else { const f = im.closest('.fig'); if (f) f.remove(); } };
      im.addEventListener('error', fail);
      if (im.complete && im.naturalWidth === 0) fail();
    });
  }

  // ---------- con dấu ----------
  let uid = 0;
  function stampSVG(st, ts) {
    const id = 'arc' + (++uid);
    return `<svg class="stamp-svg" viewBox="0 0 200 200" role="img" aria-label="Dấu ${esc(st.name)}">
      <defs><path id="${id}" d="M 32,100 A 68,68 0 1,1 168,100"/></defs>
      <circle cx="100" cy="100" r="92" fill="${st.color}" fill-opacity=".08" stroke="${st.color}" stroke-width="6"/>
      <circle cx="100" cy="100" r="76" fill="none" stroke="${st.color}" stroke-width="2" stroke-dasharray="4 4"/>
      <text font-size="15" letter-spacing="3" fill="${st.color}"><textPath href="#${id}" startOffset="50%" text-anchor="middle">HỘ CHIẾU SỐ • BÀI 10</textPath></text>
      <text x="100" y="110" font-size="48" text-anchor="middle">${st.emoji}</text>
      <text x="100" y="143" font-size="20" fill="${st.color}" text-anchor="middle">${esc(st.short)}</text>
      <text x="100" y="164" font-size="12" fill="${st.color}" text-anchor="middle" letter-spacing="1">${ts ? shortDate(ts) : ''}</text>
    </svg>`;
  }
  function award(id) {
    if (S.stamps[id]) return;
    S.stamps[id] = Date.now(); save();
    const st = ST[id];
    const ov = document.createElement('div');
    ov.className = 'stamp-overlay';
    ov.innerHTML = `<div class="inner">${stampSVG(st, S.stamps[id])}<div class="msg">Đã đóng dấu!</div><div class="sub">${esc(st.no)} · ${esc(st.name)}</div></div>`;
    document.body.appendChild(ov);
    const close = () => { ov.remove(); rerender(); };
    ov.addEventListener('click', close);
    setTimeout(() => { if (ov.isConnected) close(); }, 2200);
    confetti(st.color);
  }
  function confetti(color) {
    const cols = [color, '#d8a23f', '#14203b', '#f2d493', '#ffffff'];
    for (let i = 0; i < 46; i++) {
      const c = document.createElement('i');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = cols[i % cols.length];
      c.style.animationDuration = (1.4 + Math.random() * 1.4) + 's';
      c.style.animationDelay = (Math.random() * .3) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3200);
    }
  }

  const done = (id) => !!S.stamps[id];
  const doneCount = () => D.stations.filter((s) => done(s.id)).length;
  function paintBar() {
    $('#stampCount').textContent = `🛂 ${doneCount()}/${D.stations.length}`;
    $('#who').textContent = S.name ? `${S.name}${S.cls ? ' · ' + S.cls : ''}` : '';
  }

  // ---------- điều hướng ----------
  const route = () => (location.hash.replace(/^#\/?/, '') || 'home');
  window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
  document.addEventListener('click', (e) => {
    const n = e.target.closest('[data-nav]');
    if (n) { e.preventDefault(); location.hash = '#/' + n.dataset.nav; }
  });

  function render() {
    const r = route();
    const views = { home: vHome, warm: vWarm, tools: vTools, locks: vLocks, desk: vDesk, lic: vLic, hunt: vHunt, exit: vExit, passport: vPassport };
    const fn = views[r] || vHome;
    document.documentElement.style.setProperty('--c', ST[r] ? ST[r].color : '#14203b');
    app.innerHTML = `<div class="view">${fn.html()}</div>`;
    if (fn.bind) fn.bind();
    bindFigs();
    paintBar();
  }
  // Vẽ lại mà giữ vị trí cuộn và con trỏ trong ô đang gõ
  function rerender() {
    const y = window.scrollY, a = document.activeElement;
    let sel = null, pos = null;
    if (a && (a.id || (a.dataset && a.dataset.h))) { sel = a.id ? '#' + a.id : `[data-h="${a.dataset.h}"]`; try { pos = a.selectionStart; } catch (e) { pos = null; } }
    render(); window.scrollTo(0, y);
    if (sel) { const el = $(sel); if (el && !el.disabled) { el.focus({ preventScroll: true }); try { if (pos != null) el.setSelectionRange(pos, pos); } catch (e) { /* select không hỗ trợ */ } } }
  }

  function hero(id, progress) {
    const st = ST[id];
    return `<section class="hero" data-emoji="${st.emoji}">
      <button class="back" data-nav="home">← Bản đồ</button>
      <div class="meta">${esc(st.no)} · ${esc(st.time)}${done(id) ? ' · ✅ Đã đóng dấu' : ''}</div>
      <h1>${st.emoji} ${esc(st.name)}</h1>
      <p>${esc(st.goal)}</p>
      ${progress != null ? `<div class="progressbar"><i style="width:${Math.round(progress * 100)}%"></i></div>` : ''}
    </section>`;
  }
  function nextBar(id) {
    const i = D.stations.findIndex((s) => s.id === id);
    const nx = D.stations[i + 1];
    return `<div class="nextbar"><button class="btn ghost" data-nav="home">← Bản đồ</button>
      ${nx ? `<button class="btn go" data-nav="${nx.id}">${esc(nx.no)}: ${esc(nx.name)} →</button>` : `<button class="btn gold" data-nav="passport">Xem hộ chiếu 🛂</button>`}</div>`;
  }
  // Khung hướng dẫn "Làm gì / Xong khi"
  const guide = (todo, doneWhen) => `<div class="guide"><div><b>Làm gì?</b><ol>${todo.map((t) => `<li>${t}</li>`).join('')}</ol></div>${doneWhen ? `<div class="when">🔓 <b>Mở bước tiếp theo khi:</b> ${doneWhen}</div>` : ''}</div>`;

  // Nút hoàn thành trạm (sản phẩm được lưu, nộp chung một lần ở chặng Về đích)
  const finishBox = (id, ready, what) => done(id)
    ? `<div class="fb ok">✅ Đã lưu ${what}. Em sẽ nộp cùng toàn bộ bài lên Padlet ở chặng <b>Về đích</b>.</div>`
    : `<button class="btn go big" data-finish="${id}" ${ready ? '' : 'disabled'}>✅ Hoàn thành ${esc(ST[id].no)}</button>`;
  const bindFinish = (id) => { const b = $(`[data-finish="${id}"]`); if (b) b.onclick = () => award(id); };

  // Khối nộp toàn bài lên Padlet (chỉ hiện khi đã hoàn thành Về đích) – Padlet chỉ có 1 cột/1 tường,
  // mỗi lần nộp là một bài đăng riêng, phân biệt bằng tiêu đề.
  function finalBox() {
    const url = padlet();
    const missing = D.stations.filter((x) => !done(x.id));
    return `<div class="submit-box">
      <h3>📤 Nộp bài lên Padlet</h3>
      ${missing.length ? `<p class="note" style="margin:0 0 8px">⚠️ Em còn ${missing.length} trạm chưa đóng dấu: ${missing.map((x) => esc(x.no)).join(', ')}. Em vẫn nộp được, nhưng nên hoàn thành trước.</p>` : ''}
      <ol><li>Bấm <b>Sao chép toàn bộ bài & mở Padlet</b>.</li><li>Trên Padlet, bấm dấu <b>+</b> để đăng bài mới, tiêu đề ghi <b>Bài làm trên lớp – Họ tên – Lớp</b>, nhấn <b>Ctrl + V</b> vào ô nội dung, bấm <b>Đăng</b>.</li><li>Quay lại đây, bấm <b>Em đã nộp</b>.</li></ol>
      <div class="row">
        <button class="btn gold big" id="copyAll">📋 Sao chép toàn bộ bài & mở Padlet</button>
        <button class="btn" id="markSent">${S.submitted ? '✅ Đã nộp' : '✔ Em đã nộp'}</button>
      </div>
      ${url ? '' : '<p class="note" style="margin-top:8px">⚠️ Chưa có link Padlet. Hãy quét mã QR của thầy cô hoặc dán link ở trang Bản đồ.</p>'}
    </div>`;
  }
  function bindFinal() {
    const b = $('#copyAll'), m = $('#markSent');
    if (b) b.onclick = async () => {
      const ok = await copy(fullText());
      toast(ok ? 'Đã sao chép toàn bộ bài! Dán vào Padlet bằng Ctrl + V' : 'Không sao chép được, hãy bôi đen phần bài làm rồi Ctrl + C');
      const url = padlet(); if (url) window.open(url, '_blank', 'noopener');
    };
    if (m) m.onclick = () => { if (!confirm('Em đã dán bài và bấm Đăng trên Padlet chưa?')) return; S.submitted = true; save(); rerender(); toast('Cảm ơn em! Thầy cô sẽ xem trên Padlet.'); };
  }

  // ================= TRANG CHỦ =================
  const vHome = {
    html() {
      const part = (n, title) => {
        const list = D.stations.filter((s) => s.part === n).map((s) => `
          <li><button class="stop" style="--sc:${s.color}" data-nav="${s.id}">
            <span class="node">${s.emoji}</span>
            <span class="txt"><span class="no">${esc(s.no)} · ${esc(s.time)}</span><span class="nm" style="display:block">${esc(s.name)}</span><span class="gl">${esc(s.goal)}</span></span>
            <span class="st">${done(s.id) ? `<span class="mini-stamp" style="display:block">${stampSVG(s, S.stamps[s.id])}</span>` : '<span class="todo">Chưa đóng dấu</span>'}</span>
          </button></li>`).join('');
        return `<div class="part"><span class="pill">Tiết ${n}</span><b>${title}</b></div><ul class="route">${list}</ul>`;
      };
      const mrz = ('P<VNM<' + norm(S.name || 'CONG DAN SO').toUpperCase().replace(/ /g, '<') + '<<' + (S.cls || '10').toUpperCase() + '<<BAI10<INTERNET').padEnd(44, '<').slice(0, 44);
      const next = D.stations.find((s) => !done(s.id));
      return `
      <section class="cover">
        <div class="emblem">🌏</div>
        <div class="t1">HỘ CHIẾU SỐ</div>
        <div class="t2">DIGITAL PASSPORT</div>
        <div class="t3">Vượt rào ngôn ngữ · Mở kho tri thức<br>Bài 10 – Thực hành khai thác tài nguyên trên Internet</div>
      </section>
      <section class="card datapage">
        <div class="label">Trang thông tin người mang hộ chiếu</div>
        <div class="idgrid">
          <label class="field full"><span>Họ và tên</span><input type="text" id="fName" value="${esc(S.name)}" placeholder="Nguyễn Minh Anh" autocomplete="off"></label>
          <label class="field"><span>Lớp</span><input type="text" id="fCls" value="${esc(S.cls)}" placeholder="10A…" autocomplete="off"></label>
          <label class="field"><span>Nhóm</span><select id="fGroup"><option value="">–</option>${[1, 2, 3, 4, 5, 6, 7, 8].map((g) => `<option ${String(S.group) === String(g) ? 'selected' : ''}>${g}</option>`).join('')}</select></label>
        </div>
        <div class="mrz" aria-hidden="true">${esc(mrz)}</div>
      </section>
      <section class="card">
        ${padlet() ? `<div class="row" style="justify-content:space-between"><span>✅ Đã có link Padlet của lớp.</span><button class="link" id="chgPad">Đổi link</button></div>` : ''}
        <div id="padForm" class="${padlet() ? 'hidden' : ''}">
          <div class="label">Link Padlet nộp bài</div>
          <p class="small muted">Quét mã QR của thầy cô là có link tự động. Nếu thầy cô gửi link qua Zalo, dán vào đây:</p>
          <div class="codebox"><input type="url" id="fPad" placeholder="https://padlet.com/..." value="${esc(store.get(PKEY) || '')}"><button class="btn navy" id="savePad">Lưu</button></div>
        </div>
      </section>
      <div class="row" style="margin:6px 0 4px">
        <button class="btn gold big" id="startBtn">${next ? (doneCount() ? `Tiếp tục: ${esc(next.name)} →` : 'Bắt đầu hành trình →') : 'Xem hộ chiếu hoàn chỉnh 🛂'}</button>
      </div>
      ${part(1, 'Vượt rào ngôn ngữ')}
      ${part(2, 'Mở kho tri thức')}
      <div class="row" style="margin-top:8px"><button class="btn" data-nav="passport">🛂 Mở hộ chiếu của em</button></div>`;
    },
    bind() {
      const upd = () => { S.name = $('#fName').value.trim(); S.cls = $('#fCls').value.trim(); S.group = $('#fGroup').value; save(); };
      ['#fName', '#fCls'].forEach((s) => $(s).addEventListener('input', upd));
      $('#fGroup').addEventListener('change', upd);
      $('#savePad').onclick = () => {
        const v = $('#fPad').value.trim();
        if (!/^https?:\/\//i.test(v)) { toast('Link Padlet phải bắt đầu bằng https://'); return; }
        store.set(PKEY, v); toast('Đã lưu link Padlet'); render();
      };
      const chg = $('#chgPad'); if (chg) chg.onclick = () => $('#padForm').classList.remove('hidden');
      $('#startBtn').onclick = () => {
        if (!S.name) { toast('Em điền họ tên vào hộ chiếu trước nhé'); $('#fName').focus(); return; }
        const next = D.stations.find((s) => !done(s.id));
        location.hash = '#/' + (next ? next.id : 'passport');
      };
    },
  };

  // ================= KHỞI ĐỘNG =================
  const vWarm = {
    html() {
      const w = D.warm, p = S.warm.pick, answered = p != null;
      return `${hero('warm')}
      <section class="card tint">
        <h2>📍 Tình huống</h2>
        <p style="margin-top:6px">${esc(w.scenario)}</p>
        <div class="preview"><img src="${w.img}" alt="Tấm biển thông báo bằng tiếng Pháp trong thư viện"></div>
      </section>
      <section class="card qcard"><span class="num">Câu hỏi</span>
        <div class="q">${esc(w.q)}</div>
        <div class="opts one">${w.o.map((o, k) => {
          const cls = answered ? (k === w.a ? 'right' : k === p ? 'wrong' : '') : '';
          return `<button class="opt ${cls}" data-w="${k}" ${answered ? 'disabled' : ''}><span class="k">${ABCD[k]}</span><span>${esc(o)}</span></button>`;
        }).join('')}</div>
        ${answered ? `<div class="fb ${p === w.a ? 'ok' : 'no'}"><b>${p === w.a ? 'Chính xác!' : 'Chưa đúng. Đáp án đúng là ' + ABCD[w.a] + '.'}</b> ${esc(w.e)}</div>` : ''}
      </section>
      ${answered ? `<section class="card">
        <h3>🔓 Camera dịch cho kết quả như sau</h3>
        <table class="t" style="margin-top:8px"><tr><th>Tiếng Pháp</th><th>Tiếng Việt</th></tr>${w.translation.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</table>
        <div class="fb info">💡 ${esc(w.fact)}</div>
      </section>${nextBar('warm')}` : ''}`;
    },
    bind() {
      $$('[data-w]').forEach((b) => b.onclick = () => { S.warm.pick = +b.dataset.w; save(); award('warm'); rerender(); });
    },
  };

  // ================= TRẠM 1: KHÁM PHÁ GOOGLE DỊCH =================
  let showIntro = false;
  const vTools = {
    html() {
      const T = D.tools, n = Object.keys(S.tools).length;
      const right = T.items.filter((it, i) => S.tools[i] === it.a).length;
      const intro = `
        <section class="card tint">
          <div class="step-no">Phần 1 · Đọc hiểu</div>
          <h2>Google Dịch là gì?</h2>
          <p style="margin-top:6px">${esc(T.about)}</p>
          <div class="row"><a class="btn go" href="https://translate.google.com/" target="_blank" rel="noopener">Mở Google Dịch để xem cùng ↗</a></div>
        </section>
        <h2 style="margin:18px 0 10px">8 tính năng em cần biết</h2>
        <div class="feats">${T.features.map((f) => `
          <article class="feat">
            <div class="feat-head"><span class="feat-ic">${f.icon}</span><div><h3>${esc(f.name)}</h3><span class="where">${esc(f.where)}</span></div></div>
            ${fig(f.img, 'Minh hoạ tính năng ' + f.name)}
            <p>${esc(f.what)}</p>
            <ul>${f.extra.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          </article>`).join('')}</div>
        ${S.toolsRead ? '<div class="row" style="margin-top:14px"><button class="btn go" id="hideIntro">Quay lại câu hỏi ↓</button></div>'
          : '<div class="row" style="margin-top:14px"><button class="btn go big" id="readDone">Em đã đọc xong → Sang phần câu hỏi</button></div>'}`;
      if (!S.toolsRead || showIntro) return `${hero('tools', S.toolsRead ? n / T.items.length : 0)}${intro}`;
      return `${hero('tools', n / T.items.length)}
      <section class="card tint">
        <div class="step-no">Phần 2 · Tình huống</div>
        <p style="margin:4px 0 8px">Đọc việc bạn trong từng tình huống cần làm, rồi chọn <b>một cách dùng công cụ phù hợp nhất</b>. Mỗi câu chỉ được chọn một lần; sau khi chọn, web sẽ giải thích cách thực hiện.</p>
        <button class="link" id="showIntro">📖 Xem lại 8 tính năng của Google Dịch</button>
      </section>
      ${T.items.map((it, i) => {
        const pick = S.tools[i];
        return `<section class="card qcard"><span class="num">Tình huống ${i + 1}</span>
          <div class="q">${esc(it.sit)}</div>
          ${fig(it.img, 'Minh hoạ tình huống ' + (i + 1))}
          <div class="opts">${it.opts.map((k) => {
            const o = T.options[k];
            const cls = pick == null ? '' : k === it.a ? 'right' : k === pick ? 'wrong' : '';
            return `<button class="opt ${cls}" data-t="${i}" data-k="${k}" ${pick != null ? 'disabled' : ''}><span class="k">${o.icon}</span><span>${esc(o.label)}</span></button>`;
          }).join('')}</div>
           ${pick != null ? `<div class="fb ${pick === it.a ? 'ok' : 'no'}"><b>${pick === it.a ? 'Đúng rồi!' : 'Chưa đúng. Cách phù hợp: ' + esc(T.options[it.a].label) + '.'}</b> Thao tác: ${esc(it.how)}</div>` : ''}
        </section>`;
      }).join('')}
      ${n === T.items.length ? `<section class="card tint"><h3>Kết quả: ${right}/${T.items.length} lựa chọn đúng ngay lần đầu</h3><p class="small muted" style="margin:4px 0 0">Ghi nhớ: <b>chữ trên đồ vật → máy ảnh</b>, <b>tệp → tài liệu</b>, <b>trang web → dịch trang</b>, <b>nói chuyện → hội thoại</b>, <b>video → phụ đề</b>, <b>chữ lạ → viết tay</b>.</p></section>${nextBar('tools')}` : ''}`;
    },
    bind() {
      const rd = $('#readDone'); if (rd) rd.onclick = () => { S.toolsRead = true; save(); showIntro = false; render(); window.scrollTo(0, 0); };
      const si = $('#showIntro'); if (si) si.onclick = () => { showIntro = true; render(); window.scrollTo(0, 0); };
      const hi = $('#hideIntro'); if (hi) hi.onclick = () => { showIntro = false; render(); window.scrollTo(0, 0); };
      $$('[data-t]').forEach((b) => b.onclick = () => {
        S.tools[b.dataset.t] = b.dataset.k; save();
        if (Object.keys(S.tools).length === D.tools.items.length) award('tools');
        rerender();
      });
    },
  };

  // ================= TRẠM 2: PHÁ 3 Ổ KHOÁ =================
  const vLocks = {
    html() {
      const L = D.locks, open = L.filter((l) => S.locks[l.id] && S.locks[l.id].ok).length;
      return `${hero('locks', open / L.length)}
      <p class="muted">Ở mỗi ổ khoá, em sẽ mở một tài nguyên bằng tiếng nước ngoài, dịch nội dung đó sang tiếng Việt rồi tìm từ khoá được nhắc đến trong bản dịch. Nhập từ khoá vào ô của ổ tương ứng để mở khoá.</p>
      ${L.map((l, i) => {
        const st = S.locks[l.id] || { tries: 0 };
        const gtLink = l.id === 'img' ? 'https://translate.google.com/?sl=ja&tl=vi&op=images' : l.id === 'doc' ? 'https://translate.google.com/?sl=es&tl=vi&op=docs' : '';
        return `<section class="card lock ${st.ok ? 'open' : ''}">
          <div class="lk-head"><span class="padlock">${st.ok ? '🔓' : '🔒'}</span>
            <div><div class="label" style="margin:0">Ổ khoá ${i + 1} · ${l.flag} ${esc(l.lang)}</div><h3>${esc(l.title)}</h3></div>
            <span class="tag" style="margin-left:auto">${esc(l.type)}</span></div>
          ${st.ok ? `<div class="fb ok">🔓 Đã mở khoá với từ <b>"${esc(st.word)}"</b>.</div>` : `
          <ol class="steps">${l.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
          <div class="row">
            ${l.download ? `<a class="btn" href="${l.asset}" download="${l.download}">⬇️ ${l.id === 'img' ? 'Tải về' : esc(l.assetLabel)}</a>` : `<a class="btn" href="${l.asset}" target="_blank" rel="noopener">🌐 ${esc(l.assetLabel)} ↗</a>`}
            ${gtLink ? `<a class="btn" href="${gtLink}" target="_blank" rel="noopener">Google Dịch – ${l.id === 'img' ? 'Hình ảnh' : 'Tài liệu'} ↗</a>` : ''}
          </div>
          ${l.id === 'img' ? `<div class="preview"><img src="${l.asset}" alt="Poster lễ hội bằng tiếng Nhật"></div>` : ''}
          <div class="codebox" style="margin-top:12px"><input type="text" data-code="${l.id}" placeholder="Từ khoá của ổ ${i + 1}…" autocomplete="off"><button class="btn go" data-open="${l.id}">Mở khoá</button></div>
          ${st.tries >= 2 ? `<div class="fb info">💡 Gợi ý: ${esc(l.hint)}</div>` : ''}`}
        </section>`;
      }).join('')}
      ${open === L.length ? `<section class="card tint"><h3>🎉 Phá cả 3 ổ khoá!</h3><p class="small" style="margin:4px 0 0">Em vừa dịch được <b>ảnh</b> (máy ảnh / hình ảnh), <b>tệp</b> (tài liệu) và <b>trang web</b> (dịch trang), ba cách khai thác tài nguyên tiếng nước ngoài phổ biến nhất hiện nay.</p></section>${nextBar('locks')}` : ''}`;
    },
    bind() {
      const tryOpen = (id) => {
        const inp = $(`[data-code="${id}"]`), v = inp.value; if (!v.trim()) return;
        const l = D.locks.find((x) => x.id === id);
        const st = S.locks[id] || (S.locks[id] = { tries: 0 });
        if (l.hashes.includes(hash(v))) {
          st.ok = true; st.word = v.trim(); save(); toast('🔓 Mở khoá thành công!');
          if (D.locks.every((x) => S.locks[x.id] && S.locks[x.id].ok)) award('locks');
          rerender();
        } else {
          st.tries++; save();
          const box = inp.parentElement; box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
          toast('Chưa đúng. Đọc kĩ bản dịch nhé!');
          if (st.tries === 2) rerender();
        }
      };
      $$('[data-open]').forEach((b) => b.onclick = () => tryOpen(b.dataset.open));
      $$('[data-code]').forEach((i) => i.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryOpen(i.dataset.code); }));
    },
  };

  // ================= TRẠM 3: DỊCH THƯ GỬI BẠN QUỐC TẾ =================
  const countWords = (t) => (t.trim() ? t.trim().split(/\s+/).filter(Boolean).length : 0);
  // Giữ lá thư của người đã làm theo phiên bản cũ để bản dịch đã lưu vẫn khớp thư gốc.
  const deskSource = () => S.desk.src?.trim() || D.desk.sample.vi;
  // Ô tiếng Anh không so với bản mẫu nào: chỉ kiểm tra 3 điều kiện dưới đây
  function enRules() {
    const t = S.desk.tr.trim();
    const words = (x) => x.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    const srcSet = new Set(words(deskSource())), tw = words(t);
    const overlap = tw.length ? tw.filter((x) => srcSet.has(x)).length / tw.length : 1;
    const letters = (t.match(/\p{L}/gu) || []).length;
    const vi = viCount(t) + (t.match(/[áãìíòóõúý]/gi) || []).length;
    const need = Math.ceil(countWords(deskSource()) * 0.5);
    return [
      { ok: letters >= 10 && vi / letters < 0.03, label: 'Bản dán gần như không còn chữ có dấu tiếng Việt' },
      { ok: !!t && overlap <= 0.5, label: 'Không phải thư tiếng Việt dán lại (sao chép ở khung <b>bên phải</b> của Google Dịch)' },
      { ok: tw.length >= need, label: `Bản dịch đủ nội dung: ít nhất ${need} từ tiếng Anh (hiện có ${tw.length})` },
    ];
  }
  const enCheck = () => ({ ok: enRules().every((r) => r.ok) });
  const enRulesHtml = () => S.desk.tr.trim() ? enRules().map((r) => `<li class="${r.ok ? 'ok' : ''}">${r.ok ? '✅' : '⬜'} ${r.label}</li>`).join('') : '<li>Dán bản tiếng Anh vào ô để web kiểm tra ngôn ngữ và độ dài. Em vẫn cần tự đọc lại để xem bản dịch có đúng ý thư gốc không.</li>';
  function deskState() {
    const s2 = enCheck().ok;
    return { s2, sig: [s2].join() };
  }
  const deskText = () => `✉️ BẢN DỊCH THƯ GỬI EMMA – ${S.name || '…'} (${S.cls || '…'})\n\n📝 Thư gốc tiếng Việt:\n${deskSource()}\n\n🌍 Bản tiếng Anh (Google Dịch):\n${S.desk.tr.trim()}`;
  const vDesk = {
    html() {
      const d = S.desk, { s2 } = deskState(), oldLetter = !!d.src?.trim();
      const prog = [s2, done('desk')].filter(Boolean).length / 2;
      return `${hero('desk', prog)}
      <section class="card tint">
        <h3>🎯 Nhiệm vụ</h3>
        <p style="margin:6px 0 10px">${oldLetter ? 'Em đã có một lá thư tiếng Việt được lưu từ lần học trước.' : `Minh Anh có một lá thư tiếng Việt gửi bạn <b>${esc(D.desk.friend)}</b>.`} Em hãy dùng Google Dịch chuyển lá thư dưới đây sang tiếng Anh, nghe lại bản dịch và kiểm tra xem nội dung có đúng ý không.</p>
        <div class="flow"><span>📝 Đọc thư có sẵn</span><b>→</b><span>🌍 Dịch sang tiếng Anh</span><b>→</b><span>🔊 Nghe và kiểm tra</span></div>
      </section>
      <div class="tips" style="margin-bottom:14px">${D.desk.tips.map(([t, x]) => `<div class="tip"><b>${esc(t)}</b>${esc(x)}</div>`).join('')}</div>

      <section class="card dstep done">
        <h3><span class="n">1</span>Đọc lá thư cần dịch</h3>
        <p class="small muted">${oldLetter ? 'Đây là lá thư em đã lưu. Hãy dùng chính nội dung này để dịch.' : 'Đây là thư gốc. Em dùng chính nội dung này để dịch, không cần viết thêm thư mới.'}</p>
        <div class="ticket">${esc(deskSource())}</div>
      </section>

      <section class="card dstep ${s2 ? 'done' : ''}">
        <h3><span class="n">2</span>Dịch sang tiếng Anh</h3>
        ${guide(['Bấm nút xanh để mở Google Dịch với lá thư đã được điền sẵn.', 'Kiểm tra: ô bên trái là <b>Tiếng Việt</b>, ô bên phải là <b>Tiếng Anh</b>.', 'Đọc bản tiếng Anh và so với thư gốc, nhất là tên riêng và các câu hỏi dành cho Emma.', 'Bấm 🔊 nghe bản tiếng Anh. Sau đó sao chép bản dịch, quay lại đây và dán vào ô dưới bằng <b>Ctrl + V</b>.'], 'đã dán bản tiếng Anh hợp lệ.')}
        <div class="row"><a class="btn go" id="lnk1" target="_blank" rel="noopener" href="${gt(deskSource(), 'vi', 'en')}">Dịch lá thư bằng Google Dịch ↗</a></div>
        <textarea id="dTr" class="letter" style="margin-top:10px" placeholder="Dán bản tiếng Anh vào đây (Ctrl + V)…">${esc(d.tr)}</textarea>
        <ul class="rules" id="enRules">${enRulesHtml()}</ul>
      </section>

      <section class="card dstep ${done('desk') ? 'done' : ''} ${s2 ? '' : 'locked'}">
        <h3><span class="n">3</span>Hoàn thành</h3>
        ${s2 ? `<div class="ticket" id="ticket">${esc(deskText())}</div><div style="margin-top:12px">${finishBox('desk', true, 'bản dịch lá thư')}</div>` : '<p class="muted small" style="margin:0">Bản dịch sẽ hiện ở đây sau khi em dán bản tiếng Anh hợp lệ vào ô bên trên.</p>'}
      </section>
      ${done('desk') ? nextBar('desk') : ''}`;
    },
    bind() {
      let sig = deskState().sig;
      const onType = (el) => {
        S.desk.tr = el.value; save();
        $('#enRules').innerHTML = enRulesHtml();
        const st = deskState();
        if (st.sig !== sig) { sig = st.sig; rerender(); } else if ($('#ticket')) $('#ticket').textContent = deskText();
      };
      const tr = $('#dTr'); if (tr) tr.addEventListener('input', () => onType(tr));
      bindFinish('desk');
    },
  };

  // ================= TRẠM 4: HỌC LIỆU MỞ & GIẤY PHÉP =================
  const vLic = {
    html() {
      const n = Object.keys(S.lic).length + Object.keys(S.licOrder).length, total = D.lic.length + D.ccOrder.length;
      const right = D.lic.filter((x, i) => S.lic[i] === x.a).length, rightO = D.ccOrder.filter((x, i) => S.licOrder[i] === x.a).length;
      const yn = (key, i, x, p, yes, no) => {
        const cls = (v) => p == null ? '' : v === x.a ? 'right' : v === p ? 'wrong' : '';
        return `<div class="yn"><button class="opt ${cls(true)}" data-${key}="${i}" data-v="1" ${p != null ? 'disabled' : ''}>${yes}</button><button class="opt ${cls(false)}" data-${key}="${i}" data-v="0" ${p != null ? 'disabled' : ''}>${no}</button></div>
          ${p != null ? `<div class="fb ${p === x.a ? 'ok' : 'no'}"><b>${p === x.a ? 'Chính xác!' : 'Chưa đúng.'}</b> ${esc(x.why)}</div>` : ''}`;
      };
      return `${hero('lic', n / total)}
      <div class="step-no" style="margin-bottom:8px">Phần 1 · Đọc hiểu</div>
      <div class="grid3">${D.oerIntro.map(([t, x]) => `<section class="card tint" style="margin:0"><h3>${esc(t)}</h3><p style="margin:6px 0 0">${esc(x)}</p></section>`).join('')}</div>
      <section class="card" style="margin-top:14px">
        <h3>Các kí hiệu Creative Commons (CC)</h3>
        <div class="cc-legend" style="margin:10px 0">${D.ccLegend.map((c) => `<span class="cc"><b>${c.code}</b>${c.icon} ${esc(c.text)}</span>`).join('')}</div>
        <h3 style="margin-top:14px">Quy tắc ghép kí hiệu thành tên giấy phép</h3>
        <div class="cc-chain"><span class="cc-box">CC</span><b>→</b><span class="cc-box">BY</span><b>→</b><span class="cc-box opt-box">NC<small>nếu có</small></span><b>→</b><span class="cc-box opt-box">SA <i>hoặc</i> ND<small>nếu có</small></span></div>
        <ol class="steps">${D.ccRules.map(([, t, x]) => `<li>${t}. <span class="muted">${esc(x)}</span></li>`).join('')}</ol>
        <div class="label" style="margin-top:10px">Vì vậy chỉ có 6 giấy phép CC (và CC0), từ ít hạn chế đến chặt nhất:</div>
        <table class="t" style="margin-top:6px">${D.ccList.map(([a, b]) => `<tr><td style="width:150px"><b>${esc(a)}</b></td><td>${esc(b)}</td></tr>`).join('')}</table>
      </section>
      <section class="card arr-box">
        <h3>${D.arr.icon} Còn nếu tài liệu KHÔNG ghi giấy phép CC nào?</h3>
        <p style="margin:6px 0 0">${esc(D.arr.text)}</p>
      </section>
      <div class="step-no" style="margin:18px 0 8px">Phần 2 · Kiểm tra tên giấy phép</div>
      <p class="muted">Mỗi thẻ dưới đây là một cách ghi tên giấy phép Creative Commons. Dựa vào thứ tự CC → BY → NC (nếu có) → SA hoặc ND (nếu có), em chọn <b>Viết đúng</b> hoặc <b>Viết sai</b>.</p>
      ${D.ccOrder.map((x, i) => `<section class="card qcard"><span class="num">Câu ${i + 1}</span>
        <div class="q">Tên giấy phép <span class="lic-tag" style="font-size:16px">${esc(x.tag)}</span> đã được viết đúng thứ tự các kí hiệu chưa?</div>
        ${yn('ord', i, x, S.licOrder[i], '✅ Viết đúng', '❌ Viết sai')}</section>`).join('')}
      <div class="step-no" style="margin:18px 0 8px">Phần 3 · Em có được sử dụng tài nguyên theo cách này không?</div>
      <p class="muted">Mỗi tình huống cho biết một bạn định sử dụng tài nguyên và giấy phép của tài nguyên đó. Em hãy xét <b>cách sử dụng đã nêu</b> có phù hợp giấy phép không. Mỗi câu chỉ chọn một lần.</p>
      ${D.lic.map((x, i) => `<section class="card qcard"><span class="num">Tình huống ${i + 1}</span>
        <div style="margin-top:6px">Giấy phép của tài nguyên: <span class="lic-tag">${esc(x.tag)}</span></div>
        <div class="q" style="margin-top:0">${esc(x.sit)}</div>
        ${yn('lic', i, x, S.lic[i], '✅ Được', '❌ Không được')}</section>`).join('')}
      ${n === total ? `<section class="card tint"><h3>Kết quả: ${rightO}/${D.ccOrder.length} câu kí hiệu · ${right}/${D.lic.length} tình huống</h3><p class="small" style="margin:4px 0 0">Ở trạm tiếp theo, em sẽ tự tìm một trang học liệu trên Internet.</p></section>${nextBar('lic')}` : ''}`;
    },
    bind() {
      const pick = (store, key) => $$(`[data-${key}]`).forEach((b) => b.onclick = () => {
        store[b.dataset[key]] = b.dataset.v === '1'; save();
        if (Object.keys(S.lic).length === D.lic.length && Object.keys(S.licOrder).length === D.ccOrder.length) award('lic');
        rerender();
      });
      pick(S.licOrder, 'ord'); pick(S.lic, 'lic');
    },
  };

  // ================= TRẠM 5: SĂN HỌC LIỆU (tìm trên Google) =================
  function urlInfo(u) {
    try { const x = new URL(u.trim()); if (!/^https?:$/.test(x.protocol)) return { ok: false }; return { ok: !/(^|\.)google\./.test(x.hostname) && x.hostname.includes('.'), host: x.hostname.replace(/^www\./, ''), google: /(^|\.)google\./.test(x.hostname) }; } catch (e) { return { ok: false }; }
  }
  function huntState() {
    const h = S.hunt, a = !!D.topics.find((t) => t.no === h.topic), u = urlInfo(h.url);
    const b = a && u.ok && h.site.trim().length >= 2;
    return { a, b, u, sig: [a, b, u.ok, !!u.google, !!h.url.trim()].join() };
  }
  const huntText = () => { const h = S.hunt, t = D.topics.find((x) => x.no === h.topic); return `🎯 Bài học: ${t ? t.subject + ' – ' + t.title : ''}\n🏛️ Trang học liệu: ${h.site}\n🔗 ${h.url}`; };
  const vHunt = {
    html() {
      const h = S.hunt, st = huntState(), topic = D.topics.find((t) => t.no === h.topic);
      const q = topic ? `${topic.kw} ${D.searchSuffix}` : '';
      return `${hero('hunt', [st.a, st.b, done('hunt')].filter(Boolean).length / 3)}
      <section class="card tint">
        <h3>🎯 Nhiệm vụ</h3>
        <p style="margin:6px 0 10px">Chọn một bài học, tìm trên Google một <b>trang học liệu</b> (kho học liệu, sách điện tử, bài giảng, bách khoa toàn thư…) có nội dung về bài đó, rồi dán link trang vào đây.</p>
        <div class="flow"><span>① Chọn bài học</span><b>→</b><span>② Tìm trên Google</span><b>→</b><span>③ Dán link</span></div>
      </section>

      <section class="card dstep ${st.a ? 'done' : ''}">
        <h3><span class="n">1</span>Chọn một bài học</h3>
        <div class="topics">${D.topics.map((t) => `<button class="topic" data-topic="${t.no}" aria-pressed="${h.topic === t.no}"><span class="ti">${t.icon}</span><span><small>${esc(t.subject)}</small><b>${esc(t.title)}</b></span></button>`).join('')}</div>
      </section>

      <section class="card dstep ${st.b ? 'done' : ''} ${st.a ? '' : 'locked'}">
        <h3><span class="n">2</span>Tìm trên Google</h3>
        ${guide(['Bấm nút xanh: Google mở ra, từ khoá đã được điền sẵn.', 'Đọc danh sách kết quả, chọn một trang học liệu <b>đáng tin</b> (xem bảng bên dưới) và mở trang đó.', 'Bấm vào thanh địa chỉ của trang, nhấn <b>Ctrl + C</b> để sao chép link.'], '')}
        ${topic ? `<div class="row"><a class="btn go" href="https://www.google.com/search?q=${encodeURIComponent(q)}" target="_blank" rel="noopener">🔎 Tìm "${esc(q)}" trên Google ↗</a></div>` : ''}
        <div class="grid2" style="margin-top:12px">
          <div class="signs good"><b>✅ Trang đáng tin thường là</b><ul>${D.goodSigns.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
          <div class="signs bad"><b>⛔ Nên tránh</b><ul>${D.badSigns.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
        </div>
      </section>

      <section class="card dstep ${done('hunt') ? 'done' : ''} ${st.a ? '' : 'locked'}">
        <h3><span class="n">3</span>Dán link trang em tìm được</h3>
        <label class="field"><span>Link trang học liệu</span><input type="url" data-h="url" value="${esc(h.url)}" placeholder="https://…" ${st.a ? '' : 'disabled'}></label>
        <div class="fb no ${st.u.google ? '' : 'hidden'}" id="urlMsg">Đây là link trang kết quả của Google. Hãy mở trang học liệu rồi sao chép link của trang đó.</div>
        <label class="field"><span>Tên trang / kho học liệu</span><input type="text" data-h="site" value="${esc(h.site)}" placeholder="Ví dụ: Wikipedia tiếng Việt, Hoclieu.vn…" ${st.a ? '' : 'disabled'}></label>
        ${finishBox('hunt', st.b, 'trang học liệu em tìm được')}
      </section>
      ${done('hunt') ? nextBar('hunt') : ''}`;
    },
    bind() {
      $$('[data-topic]').forEach((b) => b.onclick = () => { S.hunt.topic = +b.dataset.topic; save(); rerender(); });
      let sig = huntState().sig;
      $$('[data-h]').forEach((el) => el.addEventListener('input', () => {
        S.hunt[el.dataset.h] = el.value;
        // Tự điền tên trang từ tên miền nếu em chưa gõ
        if (el.dataset.h === 'url' && !S.hunt.site.trim()) { const u = urlInfo(el.value); if (u.ok) { S.hunt.site = u.host; const si = $('[data-h="site"]'); if (si) si.value = u.host; } }
        save();
        const st = huntState();
        $('#urlMsg').classList.toggle('hidden', !st.u.google);
        if (st.sig !== sig) { sig = st.sig; rerender(); }
      }));
      bindFinish('hunt');
    },
  };

  // ================= VỀ ĐÍCH =================
  const vExit = {
    html() {
      const E = S.exit, all = D.exit.every((_, i) => E.picks[i] != null), ok = all && E.reflect.trim().length >= 10;
      return `${hero('exit', Object.keys(E.picks).length / D.exit.length)}
      ${D.exit.map((q, i) => {
        const p = E.picks[i];
        return `<section class="card qcard"><span class="num">Câu ${i + 1}</span><div class="q">${esc(q.q)}</div>
          <div class="opts one">${q.o.map((o, k) => {
            let cls = ''; if (E.done) cls = k === q.a ? 'right' : k === p ? 'wrong' : ''; else if (k === p) cls = 'sel';
            return `<button class="opt ${cls}" data-x="${i}" data-k="${k}" ${E.done ? 'disabled' : ''}><span class="k">${ABCD[k]}</span><span>${esc(o)}</span></button>`;
          }).join('')}</div>
          ${E.done ? `<div class="fb ${p === q.a ? 'ok' : 'no'}">${p === q.a ? '✔' : '✘'} ${esc(q.e)}</div>` : ''}</section>`;
      }).join('')}
      <section class="card">
        <label class="field"><span>💭 Tuần này, em sẽ dùng công cụ hoặc kho học liệu nào để học môn gì?</span>
        <textarea id="xRef" ${E.done ? 'disabled' : ''} placeholder="Ví dụ: Mình sẽ dùng Khan Academy để ôn hệ nhị phân và dùng camera dịch để đọc truyện tranh tiếng Nhật…">${esc(E.reflect)}</textarea></label>
        ${E.done ? `<div class="fb ok"><b>Điểm: ${E.score}/${D.exit.length}</b>. Em đã về đích!</div>` : `<button class="btn go big" id="xSubmit" ${ok ? '' : 'disabled'}>🏁 Nộp bài Về đích</button>${ok ? '' : '<p class="small muted" style="margin-top:6px">Trả lời đủ 6 câu và viết suy nghĩ (ít nhất 10 kí tự).</p>'}`}
      </section>
      ${E.done ? `<section class="card"><div class="label">Toàn bộ bài làm của em</div><div class="ticket full">${esc(fullText())}</div>${finalBox()}</section><div class="nextbar"><button class="btn ghost" data-nav="home">← Bản đồ</button><button class="btn" data-nav="passport">Xem hộ chiếu 🛂</button></div>` : ''}`;
    },
    bind() {
      $$('[data-x]').forEach((b) => b.onclick = () => { S.exit.picks[b.dataset.x] = +b.dataset.k; save(); rerender(); });
      const r = $('#xRef');
      if (r) r.addEventListener('input', () => { S.exit.reflect = r.value; save(); const btn = $('#xSubmit'); if (btn) btn.disabled = !(D.exit.every((_, i) => S.exit.picks[i] != null) && r.value.trim().length >= 10); });
      const s = $('#xSubmit');
      if (s) s.onclick = () => { S.exit.done = true; S.exit.score = D.exit.filter((q, i) => S.exit.picks[i] === q.a).length; save(); award('exit'); };
      bindFinal();
    },
  };

  // ================= HỘ CHIẾU =================
  // Toàn bộ bài làm để dán lên Padlet một lần
  const fullText = () => {
    const toolsRight = D.tools.items.filter((it, i) => S.tools[i] === it.a).length;
    const licRight = D.lic.filter((x, i) => S.lic[i] === x.a).length, ordRight = D.ccOrder.filter((x, i) => S.licOrder[i] === x.a).length;
    const locks = D.locks.filter((l) => S.locks[l.id] && S.locks[l.id].ok).length;
    const m = (id) => (done(id) ? '✅' : '⬜');
    const line = {
      warm: `Khởi động – Tấm biển lạ: ${S.warm.pick == null ? '–' : S.warm.pick === D.warm.a ? 'trả lời đúng' : 'trả lời chưa đúng'}`,
      tools: `Trạm 1 – Khám phá Google Dịch: ${Object.keys(S.tools).length ? toolsRight + '/' + D.tools.items.length + ' tình huống' : '–'}`,
      locks: `Trạm 2 – Phá khoá: ${locks}/${D.locks.length} ổ`,
      desk: `Trạm 3 – Dịch thư: ${done('desk') ? 'đã dịch sang tiếng Anh và nghe thử' : '–'}`,
      lic: `Trạm 4 – Học liệu mở & giấy phép: ${Object.keys(S.lic).length ? ordRight + '/' + D.ccOrder.length + ' kí hiệu, ' + licRight + '/' + D.lic.length + ' tình huống' : '–'}`,
      hunt: `Trạm 5 – Săn học liệu: ${done('hunt') ? 'đã tìm được' : '–'}`,
      exit: `Về đích: ${S.exit.done ? S.exit.score + '/' + D.exit.length : '–'}`,
    };
    return `🛂 BÀI LÀM – BÀI 10: THỰC HÀNH KHAI THÁC TÀI NGUYÊN TRÊN INTERNET\n` +
      `Họ tên: ${S.name || '…'} · Lớp: ${S.cls || '…'}\n` +
      `Số dấu: ${doneCount()}/${D.stations.length}\n\n` +
      `— KẾT QUẢ CÁC TRẠM —\n` + D.stations.map((x) => `${m(x.id)} ${line[x.id]}`).join('\n') +
      (done('desk') ? `\n\n— TRẠM 3: DỊCH THƯ GỬI BẠN EMMA —\n📝 Thư gốc tiếng Việt:\n${deskSource()}\n\n🌍 Bản tiếng Anh (Google Dịch):\n${S.desk.tr.trim()}` : '') +
      (done('hunt') ? `\n\n— TRẠM 5: TRANG HỌC LIỆU EM TÌM ĐƯỢC —\n${huntText()}` : '') +
      `\n\n— SUY NGẪM —\n${S.exit.reflect || ''}\n\n⏱ ${now()}`;
  };
  const vPassport = {
    html() {
      const all = doneCount() === D.stations.length;
      return `
      <section class="cover" style="padding:22px 18px">
        <div class="t1" style="font-size:30px">HỘ CHIẾU SỐ</div>
        <div class="t3" style="margin-top:6px">${esc(S.name || 'Chưa điền tên')} · Lớp ${esc(S.cls || '…')}${S.group ? ' · Nhóm ' + esc(S.group) : ''}</div>
      </section>
      <section class="card passport-page">
        <div class="row" style="justify-content:space-between"><h2>Trang thị thực</h2><span class="pill" style="background:var(--navy);color:var(--gold-2)">${doneCount()}/${D.stations.length} dấu</span></div>
        <div class="stamps" style="margin-top:14px">${D.stations.map((s, i) => done(s.id)
          ? `<button class="slot filled" data-nav="${s.id}" style="background:none;cursor:pointer;transform:rotate(${(i % 3) * 6 - 6}deg)">${stampSVG(s, S.stamps[s.id])}</button>`
          : `<button class="slot" data-nav="${s.id}" style="background:none;cursor:pointer">${s.emoji}<br>${esc(s.no)}</button>`).join('')}</div>
      </section>
      <section class="card">
        <div class="label">Toàn bộ bài làm</div>
        <div class="ticket full">${esc(fullText())}</div>
        ${done('exit') ? finalBox() : '<p class="small muted" style="margin-top:10px">Nút nộp bài lên Padlet sẽ hiện khi em hoàn thành chặng <b>Về đích</b>.</p>'}
      </section>
      <section class="card">
        <h3>🏠 Nhiệm vụ vận dụng (về nhà)</h3>
        <p style="margin:8px 0">Tạo <b>"Bộ tài nguyên tự học"</b> cho một môn em thấy khó:</p>
        <ol class="steps">
          <li>Tìm <b>3 học liệu mở</b> ở ít nhất 2 kho khác nhau, mỗi học liệu ghi: tên, link, trang/kho, giấy phép, điều em học được.</li>
          <li>Chọn 1 đoạn tài liệu tiếng nước ngoài trong số đó (hoặc một tệp của em), dịch bằng thẻ <b>Tài liệu</b> hoặc <b>Dịch trang</b>, rồi ghi lại <b>3 chỗ</b> em thấy bản dịch chưa sát nghĩa.</li>
          <li>Đăng bài mới lên Padlet, tiêu đề ghi <b>Vận dụng – Họ tên – Lớp</b>.</li>
        </ol>
        ${padlet() ? `<a class="btn" href="${esc(padlet())}" target="_blank" rel="noopener">Mở Padlet ↗</a>` : ''}
      </section>
      <div class="nextbar"><button class="btn ghost" data-nav="home">← Bản đồ</button><button class="btn ghost" id="reset">🗑 Xoá dữ liệu trên máy này</button></div>`;
    },
    bind() {
      bindFinal();
      $('#reset').onclick = () => { if (confirm('Xoá toàn bộ hộ chiếu trên máy này? (dùng khi bạn khác dùng lại máy)')) { S = fresh(); save(); location.hash = '#/home'; render(); } };
    },
  };

  render();
})();
