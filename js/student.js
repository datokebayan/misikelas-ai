/* MisiKelas AI — Papan Pemuka & Permainan Pelajar */
window.MK = window.MK || {};
(function () {
  const E = s => MK.esc(s);
  const me = () => MK.auth.user();

  function myStats() {
    const m = me(); if (!m) return null;
    const all = MK.store.answers();
    const ans = all.filter(a => a.sid === m.id);
    const ok = ans.filter(a => a.correct).length;
    const xp = ok * 10 + ans.length * 2;
    let streak = 0, best = 0; ans.forEach(a => { streak = a.correct ? streak + 1 : 0; best = Math.max(best, streak); });
    const P = MK.studentProfile(m.id);
    const th = MK.elo.compute(all, MK.store.questionBank()).theta[m.id] || {};
    const done = new Set(ans.filter(a => a.final).map(a => a.session));
    const badges = [
      { ic: "🌱", n: "Langkah Pertama", ok: ans.length > 0 },
      { ic: "🦌", n: "Kancil Bijak", ok: best >= 3, d: "3 betul berturut-turut" },
      { ic: "🏆", n: "Penakluk Misi", ok: done.size > 0, d: "Tamatkan satu misi" },
      { ic: "🔎", n: "Pemburu Fakta", ok: MK.elo.mastery(th.S3) >= 70, d: "Kuasai AI Generatif" },
      { ic: "⚖", n: "Hakim Adil", ok: MK.elo.mastery(th.S4) >= 70, d: "Kuasai Etika & Bias" },
      { ic: "⭐", n: "Pakar Kemahiran", ok: P.skills.some(s => s.status.key === "mastered"), d: "Kuasai satu kemahiran (BKT)" }
    ];
    // Trend: kadar betul bergerak (5 jawapan)
    const trend = ans.map((_, i) => { const w = ans.slice(Math.max(0, i - 4), i + 1); return Math.round(100 * w.filter(a => a.correct).length / w.length); });
    return { m, ans, ok, xp, level: Math.floor(xp / 100) + 1, best, badges, done, P, trend };
  }

  function sparkline(vals) {
    if (vals.length < 2) return `<p class="muted small">Jawab lebih banyak soalan untuk melihat trend kemajuan.</p>`;
    const v = vals.slice(-30), w = 300, h = 80;
    const pts = v.map((y, i) => [Math.round(i * w / (v.length - 1)), Math.round(h - 6 - y * (h - 12) / 100)]);
    return `<svg viewBox="0 0 ${w} ${h}" class="spark" role="img" aria-label="Trend kadar betul">
      <line x1="0" x2="${w}" y1="${h - 6 - 0.7 * (h - 12)}" y2="${h - 6 - 0.7 * (h - 12)}" class="spark-goal"/>
      <polyline points="${pts.map(p => p.join(",")).join(" ")}" class="spark-line"/>
      <circle cx="${pts[pts.length - 1][0]}" cy="${pts[pts.length - 1][1]}" r="4" class="spark-dot"/></svg>
      <p class="muted small">Kadar betul bergerak (5 jawapan terakhir). Garis putus = sasaran 70%.</p>`;
  }

  /* Misi latihan peribadi: dibina daripada soalan yang telah diluluskan guru, untuk kemahiran belum dikuasai (BKT) */
  function practiceMission() {
    const S = myStats();
    const approved = MK.store.missions().filter(m => m.status === "approved");
    const bank = MK.store.questionBank();
    const ids = new Set(approved.flatMap(m => m.questionIds));
    const weak = S.P.weakest.length ? S.P.weakest.slice(0, 2) : S.P.skills.slice(0, 2);
    const ws = weak.map(s => s.id);
    let pool = bank.filter(q => ids.has(q.id) && ws.includes(q.s));
    if (pool.length < 6) pool = bank.filter(q => ids.has(q.id));
    return {
      id: "LATIHAN", title: "Latihan Peribadi: " + weak.map(s => s.name).join(" & "), type: "latihan", status: "approved",
      levels: [{ name: "Latihan Peribadi", story: "Kancil telah memilih latihan khas untuk anda berdasarkan kemahiran yang belum dikuasai: " + weak.map(s => s.name).join(" dan ") + ". Mari kukuhkan kefahaman!", skills: ws }],
      questionIds: pool.map(q => q.id), length: Math.min(6, pool.length)
    };
  }

  MK.student = {
    /* ---------- Papan pemuka pelajar ---------- */
    v_home() {
      const S = myStats();
      const ms = MK.store.missions().filter(m => m.status === "approved");
      const main = ms.filter(m => m.type === "utama" || !m.type);
      const rem = ms.filter(m => m.type === "pemulihan" && (!m.target || !m.target.length || m.target.includes(S.m.id)));
      const into = S.xp % 100;
      const weak = S.P.weakest.slice(0, 2);
      return `<header class="s-hero card">
        <div class="s-id"><div class="s-ava">🦌</div><div><h1>${E(S.m.name)}</h1><p class="muted">Tahap ${S.level} · ${S.xp} XP · Kelas ${E(MK.CLASS_CODE)}</p></div></div>
        <div class="xpbar" aria-label="Kemajuan tahap"><i style="width:${into}%"></i></div><small class="muted">${100 - into} XP lagi ke Tahap ${S.level + 1}</small>
      </header>
      <a class="card rec" href="#/pelajar/main/LATIHAN">
        <span class="rec-ic">🎯</span><div><small class="tag">Disyorkan untuk anda</small>
        <b>${weak.length ? "Latihan peribadi: " + E(weak.map(s => s.name).join(" & ")) : "Latihan pengukuhan"}</b>
        <small class="muted">${weak.length ? "Dipilih kerana kemahiran ini belum dikuasai (knowledge tracing)." : "Anda menguasai banyak kemahiran. Cuba latihan campuran!"}</small></div><span class="go">▶</span></a>
      <h3 class="sec">Misi aktif</h3>
      <div class="m-list">${main.map(m => `<a class="card m-item" href="#/pelajar/main/${m.id}"><span class="m-ic">🗺</span><div><b>${E(m.title)}</b><small class="muted">${m.levels.length} peringkat · ${S.done.has(m.id) ? "✓ Selesai, main lagi" : "Belum selesai"}</small></div><span class="go">▶</span></a>`).join("") || `<p class="muted">Tiada misi aktif.</p>`}</div>
      ${rem.length ? `<h3 class="sec">Cabaran kedua (daripada guru anda)</h3><div class="m-list">${rem.map(m => `<a class="card m-item warn" href="#/pelajar/main/${m.id}"><span class="m-ic">🪤</span><div><b>${E(m.title)}</b><small class="muted">Disyorkan oleh guru anda</small></div><span class="go">▶</span></a>`).join("")}</div>` : ""}
      <div class="grid-2">
        <div class="card"><h2>Penguasaan kemahiran saya</h2>
          ${S.P.skills.map(s => `<div class="skill-row"><div class="bar-row"><span>${E(s.name)}</span><div class="bar"><i style="width:${s.mastery}%;--h:${s.mastery * 1.2}"></i></div><b>${s.mastery}%</b></div><span class="st st-${s.status.key}">${s.status.label}</span></div>`).join("")}
          <p class="muted small">Bar: tahap kemahiran (Elo). Label: status penguasaan (BKT).</p></div>
        <div class="card"><h2>Trend kemajuan</h2>${sparkline(S.trend)}
          <p class="small">Jawapan: <b>${S.ans.length}</b> · Betul: <b>${S.ok}</b> · Rekod berturut-turut: <b>${S.best}</b></p></div>
      </div>
      <div class="grid-2">
        <div class="card"><h2>Lencana</h2><div class="badges">${S.badges.map(b => `<div class="bdg ${b.ok ? "on" : ""}" title="${E(b.d || b.n)}"><span>${b.ic}</span><small>${E(b.n)}</small></div>`).join("")}</div></div>
        <div class="card"><h2>Papan markah kelas</h2>${this.board(S.m.id)}</div>
      </div>`;
    },
    board(myId) {
      const t = {};
      MK.store.answers().forEach(a => { t[a.sid] = t[a.sid] || { name: a.name, xp: 0 }; t[a.sid].xp += (a.correct ? 10 : 0) + 2; });
      const rows = Object.entries(t).sort((a, b) => b[1].xp - a[1].xp);
      const myRank = rows.findIndex(r => r[0] === myId);
      return `<ol class="board">${rows.slice(0, 5).map(([id, r], i) => `<li class="${id === myId ? "me" : ""}"><span class="rank">${i + 1}</span><span class="nm">${E(r.name)}</span><b>${r.xp} XP</b></li>`).join("")}
        ${myRank >= 5 ? `<li class="me"><span class="rank">${myRank + 1}</span><span class="nm">${E(rows[myRank][1].name)} (anda)</span><b>${rows[myRank][1].xp} XP</b></li>` : ""}</ol>`;
    },

    /* ---------- Permainan ---------- */
    v_play() {
      return `<div class="play">
        <div class="play-top"><a href="#/pelajar" class="btn ghost small">← Keluar</a><div class="prog"><i id="progBar"></i></div><span id="progTxt" class="muted small"></span></div>
        <div class="play-grid"><div id="avatarBox" class="avatar-box"></div><div id="qBox" class="qbox card"></div></div>
      </div>`;
    },
    a_play(mid) {
      const qBox = document.getElementById("qBox");
      if (!qBox) return;
      const mission = mid === "LATIHAN" ? practiceMission() : MK.store.missions().find(m => m.id === mid && m.status === "approved");
      MK.avatar.mount(document.getElementById("avatarBox"));
      if (!mission || !mission.questionIds.length) {
        qBox.innerHTML = `<h2>Misi tidak ditemui</h2><p class="muted">Misi "${E(mid)}" tiada atau belum diluluskan guru. Jika guru menggunakan peranti lain, pastikan Firebase disambungkan (README Bahagian 6).</p><a class="btn" href="#/pelajar">Kembali</a>`;
        MK.avatar.say("Alamak, saya tidak menjumpai misi itu.", "think");
        return;
      }
      const bank = MK.store.questionBank();
      const pool = mission.questionIds.map(id => bank.find(q => q.id === id)).filter(Boolean);
      const total = Math.min(mission.length || 10, pool.length);
      const perLevel = Math.ceil(total / mission.levels.length);
      const g = { n: 0, ok: 0, streak: 0, wrongRun: 0, asked: [], log: [], levelShown: -1, timer: null, t0: 0 };
      const levelOf = n => Math.min(mission.levels.length - 1, Math.floor(n / perLevel));

      function next() {
        clearTimeout(g.timer);
        if (g.n >= total) return finish();
        const lv = levelOf(g.n);
        document.getElementById("progBar").style.width = (100 * g.n / total) + "%";
        document.getElementById("progTxt").textContent = (g.n + 1) + " / " + total;
        if (lv !== g.levelShown) {
          g.levelShown = lv;
          const L = mission.levels[lv];
          qBox.innerHTML = `<div class="level-intro"><span class="tag">${E(L.name)}</span><p class="story">${E(L.story)}</p><button class="btn primary big" id="goBtn">Teruskan ▶</button></div>`;
          MK.avatar.say(L.story, "happy");
          document.getElementById("goBtn").onclick = ask;
          return;
        }
        ask();
      }

      function ask() {
        const L = mission.levels[levelOf(g.n)];
        const all = MK.store.answers();
        const { theta, qd } = MK.elo.compute(all, bank);
        const th = theta[me().id] || {};
        const pl = MK.bkt.compute(all.filter(a => a.sid === me().id))[me().id] || {};
        let lvPool = pool.filter(q => (L.skills || []).includes(q.s) && !g.asked.includes(q.id));
        if (!lvPool.length) lvPool = pool.filter(q => !g.asked.includes(q.id));
        // Lapisan 1 (BKT): utamakan kemahiran yang belum dikuasai
        const notMastered = lvPool.filter(q => (pl[q.s] === undefined ? MK.bkt.L0 : pl[q.s]) < MK.bkt.MASTERY);
        if (notMastered.length) {
          const minP = Math.min(...notMastered.map(q => pl[q.s] === undefined ? MK.bkt.L0 : pl[q.s]));
          const focus = notMastered.filter(q => (pl[q.s] === undefined ? MK.bkt.L0 : pl[q.s]) <= minP + 0.25);
          lvPool = focus.length ? focus : notMastered;
        }
        // Lapisan 2 (Elo): pilih aras kesukaran yang sesuai
        const q = MK.elo.pick(th, lvPool, g.asked, qd);
        if (!q) return finish();
        g.asked.push(q.id); g.q = q; g.t0 = Date.now(); g.hinted = false;
        const pc = Math.round(100 * MK.elo.p(th[q.s] || 0, qd[q.id] !== undefined ? qd[q.id] : q.d));
        const pk = pl[q.s] === undefined ? MK.bkt.L0 : pl[q.s];
        const skillName = (MK.allSkills().find(s => s.id === q.s) || {}).name || "";
        qBox.innerHTML = `<div class="q-meta"><span class="tag">${E(skillName)}</span>
          <span class="muted small" title="BKT: kebarangkalian anda menguasai kemahiran ini. Elo: anggaran peluang menjawab betul.">🧠 Penguasaan ${Math.round(pk * 100)}% · 🎯 Peluang ${pc}%</span></div>
          <h2 class="q-text">${E(q.q)}</h2>
          <div class="opts">${q.o.map((o, i) => `<button class="opt" data-i="${i}"><span class="opt-l">${"ABCD"[i]}</span><span>${E(o)}</span></button>`).join("")}</div>
          <div class="row q-tools"><button class="btn ghost small" id="hintBtn">💡 Petunjuk</button>
          ${MK.avatar.canListen() ? `<button class="btn ghost small" id="micBtn">🎤 Jawab dengan suara</button>` : ""}</div>
          <div id="feedback"></div>`;
        MK.avatar.say(q.q, "happy");
        qBox.querySelectorAll(".opt").forEach(b => b.onclick = () => answer(+b.dataset.i));
        document.getElementById("hintBtn").onclick = hint;
        const mic = document.getElementById("micBtn");
        if (mic) mic.onclick = () => {
          mic.textContent = "🎙 Mendengar..."; mic.classList.add("listening");
          MK.avatar.mood("think");
          MK.avatar.listen(q.o, (i, said) => {
            if (i >= 0) { MK.toast("Anda sebut: \"" + said + "\""); answer(i); }
            else MK.avatar.say("Maaf, saya kurang jelas. Cuba sebut A, B, C atau D.", "encourage");
          }, () => { mic.textContent = "🎤 Jawab dengan suara"; mic.classList.remove("listening"); });
        };
        g.timer = setTimeout(() => { if (!g.hinted) { MK.avatar.say("Perlukan bantuan? " + q.h, "think"); g.hinted = true; } }, 20000);
      }

      function hint() { g.hinted = true; MK.avatar.say(g.q.h || "Baca soalan sekali lagi dengan teliti.", "think"); }

      function answer(i) {
        clearTimeout(g.timer);
        const q = g.q, correct = i === q.a, ms = Date.now() - g.t0;
        qBox.querySelectorAll(".opt").forEach(b => { b.disabled = true; const k = +b.dataset.i; if (k === q.a) b.classList.add("right"); else if (k === i) b.classList.add("wrong"); });
        g.n++;
        MK.store.addAnswer({ sid: me().id, name: me().name, qid: q.id, skill: q.s, choice: i, correct, misc: correct ? null : (q.m && q.m[i]) || null, ms, ts: Date.now(), session: mission.id, final: g.n >= total });
        g.log.push({ q, i, correct });
        const pl = MK.bkt.compute(MK.store.answers().filter(a => a.sid === me().id))[me().id] || {};
        const nowP = Math.round((pl[q.s] || 0) * 100);
        let msg, mood;
        if (correct) {
          g.ok++; g.streak++; g.wrongRun = 0; mood = "celebrate";
          msg = g.streak >= 3 ? "Hebat! " + g.streak + " betul berturut-turut! Cabaran seterusnya lebih sukar." : ["Betul! Bijak sungguh!", "Tepat sekali!", "Syabas, jawapan betul!"][g.n % 3];
          if (nowP >= 95) msg += " Anda kini menguasai kemahiran ini!";
        } else {
          g.streak = 0; g.wrongRun++; mood = "encourage";
          msg = g.wrongRun >= 2 ? "Tidak mengapa, kita belajar bersama. Saya akan beri soalan yang lebih mudah." : "Hampir! Mari lihat penerangannya.";
        }
        document.getElementById("feedback").innerHTML = `<div class="fb ${correct ? "ok" : "no"}"><b>${correct ? "✓ Betul" : "✕ Belum tepat"}</b> <small class="muted">· Penguasaan kemahiran kini ${nowP}%</small><p>${E(q.e)}</p>
          <button class="btn primary" id="nextBtn">${g.n >= total ? "Lihat keputusan" : "Seterusnya ▶"}</button></div>`;
        MK.avatar.say(msg + " " + (q.e || ""), mood);
        document.getElementById("nextBtn").onclick = next;
        document.getElementById("nextBtn").focus();
      }

      function finish() {
        clearTimeout(g.timer);
        document.getElementById("progBar").style.width = "100%";
        const pct = Math.round(100 * g.ok / (g.log.length || 1));
        const xp = g.ok * 10 + g.log.length * 2;
        qBox.innerHTML = `<div class="finish"><h2>🏆 Misi selesai!</h2>
          <div class="kpis small"><div class="kpi"><span>Skor</span><b>${g.ok}/${g.log.length}</b></div><div class="kpi"><span>Ketepatan</span><b>${pct}%</b></div><div class="kpi"><span>XP diperoleh</span><b>+${xp}</b></div></div>
          <h3>Refleksi</h3><ul class="reflect">${g.log.map(l => `<li class="${l.correct ? "ok" : "no"}">${l.correct ? "✓" : "✕"} ${E(l.q.q)}${l.correct ? "" : `<br><small>Jawapan betul: ${E(l.q.o[l.q.a])}. ${E(l.q.h)}</small>`}</li>`).join("")}</ul>
          <div class="row"><a class="btn primary" href="#/pelajar">Papan pemuka saya</a><button class="btn" id="againBtn">Main lagi</button></div></div>`;
        MK.avatar.say(pct >= 70 ? "Tahniah! Anda menamatkan misi dengan cemerlang. Kancil bangga dengan anda!" : "Misi selesai! Lihat refleksi untuk memperbaiki kefahaman. Cuba lagi, anda pasti boleh!", pct >= 70 ? "celebrate" : "encourage");
        document.getElementById("againBtn").onclick = () => MK.route();
      }

      next();
    }
  };
})();
