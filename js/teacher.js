/* MisiKelas AI — Papan Pemuka Guru (juga dilihat oleh Pentadbir dan Juri) */
window.MK = window.MK || {};
(function () {
const E = s => MK.esc(s);
const W = () => MK.auth.canWrite() ? "" : ' disabled title="Akaun pemerhati: baca sahaja"';

MK.teacher = {
  tabs: [
    ["papan", "Papan Pemuka", "▦"],
    ["jana", "Jana Misi", "✦"],
    ["lulus", "Kelulusan", "✓"],
    ["langsung", "Kelas Langsung", "◉"],
    ["kumpulan", "Kumpulan", "◎"],
    ["analitik", "Analitik", "▥"],
    ["laporan", "Laporan", "⇩"]
  ],

  render(tab, arg) {
    tab = tab || "papan";
    MK.syncMisc();
    const pending = MK.store.missions().filter(m => m.status === "pending").length;
    const navTab = tab === "pelajar" ? "analitik" : tab;
    const nav = this.tabs.map(([k, label, ic]) => `<a href="#/guru/${k}" class="${k === navTab ? "active" : ""}"><span class="nav-ic">${ic}</span><span class="nav-lb">${label}</span>${k === "lulus" && pending ? `<b class="badge">${pending}</b>` : ""}</a>`).join("");
    const ro = MK.auth.role() === "juri" ? `<div class="card note ro">👁 Anda log masuk sebagai <b>Juri / Pemerhati</b>: semua paparan boleh dilihat, tetapi butang yang mengubah data dinyahaktifkan.</div>` : "";
    return `<div class="t-layout">
      <nav class="t-nav" aria-label="Menu guru">${nav}</nav>
      <section class="t-main" id="t-main">${ro}${this["v_" + tab] ? this["v_" + tab](arg) : ""}</section>
    </div>`;
  },
  after(tab, arg) { const f = this["a_" + (tab || "papan")]; f && f.call(this, arg); },
  kpi(label, val, sub) { return `<div class="kpi"><span>${label}</span><b>${val}</b><small>${sub}</small></div>`; },
  sLink(st) { return `<a class="slink" href="#/guru/pelajar/${encodeURIComponent(st.id)}">${E(st.name)}</a>`; },

  /* ---------------- Papan Pemuka ---------------- */
  v_papan() {
    const A = MK.analytics();
    const ms = MK.store.missions();
    const top = A.misc[0];
    const log = MK.store.log().slice(-8).reverse();
    const risk = A.students.map(s => MK.studentProfile(s.id, A)).filter(p => p.risk).sort((a, b) => a.avgMastery - b.avgMastery);
    const u = MK.auth.user();
    return `<header class="page-head"><div><h1>Selamat datang, ${E(u ? u.name : "Cikgu")}</h1><p class="muted">Ringkasan kelas ${E(MK.CLASS_CODE)} dan aktiviti ejen AI.</p></div>
      <a class="btn primary" href="#/guru/jana">✦ Jana Misi Baharu</a></header>
      <div class="kpis">
        ${this.kpi("Pelajar", A.students.length, "dalam kelas")}
        ${this.kpi("Jawapan", A.answers.length, "direkodkan")}
        ${this.kpi("Kadar betul", A.correctRate + "%", "purata kelas")}
        ${this.kpi("Pelajar berisiko", risk.length, "perlu perhatian")}
      </div>
      <div class="grid-2">
        <div class="card"><h2>Penguasaan mengikut kemahiran</h2>
          ${A.skillAvg.filter(s => A.usedSkills.includes(s) || A.usedSkills.some(x => x.id === s.id)).map(s => `<div class="bar-row"><span>${E(s.name)}</span><div class="bar"><i style="width:${s.avg}%;--h:${s.avg * 1.2}"></i></div><b>${s.avg}%</b></div>`).join("")}
          <p class="muted small">Bar: purata Elo. Bilangan pelajar yang menguasai (BKT ≥ 95%) dipaparkan di tab Analitik.</p>
        </div>
        <div class="card"><h2>⚠ Pelajar berisiko (${risk.length})</h2>
          ${risk.length ? `<ul class="risk">${risk.slice(0, 6).map(p => `<li>${this.sLink(p.st)}<span class="muted small">${E(p.reasons.join(" · "))}</span></li>`).join("")}</ul>${risk.length > 6 ? `<p class="muted small">+${risk.length - 6} lagi di tab Kumpulan.</p>` : ""}`
          : `<p class="muted">Tiada pelajar berisiko dikesan.</p>`}
        </div>
      </div>
      <div class="grid-2">
        ${top ? `<div class="card alert"><h2>Miskonsepsi utama</h2><p><b>${E(top.name)}</b>: dikesan pada ${top.students.length} pelajar (${top.count} jawapan).</p>
          <a class="btn" href="#/guru/analitik">Lihat analitik →</a></div>` : "<div></div>"}
        <div class="card"><h2>Aktiviti ejen AI</h2>
          <ul class="log">${log.map(l => `<li><b>${E(l.agent)}</b><span>${E(l.msg)}</span><time>${MK.timeAgo(l.ts)}</time></li>`).join("")}</ul>
        </div>
      </div>
      <p class="muted small">Misi aktif: ${ms.filter(m => m.status === "approved").length} · Menunggu kelulusan: ${ms.filter(m => m.status === "pending").length}</p>`;
  },

  /* ---------------- Jana Misi ---------------- */
  v_jana() {
    const s = MK.settings.load();
    return `<header class="page-head"><div><h1>Jana Misi dengan Ejen AI</h1>
      <p class="muted">Masukkan topik atau nota. Ejen Perancang dan Ejen Pereka Permainan akan membina misi, kemudian anda meluluskannya.</p></div></header>
      ${s.provider === "demo" ? `<div class="card note">ℹ <b>Mod Demo</b> sedang aktif: misi dibina daripada bank soalan terbina dalam (topik Asas AI). Untuk menjana daripada nota anda sendiri, masukkan kunci API di <a href="#" data-open-settings>Tetapan</a>.</div>` : ""}
      <form class="card form" id="genForm">
        <label>Topik pelajaran<input name="topic" required placeholder="Contoh: Asas Kecerdasan Buatan" value="Asas Kecerdasan Buatan"></label>
        <label>Tahap pelajar<select name="level"><option>Sekolah rendah</option><option selected>Sekolah menengah</option><option>IPT (prasiswazah)</option></select></label>
        <label>Nota guru (pilihan)<textarea name="notes" rows="6" placeholder="Tampal nota pelajaran di sini..."></textarea></label>
        <label class="file">Atau muat naik fail teks (.txt, .md)<input type="file" name="file" accept=".txt,.md,text/plain"></label>
        <button class="btn primary big" type="submit"${W()}>✦ Jalankan Ejen AI</button>
      </form>
      <div class="card pipeline" id="pipeline" hidden>
        <h2>Kitaran agentik</h2>
        <ol class="steps">
          <li data-step="Perancang"><b>1. Ejen Perancang</b><span>Menunggu...</span></li>
          <li data-step="Pereka Permainan"><b>2. Ejen Pereka Permainan</b><span>Menunggu...</span></li>
          <li data-step="Guru"><b>3. Kelulusan Guru</b><span>Menunggu draf...</span></li>
        </ol>
      </div>`;
  },
  a_jana() {
    const f = document.getElementById("genForm");
    f.file.onchange = async () => { const file = f.file.files[0]; if (file) f.notes.value = (await file.text()).slice(0, 20000); };
    f.onsubmit = async e => {
      e.preventDefault();
      if (!MK.auth.canWrite()) return;
      const btn = f.querySelector("button"); btn.disabled = true; btn.textContent = "Ejen sedang bekerja...";
      const pipe = document.getElementById("pipeline"); pipe.hidden = false; pipe.classList.add("working-box");
      const step = (name, msg, done) => {
        const li = pipe.querySelector(`[data-step="${name}"]`);
        if (li) { li.querySelector("span").textContent = msg; li.className = done ? "done" : "active"; }
      };
      try {
        const topic = f.topic.value, level = f.level.value, notes = f.notes.value;
        const plan = await MK.agents.planner(topic, notes, level, (n, m) => step(n, m));
        step("Perancang", "Pelan siap: \"" + plan.title + "\"", true);
        const design = await MK.agents.designer(plan, notes, level, (n, m) => step(n, m));
        step("Pereka Permainan", design.questionIds.length + " soalan sedia.", true);
        const id = "M" + MK.uid();
        const skills = plan.demo ? undefined : plan.skills.map(s => ({ id: id + "-" + s.id, name: s.name }));
        const misconceptions = plan.demo ? undefined : (plan.misconceptions || []).map(m => ({ id: id + "-" + m.id, name: m.name, fix: m.fix }));
        const questions = design.questions.map(q => ({ ...q, s: id + "-" + q.s, m: Object.fromEntries(Object.entries(q.m || {}).map(([k, v]) => [k, id + "-" + v])) }));
        const levels = plan.levels.map(l => ({ ...l, skills: plan.demo ? l.skills : (l.skills || []).map(s => id + "-" + s) }));
        MK.store.saveMission({ id, title: plan.title, topic, level, outcomes: plan.outcomes, levels, skills, misconceptions, questionIds: design.questionIds, questions, length: Math.min(10, design.questionIds.length), status: "pending", type: "utama", createdBy: "Ejen Perancang + Pereka", createdAt: Date.now() });
        step("Guru", "Draf sedia untuk disemak.", false);
        pipe.classList.remove("working-box");
        MK.toast("Draf misi siap. Sila semak dan luluskan.");
        setTimeout(() => location.hash = "#/guru/lulus", 900);
      } catch (err) {
        console.error(err);
        pipe.classList.remove("working-box");
        MK.toast("Ralat ejen: " + err.message);
        btn.disabled = false; btn.textContent = "✦ Jalankan Ejen AI";
      }
    };
  },

  /* ---------------- Kelulusan ---------------- */
  v_lulus() {
    const ms = MK.store.missions().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const pend = ms.filter(m => m.status === "pending"), appr = ms.filter(m => m.status === "approved");
    const bank = MK.store.questionBank();
    const card = (m, pending) => {
      const qs = m.questionIds.map(id => bank.find(q => q.id === id)).filter(Boolean);
      return `<article class="card mission ${pending ? "pending" : ""}">
        <div class="m-head"><span class="tag ${m.type === "pemulihan" ? "warn" : ""}">${m.type === "pemulihan" ? "Misi pemulihan" : "Misi utama"}</span><small class="muted">oleh ${E(m.createdBy || "Guru")}</small></div>
        <h2>${E(m.title)}</h2>
        ${m.target && m.target.length ? `<p class="muted">Sasaran: ${m.target.length} pelajar${m.groupLabel ? " (kumpulan \"" + E(m.groupLabel) + "\")" : ""}.</p>` : ""}
        <details><summary>Hasil pembelajaran &amp; peringkat (${m.levels.length})</summary>
          <ul>${(m.outcomes || []).map(o => `<li>${E(o)}</li>`).join("")}</ul>
          ${m.levels.map(l => `<p><b>${E(l.name)}</b><br><span class="muted">${E(l.story)}</span></p>`).join("")}
        </details>
        <details><summary>Soalan (${qs.length})</summary>
          <ol class="qlist">${qs.map(q => `<li>${E(q.q)}<br><small class="ok">✓ ${E(q.o[q.a])}</small></li>`).join("")}</ol>
        </details>
        <div class="row">
          ${pending ? `<button class="btn primary" data-approve="${m.id}"${W()}>✓ Luluskan</button><button class="btn danger" data-reject="${m.id}"${W()}>✕ Tolak</button>`
          : `<a class="btn primary" href="#/guru/langsung/${m.id}">◉ Lancar di kelas</a>${m.id !== "DEMO" ? `<button class="btn ghost" data-reject="${m.id}"${W()}>Padam</button>` : ""}`}
        </div></article>`;
    };
    return `<header class="page-head"><div><h1>Panel Kelulusan</h1><p class="muted">Tiada kandungan AI sampai kepada pelajar tanpa kelulusan guru (prinsip manusia dalam gelung).</p></div></header>
      <h3 class="sec">Menunggu kelulusan (${pend.length})</h3>
      ${pend.length ? pend.map(m => card(m, true)).join("") : `<p class="muted empty">Tiada draf menunggu. <a href="#/guru/jana">Jana misi baharu</a>.</p>`}
      <h3 class="sec">Misi diluluskan (${appr.length})</h3>${appr.map(m => card(m, false)).join("")}`;
  },
  a_lulus() {
    document.querySelectorAll("[data-approve]").forEach(b => b.onclick = () => {
      const m = MK.store.missions().find(x => x.id === b.dataset.approve);
      m.status = "approved"; m.approvedAt = Date.now();
      MK.store.saveMission(m);
      MK.store.addLog(MK.auth.user().name, "Meluluskan misi \"" + m.title + "\"");
      MK.toast("Misi diluluskan dan sedia dilancarkan.");
      MK.route();
    });
    document.querySelectorAll("[data-reject]").forEach(b => b.onclick = () => {
      if (!confirm("Padam misi ini?")) return;
      const m = MK.store.missions().find(x => x.id === b.dataset.reject);
      MK.store.deleteMission(b.dataset.reject);
      MK.store.addLog(MK.auth.user().name, "Menolak/memadam misi \"" + (m ? m.title : "") + "\"");
      MK.route();
    });
  },

  /* ---------------- Kelas Langsung ---------------- */
  v_langsung(mid) {
    const appr = MK.store.missions().filter(m => m.status === "approved");
    const m = appr.find(x => x.id === mid) || appr[0];
    if (!m) return `<p class="empty">Tiada misi diluluskan.</p>`;
    const url = location.href.split("#")[0] + "#/sertai/" + m.id;
    const board = {};
    MK.store.answers().filter(a => a.session === m.id).forEach(a => { const b = board[a.sid] = board[a.sid] || { id: a.sid, name: a.name, xp: 0, n: 0, ok: 0 }; b.n++; if (a.correct) { b.ok++; b.xp += 10; } });
    const rows = Object.values(board).sort((a, b) => b.xp - a.xp);
    return `<header class="page-head"><div><h1>Kelas Langsung</h1><p class="muted">Pelajar imbas kod QR, log masuk dengan kod kelas <b>${E(MK.CLASS_CODE)}</b>, dan terus ke misi.</p></div>
      <div class="row"><select id="missionSel">${appr.map(x => `<option value="${x.id}" ${x.id === m.id ? "selected" : ""}>${E(x.title)}</option>`).join("")}</select>
      <button class="btn" id="projBtn">⛶ Mod projektor</button></div></header>
      <div class="live">
        <div class="card qr-card"><h2>${E(m.title)}</h2><div id="qr" class="qr"></div>
          <p class="code">Kod kelas: <b>${E(MK.CLASS_CODE)}</b></p><p class="muted small break">${E(url)}</p>
          <button class="btn ghost small" id="copyLink">Salin pautan</button>
          ${!MK.store.fb ? `<p class="note small">ℹ Tanpa Firebase, papan markah dikemas kini untuk tab pada peranti yang sama sahaja. Untuk berbilang telefon, lihat README Bahagian 6.</p>` : `<p class="ok small">● Mod berbilang peranti aktif</p>`}
        </div>
        <div class="card"><h2>Papan markah langsung <span class="pulse"></span></h2>
          ${rows.length ? `<ol class="board">${rows.map((r, i) => `<li><span class="rank">${i + 1}</span><span class="nm">${this.sLink(r)}</span><span class="muted">${r.ok}/${r.n}</span><b>${r.xp} XP</b></li>`).join("")}</ol>`
          : `<p class="muted empty">Menunggu pelajar menyertai...<br><br>Tip demo: buka pautan di atas dalam tab baharu dan log masuk sebagai pelajar (contoh Harimau01, PIN 1111).</p>`}
        </div>
      </div>`;
  },
  a_langsung() {
    const sel = document.getElementById("missionSel");
    if (!sel) return;
    sel.onchange = () => location.hash = "#/guru/langsung/" + sel.value;
    const url = location.href.split("#")[0] + "#/sertai/" + sel.value;
    const qr = document.getElementById("qr");
    if (window.QRCode) new QRCode(qr, { text: url, width: 220, height: 220, correctLevel: QRCode.CorrectLevel.M });
    else qr.innerHTML = `<p class="muted">Kod QR memerlukan internet. Gunakan kod kelas.</p>`;
    document.getElementById("copyLink").onclick = () => { navigator.clipboard && navigator.clipboard.writeText(url); MK.toast("Pautan disalin"); };
    document.onfullscreenchange = () => { if (!document.fullscreenElement) document.body.classList.remove("projector"); };
    document.getElementById("projBtn").onclick = () => {
      document.body.classList.toggle("projector");
      const el = document.documentElement;
      if (document.body.classList.contains("projector") && el.requestFullscreen) el.requestFullscreen().catch(() => {});
      else if (document.fullscreenElement) document.exitFullscreen();
    };
  },

  /* ---------------- Kumpulan (K-means) ---------------- */
  v_kumpulan() {
    const A = MK.analytics();
    const G = MK.groups(A, 4);
    this._groups = G;
    const risk = A.students.map(s => MK.studentProfile(s.id, A)).filter(p => p.risk);
    return `<header class="page-head"><div><h1>Kumpulan Pelajar</h1>
      <p class="muted">Kumpulan dibentuk secara automatik oleh algoritma <b>K-means</b> berdasarkan profil penguasaan kemahiran setiap pelajar.</p></div></header>
      <div class="groups">${G.map((g, i) => `<article class="card group">
        <div class="g-head"><span class="g-num">${i + 1}</span><div><h2>${E(g.label)}</h2><p class="muted small">${g.members.length} pelajar · purata penguasaan ${g.overall}%</p></div></div>
        ${A.usedSkills.map((s, j) => `<div class="bar-row"><span>${E(s.name)}</span><div class="bar"><i style="width:${g.avg[j]}%;--h:${g.avg[j] * 1.2}"></i></div><b>${g.avg[j]}%</b></div>`).join("")}
        ${g.topMisc.length ? `<p class="small"><b>Miskonsepsi kumpulan:</b> ${g.topMisc.map(m => E(m.name)).join("; ")}</p>` : ""}
        <div class="chips">${g.members.map(m => `<a class="chip ${risk.some(r => r.st.id === m.id) ? "risk" : ""}" href="#/guru/pelajar/${encodeURIComponent(m.id)}">${E(m.name)}</a>`).join("")}</div>
        ${g.overall < 72 ? `<button class="btn" data-group="${i}"${W()}>✦ Jana misi pemulihan untuk kumpulan ini</button>` : `<p class="ok small">✓ Kumpulan ini boleh diberi misi lanjutan.</p>`}
        <p class="small g-out" id="gout${i}"></p>
      </article>`).join("")}</div>
      <p class="muted small">Nama bertanda merah ialah pelajar berisiko. Klik nama untuk melihat profil individu.</p>`;
  },
  a_kumpulan() {
    document.querySelectorAll("[data-group]").forEach(b => b.onclick = async () => {
      const g = this._groups[+b.dataset.group];
      const out = document.getElementById("gout" + b.dataset.group);
      b.disabled = true; out.innerHTML = `<span class="working">Ejen Penyesuai sedang menyediakan misi...</span>`;
      try {
        const top = g.topMisc.map(m => ({ ...m, students: g.members.map(x => x.id) }));
        const m = await MK.agents.adapter({ top, weak: g.weakSkill, targetStudents: g.members.map(x => x.id), groupLabel: g.label });
        out.innerHTML = `✓ "${E(m.title)}" dihantar ke <a href="#/guru/lulus">Panel Kelulusan</a>.`;
      } catch (e) { out.innerHTML = `<span class="err">Ralat: ${E(e.message)}</span>`; b.disabled = false; }
    });
  },

  /* ---------------- Profil individu ---------------- */
  v_pelajar(sid) {
    sid = decodeURIComponent(sid || "");
    const P = MK.studentProfile(sid);
    if (!P.ans.length && !P.st.pin) return `<p class="empty">Pelajar tidak ditemui. <a href="#/guru/analitik">Kembali</a></p>`;
    const recs = [];
    P.weakest.slice(0, 2).forEach(s => recs.push(`Beri latihan tambahan dalam <b>${E(s.name)}</b> (BKT ${Math.round((s.pL || 0) * 100)}%).`));
    P.miscList.slice(0, 2).forEach(m => recs.push(E(m.fix || "Bincang semula konsep: " + m.name)));
    if (!recs.length) recs.push("Pelajar menguasai kebanyakan kemahiran. Beri cabaran lanjutan.");
    const hist = P.ans.slice(-12).reverse();
    const bank = MK.store.questionBank();
    return `<header class="page-head"><div><a href="#/guru/analitik" class="muted small">← Analitik</a><h1>${E(P.st.name)}</h1>
      <p class="muted">ID ${E(P.st.id)} ${P.st.group ? "· Kumpulan profil " + E(P.st.group) : ""} ${P.risk ? '· <span class="tag danger">Berisiko</span>' : ""}</p></div>
      ${P.st.pin ? `<button class="btn ghost" id="resetPin"${W()}>🔑 Tetapkan semula PIN</button>` : ""}</header>
      <div class="kpis">
        ${this.kpi("Jawapan", P.ans.length, "jumlah")}
        ${this.kpi("Kadar betul", P.correctRate + "%", "keseluruhan")}
        ${this.kpi("10 terakhir", P.recentRate + "%", "kadar betul")}
        ${this.kpi("Masa respons", P.avgSec + " s", "purata")}
      </div>
      <div class="grid-2">
        <div class="card center"><h2>Radar penguasaan (Elo)</h2>${MK.radar(P.skills.map(s => s.name), P.skills.map(s => s.mastery))}</div>
        <div class="card"><h2>Status knowledge tracing (BKT)</h2>
          <table class="mini full"><tr><th>Kemahiran</th><th>P(kuasai)</th><th>Status</th></tr>
          ${P.skills.map(s => `<tr><td>${E(s.name)}</td><td>${s.pL === undefined ? "–" : Math.round(s.pL * 100) + "%"}</td><td><span class="st st-${s.status.key}">${s.status.label}</span></td></tr>`).join("")}</table>
          <p class="muted small">Ambang kuasai: P(kuasai) ≥ 95%.</p></div>
      </div>
      <div class="grid-2">
        <div class="card"><h2>Cadangan intervensi</h2><ul>${recs.map(r => `<li>${r}</li>`).join("")}</ul>
          ${P.reasons.length ? `<p class="small err">Petunjuk risiko: ${E(P.reasons.join(" · "))}</p>` : ""}</div>
        <div class="card"><h2>Miskonsepsi peribadi</h2>${P.miscList.length ? `<ul>${P.miscList.map(m => `<li>${E(m.name)} <span class="muted">(${m.n} kali)</span></li>`).join("")}</ul>` : `<p class="muted">Tiada.</p>`}</div>
      </div>
      <div class="card"><h2>Sejarah jawapan terkini</h2>
        <ul class="reflect">${hist.map(a => { const q = bank.find(x => x.id === a.qid); return `<li class="${a.correct ? "ok" : "no"}">${a.correct ? "✓" : "✕"} ${E(q ? q.q : a.qid)} <small class="muted">· ${(a.ms / 1000).toFixed(0)} s · ${MK.timeAgo(a.ts)}</small></li>`; }).join("")}</ul></div>`;
  },
  a_pelajar(sid) {
    const b = document.getElementById("resetPin");
    if (b) b.onclick = () => {
      sid = decodeURIComponent(sid);
      const st = MK.store.roster().find(s => s.id === sid);
      if (!st || !confirm("Tetapkan semula PIN untuk " + st.name + "?")) return;
      st.pin = String(1000 + Math.floor(Math.random() * 9000));
      MK.store.saveStudent(st);
      alert("PIN baharu untuk " + st.name + ": " + st.pin);
    };
  },

  /* ---------------- Analitik ---------------- */
  v_analitik() {
    const A = MK.analytics();
    const skills = A.usedSkills;
    const cell = (v, p) => `<td style="--m:${v}" title="Elo ${v}% · BKT ${p === undefined ? "-" : Math.round(p * 100) + "%"}">${v}${p !== undefined && p >= MK.bkt.MASTERY ? "★" : ""}</td>`;
    return `<header class="page-head"><div><h1>Analitik Kelas</h1><p class="muted">Peta penguasaan dikira dengan Elo; ★ menandakan kemahiran dikuasai menurut BKT (≥ 95%). Klik nama pelajar untuk profil individu.</p></div>
      <button class="btn primary" id="runAnalyst">▥ Jalankan Ejen Penganalisis</button></header>
      <div class="card" id="analystOut" hidden></div>
      <div class="card"><h2>Penguasaan kelas (BKT)</h2>
        ${A.skillAvg.filter(s => skills.some(x => x.id === s.id)).map(s => `<div class="bar-row"><span>${E(s.name)}</span><div class="bar"><i style="width:${Math.round(100 * s.mastered / (A.students.length || 1))}%;--h:200"></i></div><b>${s.mastered}/${A.students.length}</b></div>`).join("")}
        <p class="muted small">Bilangan pelajar yang telah menguasai setiap kemahiran.</p></div>
      <div class="card"><h2>Peta haba penguasaan (pelajar × kemahiran)</h2>
        <div class="heat-wrap"><table class="heat"><thead><tr><th>Pelajar</th>${skills.map(s => `<th>${E(s.name)}</th>`).join("")}</tr></thead>
        <tbody>${A.students.map(st => `<tr><th>${this.sLink(st)}</th>${skills.map(s => cell(MK.elo.mastery((A.theta[st.id] || {})[s.id]), (A.pL[st.id] || {})[s.id])).join("")}</tr>`).join("")}</tbody></table></div>
        <p class="legend"><span style="--m:20"></span> Lemah <span style="--m:50"></span> Sederhana <span style="--m:85"></span> Kuasai</p>
      </div>
      <div class="card"><h2>Miskonsepsi dikesan</h2>
        ${A.misc.length ? A.misc.map(m => `<div class="misc"><div class="misc-head"><b>${E(m.name)}</b><span class="tag warn">${m.students.length} pelajar · ${m.count} kali</span></div>
          ${m.example ? `<p class="muted small">Contoh: “${E(m.example.q)}” → pelajar memilih “${E(m.example.chosen)}”</p>` : ""}
          <p class="small">💡 ${E(m.fix || "")}</p></div>`).join("") : `<p class="muted">Belum ada data.</p>`}
      </div>`;
  },
  a_analitik() {
    const btn = document.getElementById("runAnalyst"), out = document.getElementById("analystOut");
    btn.onclick = async () => {
      btn.disabled = true; out.hidden = false;
      out.innerHTML = `<p class="working">Ejen Penganalisis sedang menganalisis corak jawapan...</p>`;
      try {
        const r = await MK.agents.analyst();
        out.innerHTML = `<h2>Dapatan Ejen Penganalisis</h2><p>${E(r.summary)}</p>
          <h3>Cadangan tindakan</h3><ul>${(r.actions || []).map(a => `<li>${E(a)}</li>`).join("")}</ul>
          <div class="row"><button class="btn primary" id="runAdapter"${W()}>✦ Minta Ejen Penyesuai jana misi pemulihan</button></div><div id="adOut"></div>`;
        document.getElementById("runAdapter").onclick = async ev => {
          ev.target.disabled = true;
          document.getElementById("adOut").innerHTML = `<p class="working">Ejen Penyesuai sedang menyediakan misi pemulihan...</p>`;
          try {
            const m = await MK.agents.adapter(r);
            document.getElementById("adOut").innerHTML = `<p class="ok">✓ "${E(m.title)}" dihantar ke <a href="#/guru/lulus">Panel Kelulusan</a> untuk semakan guru.</p>`;
          } catch (e) { document.getElementById("adOut").innerHTML = `<p class="err">Ralat: ${E(e.message)}</p>`; }
        };
      } catch (e) { out.innerHTML = `<p class="err">Ralat: ${E(e.message)}</p>`; }
      btn.disabled = false;
    };
  },

  /* ---------------- Laporan ---------------- */
  v_laporan() {
    const A = MK.analytics();
    return `<header class="page-head"><div><h1>Laporan</h1><p class="muted">Eksport data kelas untuk rekod atau analisis lanjut.</p></div></header>
      <div class="grid-2">
        <div class="card"><h2>Laporan pelajar</h2><p class="muted">Penguasaan Elo dan BKT setiap pelajar mengikut kemahiran (CSV).</p><button class="btn primary" id="expStudents">⇩ Muat turun CSV</button></div>
        <div class="card"><h2>Rekod jawapan</h2><p class="muted">${A.answers.length} rekod jawapan termasuk masa respons dan miskonsepsi (CSV).</p><button class="btn primary" id="expAnswers">⇩ Muat turun CSV</button></div>
        <div class="card"><h2>Laporan kumpulan</h2><p class="muted">Keahlian kumpulan K-means dan purata penguasaan (CSV).</p><button class="btn primary" id="expGroups">⇩ Muat turun CSV</button></div>
        <div class="card"><h2>Cetak laporan</h2><p class="muted">Cetak atau simpan sebagai PDF melalui pelayar.</p><button class="btn" onclick="print()">⎙ Cetak / PDF</button></div>
      </div>`;
  },
  a_laporan() {
    const dl = (name, rows) => {
      const csv = rows.map(r => r.map(v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`).join(",")).join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
      a.download = name; a.click();
    };
    document.getElementById("expStudents").onclick = () => {
      const A = MK.analytics(), sk = A.usedSkills;
      dl("laporan_pelajar.csv", [["ID", "Nama samaran", ...sk.map(s => s.name + " Elo (%)"), ...sk.map(s => s.name + " BKT (%)")],
        ...A.students.map(st => [st.id, st.name, ...sk.map(s => MK.elo.mastery((A.theta[st.id] || {})[s.id])), ...sk.map(s => { const p = (A.pL[st.id] || {})[s.id]; return p === undefined ? "" : Math.round(p * 100); })])]);
    };
    document.getElementById("expAnswers").onclick = () => {
      const A = MK.analytics();
      dl("rekod_jawapan.csv", [["Masa", "ID pelajar", "Nama", "Soalan", "Kemahiran", "Betul", "Miskonsepsi", "Masa respons (s)", "Sesi", "Simulasi"],
        ...A.answers.map(a => [new Date(a.ts).toISOString(), a.sid, a.name, a.qid, a.skill, a.correct ? 1 : 0, a.misc ? (MK.MISCONCEPTIONS[a.misc] || {}).name : "", (a.ms / 1000).toFixed(1), a.session, a.demo ? 1 : 0])]);
    };
    document.getElementById("expGroups").onclick = () => {
      const A = MK.analytics(), G = MK.groups(A, 4);
      dl("laporan_kumpulan.csv", [["Kumpulan", "Label", "ID pelajar", "Nama", "Purata kumpulan (%)"], ...G.flatMap((g, i) => g.members.map(m => [i + 1, g.label, m.id, m.name, g.overall]))]);
    };
  }
};
})();
