// ============================================================
// HỘ CHIẾU SỐ – trang giáo viên: chuẩn bị Padlet + QR, trình chiếu, đáp án, đánh giá.
// ============================================================
(function () {
  const CFG = window.B10_CONFIG || {};
  const D = window.B10, A = window.B10_ANSWERS;
  const COLS = CFG.padletColumns || {};
  const PKEY = 'b10_padlet_teacher';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ABCD = 'ABCD';
  const ST = Object.fromEntries(D.stations.map((s) => [s.id, s]));
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* bỏ qua */ } } };
  function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 2200); }

  const padlet = () => store.get(PKEY) || CFG.padletUrl || '';
  const base = () => CFG.studentUrl || location.href.replace(/[?#].*$/, '').replace(/teacher\.html$/, 'index.html');
  const studentLink = () => (padlet() ? `${base()}?padlet=${encodeURIComponent(padlet())}` : base());

  // ---------- đồng hồ ----------
  let total = 0, left = 0, tid = null;
  const clock = $('#clock');
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  function beep() { try { const c = new (window.AudioContext || window.webkitAudioContext)(); [0, .35, .7].forEach((t) => { const o = c.createOscillator(), g = c.createGain(); o.frequency.value = 880; o.connect(g); g.connect(c.destination); g.gain.setValueAtTime(.25, c.currentTime + t); g.gain.exponentialRampToValueAtTime(.001, c.currentTime + t + .3); o.start(c.currentTime + t); o.stop(c.currentTime + t + .3); }); } catch (e) { /* không có âm thanh */ } }
  function paint() { clock.textContent = fmt(left); clock.classList.toggle('run', !!tid); clock.classList.toggle('end', total > 0 && left === 0); $('#tToggle').textContent = tid ? '⏸' : '▶'; }
  function stop() { clearInterval(tid); tid = null; paint(); }
  function start() { if (left <= 0) return; clearInterval(tid); tid = setInterval(() => { left = Math.max(0, left - 1); if (!left) { stop(); beep(); } paint(); }, 1000); paint(); }
  function setMin(m, auto) { stop(); total = left = m * 60; paint(); if (auto) start(); }
  $$('[data-min]').forEach((b) => b.onclick = () => setMin(+b.dataset.min, true));
  $('#tToggle').onclick = () => (tid ? stop() : start());
  $('#tReset').onclick = () => { left = total; stop(); };
  $('#tPlus').onclick = () => { left += 60; total = Math.max(total, left); paint(); };
  $('#tMinus').onclick = () => { left = Math.max(0, left - 60); paint(); };
  paint();

  // ---------- QR ----------
  function qr(el, text, size = 240) {
    if (!el) return;
    if (!text) { el.innerHTML = '<span class="muted small">Chưa có link</span>'; return; }
    if (window.QRCode) { el.innerHTML = ''; new QRCode(el, { text, width: size, height: size, correctLevel: QRCode.CorrectLevel.M }); }
    else el.innerHTML = '<span class="muted small">Không tải được thư viện QR (cần Internet)</span>';
  }
  const reveal = (html) => `<div class="answer reveal-hide" data-reveal title="Bấm để hiện đáp án">${html}</div><p class="small muted no-print" style="margin-top:6px">👆 Bấm vào khung mờ để hiện đáp án</p>`;
  const stHead = (id, extra = '') => { const s = ST[id]; return `<div class="hero" data-emoji="${s.emoji}" style="--c:${s.color}"><div class="meta">${esc(s.no)} · ${esc(s.time)}</div><h1>${s.emoji} ${esc(s.name)}</h1><p>${esc(s.goal)}</p>${extra}</div>`; };

  // ---------- các tab ----------
  const TABS = [
    { id: 'prep', label: '⚙️ Chuẩn bị' },
    { id: 'warm', label: '📷 Khởi động' },
    { id: 'tools', label: '🧰 Trạm 1' },
    { id: 'locks', label: '🔐 Trạm 2' },
    { id: 'desk', label: '✍️ Trạm 3' },
    { id: 'hunt', label: '📚 Trạm 4' },
    { id: 'exit', label: '🏁 Về đích' },
    { id: 'sum', label: '⭐ Chốt kiến thức' },
    { id: 'eval', label: '📝 Đánh giá' },
  ];
  $('#tabs').innerHTML = TABS.map((t) => `<button data-tab="${t.id}">${t.label}</button>`).join('');

  const V = {
    prep: () => `
      <section class="card">
        <h2>1. Dán link Padlet của lớp</h2>
        <p class="muted">Chỉ cần <b>1 Padlet, không cần chia cột</b> (dạng Tường/Lưới đều được). Mỗi học sinh dán bài <b>một lần</b> sau chặng Về đích (đăng mới, tiêu đề ghi "Bài làm trên lớp – Họ tên – Lớp"), và một lần nữa khi nộp Vận dụng ở nhà (tiêu đề "Vận dụng – Họ tên – Lớp"). Mục Chia sẻ → khách truy cập <b>Có thể viết</b>.</p>
        <div class="codebox"><input type="url" id="pIn" placeholder="https://padlet.com/…" value="${esc(padlet())}"><button class="btn gold" id="pSave">Lưu link</button></div>
        <p class="small muted" style="margin-top:8px">Link được nhúng vào mã QR bên dưới. Học sinh quét QR là nút "Nộp Padlet" trên web tự có link. Muốn cố định cho mọi máy, điền vào <code>js/config.js</code>.</p>
      </section>
      <div class="grid2">
        <section class="card qrcol"><h2>📱 Trang học sinh</h2><div class="qrbox" id="qrS"></div><div class="mono" id="lnkS"></div>
          <div class="row"><button class="btn" id="cpS">📋 Sao chép link (gửi Zalo)</button><a class="btn" id="opS" target="_blank" rel="noopener">Mở thử ↗</a></div>
          <p class="small muted" id="fileWarn"></p></section>
        <section class="card qrcol"><h2>📌 Padlet của lớp</h2><div class="qrbox" id="qrP"></div><div class="mono">${esc(padlet() || '(chưa có)')}</div>
          ${padlet() ? `<a class="btn" href="${esc(padlet())}" target="_blank" rel="noopener">Mở Padlet để chiếu ↗</a>` : ''}</section>
      </div>
      <section class="card">
        <h2>2. Kiểm tra trước giờ dạy</h2>
        <ol class="steps">
          <li>Mở thử trang học sinh, đi hết một vòng (hoặc nhờ 1 học sinh làm mẫu).</li>
          <li>Thử 3 ổ khoá của Trạm 2 trên máy phòng máy: tải ảnh, tải tệp Word, mở trang tiếng Nga và dùng "Dịch sang Tiếng Việt" của Chrome/Edge.</li>
          <li>Kiểm tra các kho học liệu hay gặp ở Trạm 4 (Wikipedia, Commons, Hoclieu.vn, Hành trang số, Học liệu số NXBGD) truy cập được từ mạng của trường.</li>
          <li>Nếu muốn, thêm ảnh minh hoạ Trạm 1 vào thư mục <code>assets/tram1/</code> theo tệp <code>DANH_SACH_ANH.md</code>.</li>
          <li>Cho phép học sinh dùng điện thoại ở phần Khởi động (camera dịch).</li>
        </ol>
      </section>`,

    warm: () => `${stHead('warm')}
      <section class="card proj">
        <p>${esc(D.warm.scenario)}</p>
        <img src="${D.warm.img}" alt="Tấm biển thư viện tiếng Pháp" style="margin:10px auto;border-radius:16px;max-height:56vh;width:auto">
        <h2 style="margin-top:10px">${esc(D.warm.q)}</h2>
        <ol type="A">${D.warm.o.map((o) => `<li>${esc(o)}</li>`).join('')}</ol>
      </section>
      <section class="card">${reveal(`Đáp án: ${ABCD[D.warm.a]}. ${esc(D.warm.o[D.warm.a])}<br><span class="small" style="font-weight:500">${esc(D.warm.e)}</span>`)}</section>
      <section class="card"><h3>Bản dịch tấm biển</h3><table class="t">${D.warm.translation.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</table></section>
      <section class="card tint"><h3>Câu hỏi dẫn dắt</h3><p style="margin:6px 0 0">Ngoài chữ trên biển báo, khi học tập em còn gặp những tài nguyên tiếng nước ngoài nào (tệp, trang web, video)? Google Dịch giúp được gì?</p></section>`,

    tools: () => `${stHead('tools')}
      <section class="card proj"><h2>Google Dịch có những tính năng gì?</h2><p>${esc(D.tools.about)}</p>
      <div class="feats" style="margin-top:10px">${D.tools.features.map((f) => `<div class="feat"><div class="feat-head"><span class="feat-ic">${f.icon}</span><div><h3>${esc(f.name)}</h3><span class="where">${esc(f.where)}</span></div></div><p style="font-size:17px">${esc(f.what)}</p></div>`).join('')}</div></section>
      <section class="card"><h3>Đáp án 7 tình huống</h3><table class="t"><tr><th>#</th><th>Tình huống</th><th>Đáp án</th><th>Cách làm</th></tr>
      ${D.tools.items.map((it, i) => `<tr><td>${i + 1}</td><td>${esc(it.sit)}</td><td><b>${D.tools.options[it.a].icon} ${esc(D.tools.options[it.a].label)}</b></td><td>${esc(it.how)}</td></tr>`).join('')}</table></section>
      <section class="card tint proj"><b>Chốt:</b> chữ trên đồ vật → camera · tệp → tài liệu · trang web → dịch trang · nói chuyện → hội thoại · video → phụ đề tự dịch · chữ lạ không gõ được → viết tay.</section>`,

    locks: () => `${stHead('locks')}
      <div class="grid2">${D.locks.map((l, i) => `<section class="card">
        <div class="label">Ổ khoá ${i + 1} · ${l.flag} ${esc(l.lang)} · ${esc(l.type)}</div>
        ${l.id === 'img' ? `<img src="${l.asset}" alt="" style="border-radius:12px;max-height:280px;margin:6px auto">` : `<p><a class="btn" href="${l.asset}" ${l.download ? `download="${l.download}"` : 'target="_blank" rel="noopener"'}>${l.download ? '⬇️' : '🌐'} ${esc(l.assetLabel)}</a></p>`}
        <ol class="steps small">${l.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
        ${reveal(`${esc(A.locks[l.id].word)}<br><span class="small" style="font-weight:500">${esc(A.locks[l.id].line)}</span>`)}
      </section>`).join('')}</div>
      <p class="small muted">${esc(A.accepted)}</p>`,

    desk: () => `${stHead('desk')}
      <section class="card proj"><h2>Nhiệm vụ</h2><p>Học sinh dùng Google Dịch chuyển lá thư tiếng Việt có sẵn của Minh Anh gửi <b>${esc(D.desk.friend)}</b> sang tiếng Anh, nghe lại và kiểm tra nội dung bản dịch. Không yêu cầu viết thư mới.</p></section>
      <div class="tips" style="margin-bottom:14px">${D.desk.tips.map(([a, b]) => `<div class="tip proj" style="font-size:18px"><b>${esc(a)}</b>${esc(b)}</div>`).join('')}</div>
      <div class="grid2">
        <section class="card"><h3>Lá thư học sinh cần dịch (tiếng Việt)</h3><div class="ticket">${esc(D.desk.sample.vi)}</div></section>
        <section class="card"><h3>Bản tiếng Anh (ví dụ)</h3><div class="ticket">${esc(D.desk.sample.en)}</div><p class="small muted">Kết quả Google Dịch thực tế có thể khác đôi chút.</p></section>
      </div>
      <section class="card tint"><h3>Câu hỏi thảo luận khi chiếu Padlet</h3><ul><li>Bản dịch của Google Dịch có giữ đúng nội dung lá thư tiếng Việt không?</li><li>Có từ nào máy dịch chưa đúng ý không (tên riêng, món ăn, cách xưng hô "mình – bạn")?</li><li>Muốn kiểm tra nhanh bản dịch, em làm gì? (dịch ngược bằng nút ⇄)</li></ul></section>
`,

    hunt: () => `${stHead('hunt')}
      <div class="grid3 proj">${D.oerIntro.map(([t, x]) => `<section class="card tint" style="margin:0"><h3>${esc(t)}</h3><p style="margin:6px 0 0">${esc(x)}</p></section>`).join('')}</div>
      <section class="card proj" style="margin-top:14px"><h3>Quy trình 3 bước (mỗi học sinh)</h3><ol class="steps"><li><b>Chọn một bài học</b> trong 8 bài (GV có thể giao theo tổ).</li><li><b>Tìm trên Google</b> (web điền sẵn từ khoá "… ${esc(D.searchSuffix)}"), chọn một trang học liệu đáng tin và mở ra.</li><li><b>Dán link</b> trang đó và tên trang/kho vào web. Sản phẩm được nộp cùng toàn bài ở chặng Về đích.</li></ol></section>
      <section class="card"><h3>8 bài học</h3><table class="t"><tr><th>#</th><th>Môn</th><th>Bài học</th><th>Từ khoá tìm kiếm</th></tr>${D.topics.map((x) => `<tr><td>${x.no}</td><td>${esc(x.subject)}</td><td>${x.icon} ${esc(x.title)}</td><td>${esc(x.kw)} ${esc(D.searchSuffix)}</td></tr>`).join('')}</table></section>
      <div class="grid2">
        <div class="signs good"><b>✅ Trang đáng tin thường là</b><ul>${D.goodSigns.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="signs bad"><b>⛔ Nên tránh</b><ul>${D.badSigns.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      </div>
      <section class="card tint" style="margin-top:14px"><b>Báo cáo:</b> mời 3–4 bạn tìm được các trang khác nhau chia sẻ nhanh: tìm được trang nào, vì sao tin trang đó, trang có ghi tác giả, nguồn không. Gợi ý các kho tiếng Việt hay gặp: Wikipedia tiếng Việt, Wikimedia Commons, Hoclieu.vn, Hành trang số, Học liệu số (NXBGD).</section>`,

    exit: () => `${stHead('exit')}
      <section class="card"><table class="t"><tr><th>Câu</th><th>Nội dung</th><th>Đáp án</th></tr>
      ${D.exit.map((q, i) => `<tr><td>${i + 1}</td><td>${esc(q.q)}</td><td><b>${ABCD[q.a]}.</b> ${esc(q.o[q.a])}<br><span class="small muted">${esc(q.e)}</span></td></tr>`).join('')}</table></section>`,

    sum: () => `<div class="grid2 proj">
      <section class="card"><h2>🌐 Vượt rào ngôn ngữ</h2><ul>
        <li>Google Dịch có nhiều tính năng: <b>văn bản · giọng nói · máy ảnh · tài liệu · trang web · hội thoại · viết tay</b></li>
        <li>Chọn đúng tính năng cho từng loại tài nguyên</li>
        <li>Viết câu rõ ràng, đúng chính tả, <b>dịch ngược để kiểm tra</b>; dùng 🔊 luyện nghe</li>
        <li>Dịch máy là <b>trợ lí</b>, không nộp nguyên bản dịch máy như bài của mình</li></ul></section>
      <section class="card"><h2>📚 Mở kho tri thức</h2><ul>
        <li><b>Học liệu mở</b>: tài liệu học tập chia sẻ công khai trên Internet, ai cũng dùng được miễn phí</li>
        <li>Tìm trên Google bằng từ khoá + "học liệu mở"; chọn trang đáng tin (.edu.vn, .gov.vn, nhà xuất bản, Wikipedia…)</li>
        <li>Tránh trang nhiều quảng cáo, đòi tải phần mềm lạ hoặc nhập mật khẩu</li>
        <li>Dùng lại học liệu thì <b>luôn ghi nguồn</b></li></ul></section></div>`,

    eval: () => `
      <section class="card"><h2>Cách đánh giá trong bài</h2>
      <p>Học sinh đăng <b>1 bài</b> lên Padlet sau chặng Về đích (tiêu đề "Bài làm trên lớp – Họ tên – Lớp"), gồm: kết quả 6 trạm, lá thư (Việt + Anh), trang học liệu tìm được, câu suy ngẫm. Một tuần sau, đăng thêm <b>1 bài</b> nữa cho Vận dụng (tiêu đề "Vận dụng – Họ tên – Lớp"). Không cần chia cột, lọc theo tên trên Padlet là đủ.</p>
      <table class="t"><tr><th>Minh chứng</th><th>Cách thu</th><th>Đánh giá gì</th></tr>
        <tr><td>Khởi động, Trạm 1, 3 ổ khoá, Về đích</td><td>Web tự chấm, ghi trong bài nộp</td><td>Hiểu tính năng Google Dịch, kĩ năng dịch ảnh/tệp/trang web</td></tr>
        <tr><td>Lá thư (Việt + Anh)</td><td>Trong bài "Bài làm trên lớp" trên Padlet</td><td>Dùng Google Dịch dịch văn bản và kiểm tra bản dịch (rubric bên dưới)</td></tr>
        <tr><td>Trang học liệu tìm được</td><td>Trong bài "Bài làm trên lớp" trên Padlet</td><td>Tìm kiếm, chọn nguồn đáng tin (rubric bên dưới)</td></tr>
        <tr><td>Bộ tài nguyên tự học</td><td>Bài "Vận dụng" trên Padlet</td><td>Vận dụng về nhà (rubric trong KHBD)</td></tr></table></section>
      <div class="grid2">
      <section class="card"><h3>Rubric dịch thư (4 điểm)</h3><table class="t"><tr><th>Tiêu chí</th><th>Điểm</th></tr>
        <tr><td>Dùng đúng lá thư tiếng Việt đã cho</td><td>1</td></tr><tr><td>Bản tiếng Anh có đủ nội dung của thư gốc</td><td>1</td></tr>
        <tr><td>Đã đọc lại, kiểm tra tên riêng và ý chính</td><td>1</td></tr><tr><td>Có nghe thử bản dịch</td><td>1</td></tr></table></section>
      <section class="card"><h3>Rubric trang học liệu (2 điểm)</h3><table class="t"><tr><th>Tiêu chí</th><th>Điểm</th></tr>
        <tr><td>Trang có nội dung đúng bài học đã chọn, link mở được</td><td>1</td></tr><tr><td>Trang đáng tin (đơn vị giáo dục, nhà xuất bản, bách khoa mở…)</td><td>1</td></tr></table></section></div>`,
  };

  function show(id) {
    if (!V[id]) id = 'prep';
    $$('[data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === id)));
    const st = ST[id]; document.documentElement.style.setProperty('--c', st ? st.color : '#14203b');
    $('#tmain').innerHTML = `<div class="view">${V[id]()}</div>`;
    history.replaceState(null, '', '#' + id);
    $$('[data-reveal]').forEach((el) => el.onclick = () => el.classList.toggle('reveal-hide'));
    if (id === 'prep') bindPrep();
  }
  function bindPrep() {
    qr($('#qrS'), studentLink()); $('#lnkS').textContent = studentLink(); $('#opS').href = studentLink();
    qr($('#qrP'), padlet(), 200);
    if (location.protocol === 'file:' && !CFG.studentUrl) $('#fileWarn').textContent = '⚠️ Đang mở từ tệp trên máy: QR chỉ dùng được trên máy này. Hãy đưa thư mục lên GitHub Pages (xem README.md).';
    $('#pSave').onclick = () => {
      const v = $('#pIn').value.trim();
      if (v && !/^https?:\/\//i.test(v)) { toast('Link phải bắt đầu bằng https://'); return; }
      store.set(PKEY, v); toast(v ? 'Đã lưu link Padlet, QR đã cập nhật' : 'Đã xoá link Padlet'); show('prep');
    };
    $('#cpS').onclick = async () => { try { await navigator.clipboard.writeText(studentLink()); toast('Đã sao chép link trang học sinh'); } catch (e) { toast('Hãy bôi đen link rồi Ctrl + C'); } };
  }
  $$('[data-tab]').forEach((b) => b.onclick = () => show(b.dataset.tab));
  show((location.hash || '#prep').slice(1));
})();
