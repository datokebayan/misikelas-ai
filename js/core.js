/* MisiKelas AI — Teras: tetapan, storan, Elo, BKT, K-means, analitik */
window.MK = window.MK || {};

/* ================= Tetapan ================= */
MK.settings = {
  load() {
    let s = {};
    try { s = JSON.parse(localStorage.getItem("mk_settings") || "{}"); } catch (e) {}
    return Object.assign({ provider: "demo", apiKey: "", geminiModel: "gemini-2.5-flash", claudeModel: "claude-haiku-5-5", firebase: "", voice: true }, s);
  },
  save(s) { try { localStorage.setItem("mk_settings", JSON.stringify(s)); } catch (e) {} }
};

/* ================= Storan (tempatan + Firebase pilihan) ================= */
MK.store = {
  fb: null, channel: null, listeners: [],
  _get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  _set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },

  async init() {
    try { this.channel = new BroadcastChannel("misikelas"); this.channel.onmessage = () => this._emit(); } catch (e) {}
    window.addEventListener("storage", () => this._emit());
    if (this._get("mk_seeded", 0) !== 2) this.resetDemo();
    const cfg = MK.settings.load().firebase || MK.FIREBASE_CONFIG;
    if (cfg) await this._initFirebase(cfg);
  },

  resetDemo() {
    const d = MK.generateDemoData();
    this._set("mk_roster", d.students);
    this._set("mk_answers", d.answers);
    this._set("mk_missions", [MK.DEMO_MISSION]);
    this._set("mk_log", [{ ts: Date.now(), agent: "Sistem", msg: "Data simulasi dimuatkan: " + d.students.length + " pelajar, " + d.answers.length + " jawapan." }]);
    this._set("mk_seeded", 2);
    this._emit();
  },

  async _initFirebase(cfgText) {
    try {
      const cfg = typeof cfgText === "string" ? MK.parseCfg(cfgText) : cfgText;
      await MK.loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
      await MK.loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js");
      if (MK.FIREBASE_AUTH) await MK.loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js");
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      this.fb = firebase.database();
      const sync = (path, key) => this.fb.ref("misikelas/" + path).on("value", snap => { this[key] = Object.values(snap.val() || {}); this._emit(); }, () => {});
      sync("answers", "_remoteAnswers"); sync("missions", "_remoteMissions"); sync("roster", "_remoteRoster");
      MK.toast("Firebase bersambung: mod berbilang peranti aktif");
    } catch (e) {
      console.error(e);
      MK.toast("Firebase gagal disambung. Semak konfigurasi.");
    }
  },

  onChange(fn) { this.listeners.push(fn); },
  _emit() { this.listeners.forEach(fn => { try { fn(); } catch (e) { console.error(e); } }); },
  _notify() { try { this.channel && this.channel.postMessage("x"); } catch (e) {} this._emit(); },
  _merge(local, remote, key) {
    if (!remote) return local;
    const ids = new Set(local.map(key));
    return local.concat(remote.filter(x => !ids.has(key(x))));
  },

  /* --- Senarai pelajar (roster) --- */
  roster() { return this._merge(this._get("mk_roster", []), this._remoteRoster, s => s.id); },
  students() {
    const base = this.roster().slice();
    const seen = new Set(base.map(s => s.id));
    this.answers().forEach(a => { if (!seen.has(a.sid)) { seen.add(a.sid); base.push({ id: a.sid, name: a.name, group: "Langsung" }); } });
    return base;
  },
  saveStudent(st) {
    const all = this._get("mk_roster", []);
    const i = all.findIndex(x => x.id === st.id);
    if (i >= 0) all[i] = st; else all.push(st);
    this._set("mk_roster", all);
    if (this.fb) this.fb.ref("misikelas/roster/" + st.id).set(st);
    this._notify();
  },

  /* --- Jawapan --- */
  answers() { return this._merge(this._get("mk_answers", []), this._remoteAnswers, a => a.sid + a.ts); },
  addAnswer(a) {
    const all = this._get("mk_answers", []);
    all.push(a); this._set("mk_answers", all);
    if (this.fb) this.fb.ref("misikelas/answers").push(a);
    this._notify();
  },

  /* --- Misi --- */
  missions() { return this._merge(this._get("mk_missions", []), this._remoteMissions, m => m.id); },
  saveMission(m) {
    const all = this._get("mk_missions", []);
    const i = all.findIndex(x => x.id === m.id);
    if (i >= 0) all[i] = m; else all.push(m);
    this._set("mk_missions", all);
    if (this.fb && m.status === "approved") this.fb.ref("misikelas/missions/" + m.id).set(JSON.parse(JSON.stringify(m)));
    this._notify();
  },
  deleteMission(id) {
    this._set("mk_missions", this._get("mk_missions", []).filter(m => m.id !== id));
    if (this.fb) this.fb.ref("misikelas/missions/" + id).remove();
    this._notify();
  },

  /* --- Log ejen --- */
  log() { return this._get("mk_log", []); },
  addLog(agent, msg) {
    const l = this._get("mk_log", []);
    l.push({ ts: Date.now(), agent, msg });
    this._set("mk_log", l.slice(-80));
    this._notify();
  },
  questionBank() {
    const extra = [];
    this.missions().forEach(m => (m.questions || []).forEach(q => extra.push(q)));
    const ids = new Set(MK.QUESTIONS.map(q => q.id));
    return MK.QUESTIONS.concat(extra.filter(q => !ids.has(q.id)));
  }
};

/* Terima konfigurasi Firebase sama ada JSON atau objek JavaScript yang disalin terus dari konsol Firebase */
MK.parseCfg = function (txt) {
  if (typeof txt !== "string") return txt;
  try { return JSON.parse(txt); } catch (e) {}
  const a = txt.indexOf("{"), b = txt.lastIndexOf("}");
  if (a < 0 || b < 0) throw new Error("Konfigurasi tidak sah");
  const body = txt.slice(a, b + 1).replace(/^\s*\/\/.*$/gm, "").replace(/([{,]\s*)([A-Za-z_][\w]*)\s*:/g, '$1"$2":').replace(/'/g, '"').replace(/,\s*}/g, "}");
  return JSON.parse(body);
};

MK.loadScript = function (src) {
  return new Promise((res, rej) => {
    if (document.querySelector('script[src="' + src + '"]')) return res();
    const s = document.createElement("script");
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
};

/* ================= Algoritma Elo (Pelánek, 2016) =================
   P(betul) = 1 / (1 + e^-(θ − d))
   θ pelajar  += K × (hasil − P),  K = 1.8 / (1 + 0.05n)  (ketidakpastian menurun)
   d soalan   −= 0.15 × (hasil − P)                                      */
MK.elo = {
  p(theta, d) { return 1 / (1 + Math.exp(-(theta - d))); },
  compute(answers, bank) {
    const qd = {}; bank.forEach(q => qd[q.id] = q.d);
    const theta = {}, cnt = {};
    answers.forEach(a => {
      if (qd[a.qid] === undefined) return;
      theta[a.sid] = theta[a.sid] || {}; cnt[a.sid] = cnt[a.sid] || {};
      const t = theta[a.sid][a.skill] || 0;
      const n = cnt[a.sid][a.skill] = (cnt[a.sid][a.skill] || 0) + 1;
      const p = this.p(t, qd[a.qid]);
      const r = a.correct ? 1 : 0;
      theta[a.sid][a.skill] = t + (1.8 / (1 + 0.05 * n)) * (r - p);
      qd[a.qid] = qd[a.qid] - 0.15 * (r - p);
    });
    return { theta, qd };
  },
  mastery(t) { return Math.round(100 / (1 + Math.exp(-(t || 0)))); },
  /* Pilih soalan dalam Zon Perkembangan Proksimal: sasaran P(betul) ≈ 70% */
  pick(thetaSkills, pool, answeredIds, qd) {
    const cands = pool.filter(q => !answeredIds.includes(q.id));
    if (!cands.length) return null;
    let best = null, bestScore = 1e9;
    cands.forEach(q => {
      const p = this.p(thetaSkills[q.s] || 0, qd[q.id] !== undefined ? qd[q.id] : q.d);
      const score = Math.abs(p - 0.7) + Math.random() * 0.05;
      if (score < bestScore) { bestScore = score; best = q; }
    });
    return best;
  }
};

/* ================= Bayesian Knowledge Tracing (Corbett & Anderson, 1994) =================
   Selepas setiap jawapan:
     Betul : P(L|obs) = P(L)(1−S) / [P(L)(1−S) + (1−P(L))G]
     Salah : P(L|obs) = P(L)S     / [P(L)S     + (1−P(L))(1−G)]
     Kemudian belajar: P(L) = P(L|obs) + (1 − P(L|obs)) × T                          */
MK.bkt = {
  L0: 0.20, T: 0.15, G: 0.25, S: 0.10, MASTERY: 0.95,
  update(pL, correct) {
    const post = correct
      ? pL * (1 - this.S) / (pL * (1 - this.S) + (1 - pL) * this.G)
      : pL * this.S / (pL * this.S + (1 - pL) * (1 - this.G));
    return post + (1 - post) * this.T;
  },
  compute(answers) {
    const pL = {}; // pL[sid][skill]
    answers.forEach(a => {
      pL[a.sid] = pL[a.sid] || {};
      const cur = pL[a.sid][a.skill] !== undefined ? pL[a.sid][a.skill] : this.L0;
      pL[a.sid][a.skill] = this.update(cur, a.correct);
    });
    return pL;
  },
  status(p) {
    if (p === undefined) return { key: "none", label: "Belum dicuba" };
    if (p >= this.MASTERY) return { key: "mastered", label: "Kuasai" };
    if (p >= 0.4) return { key: "learning", label: "Sedang belajar" };
    return { key: "weak", label: "Belum kuasai" };
  }
};

/* ================= K-means (pengelompokan pelajar mengikut profil kemahiran) ================= */
MK.kmeans = function (points, k, iters) {
  iters = iters || 30;
  if (points.length <= k) return points.map((_, i) => i);
  const rnd = MK.seededRandom(42);
  const dist = (a, b) => a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0);
  // k-means++
  const cents = [points[Math.floor(rnd() * points.length)].slice()];
  while (cents.length < k) {
    const d = points.map(p => Math.min(...cents.map(c => dist(p, c))));
    let r = rnd() * d.reduce((x, y) => x + y, 0), i = 0;
    while (r > d[i] && i < d.length - 1) { r -= d[i]; i++; }
    cents.push(points[i].slice());
  }
  let assign = new Array(points.length).fill(0);
  for (let it = 0; it < iters; it++) {
    assign = points.map(p => { let bi = 0, bd = 1e18; cents.forEach((c, j) => { const dd = dist(p, c); if (dd < bd) { bd = dd; bi = j; } }); return bi; });
    cents.forEach((c, j) => {
      const mem = points.filter((_, i) => assign[i] === j);
      if (mem.length) for (let x = 0; x < c.length; x++) c[x] = mem.reduce((s, m) => s + m[x], 0) / mem.length;
    });
  }
  return assign;
};

/* ================= Analitik ================= */
MK.analytics = function () {
  MK.syncMisc && MK.syncMisc();
  const answers = MK.store.answers();
  const bank = MK.store.questionBank();
  const students = MK.store.students();
  const { theta } = MK.elo.compute(answers, bank);
  const pL = MK.bkt.compute(answers);
  const miscCount = {}, miscStudents = {}, miscExamples = {};
  answers.forEach(a => {
    if (!a.misc) return;
    miscCount[a.misc] = (miscCount[a.misc] || 0) + 1;
    (miscStudents[a.misc] = miscStudents[a.misc] || new Set()).add(a.sid);
    if (!miscExamples[a.misc]) {
      const q = bank.find(x => x.id === a.qid);
      if (q) miscExamples[a.misc] = { q: q.q, chosen: q.o[a.choice] };
    }
  });
  const misc = Object.keys(miscCount).map(k => ({
    id: k, name: (MK.MISCONCEPTIONS[k] || { name: k }).name, fix: (MK.MISCONCEPTIONS[k] || {}).fix,
    count: miscCount[k], students: [...miscStudents[k]], example: miscExamples[k]
  })).sort((a, b) => b.count - a.count);
  const allSkills = (MK.allSkills ? MK.allSkills() : MK.SKILLS);
  const usedSkills = allSkills.filter(s => answers.some(a => a.skill === s.id));
  const skillAvg = allSkills.map(s => {
    const vals = students.map(st => MK.elo.mastery((theta[st.id] || {})[s.id]));
    const mastered = students.filter(st => ((pL[st.id] || {})[s.id] || 0) >= MK.bkt.MASTERY).length;
    return { ...s, avg: Math.round(vals.reduce((x, y) => x + y, 0) / (vals.length || 1)), mastered };
  });
  const correctRate = answers.length ? Math.round(100 * answers.filter(a => a.correct).length / answers.length) : 0;
  return { answers, bank, students, theta, pL, misc, skillAvg, usedSkills, correctRate };
};

/* Profil seorang pelajar */
MK.studentProfile = function (sid, A) {
  A = A || MK.analytics();
  const st = A.students.find(s => s.id === sid) || { id: sid, name: sid };
  const ans = A.answers.filter(a => a.sid === sid);
  const th = A.theta[sid] || {}, pl = A.pL[sid] || {};
  const skills = A.usedSkills.map(s => ({ ...s, mastery: MK.elo.mastery(th[s.id]), pL: pl[s.id], status: MK.bkt.status(pl[s.id]) }));
  const last10 = ans.slice(-10);
  const recentRate = last10.length ? Math.round(100 * last10.filter(a => a.correct).length / last10.length) : 0;
  const avgMastery = skills.length ? Math.round(skills.reduce((x, s) => x + s.mastery, 0) / skills.length) : 0;
  const avgSec = ans.length ? Math.round(ans.reduce((x, a) => x + a.ms, 0) / ans.length / 1000) : 0;
  const myMisc = {};
  ans.forEach(a => { if (a.misc) myMisc[a.misc] = (myMisc[a.misc] || 0) + 1; });
  const miscList = Object.entries(myMisc).sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ id, n, ...(MK.MISCONCEPTIONS[id] || { name: id }) }));
  const weakest = [...skills].filter(s => s.status.key !== "mastered").sort((a, b) => (a.pL || 0) - (b.pL || 0) || a.mastery - b.mastery);
  const reasons = [];
  if (ans.length >= 5 && avgMastery < 45) reasons.push("Purata penguasaan rendah (" + avgMastery + "%)");
  if (last10.length >= 6 && recentRate < 40) reasons.push("Kadar betul 10 jawapan terakhir hanya " + recentRate + "%");
  if (ans.length >= 5 && avgSec > 20) reasons.push("Masa respons purata panjang (" + avgSec + " saat)");
  return { st, ans, skills, recentRate, avgMastery, avgSec, miscList, weakest, risk: reasons.length >= 1 && (avgMastery < 50 || recentRate < 40), reasons,
    correctRate: ans.length ? Math.round(100 * ans.filter(a => a.correct).length / ans.length) : 0 };
};

/* Kumpulan automatik melalui K-means */
MK.groups = function (A, k) {
  A = A || MK.analytics();
  k = k || 4;
  const skills = A.usedSkills;
  const studs = A.students.filter(st => A.answers.some(a => a.sid === st.id));
  const pts = studs.map(st => skills.map(s => MK.elo.mastery((A.theta[st.id] || {})[s.id])));
  const assign = MK.kmeans(pts, Math.min(k, studs.length));
  const classAvg = skills.map((_, j) => pts.reduce((x, p) => x + p[j], 0) / (pts.length || 1));
  const groups = [];
  assign.forEach((g, i) => { (groups[g] = groups[g] || { members: [], pts: [] }).members.push(studs[i]); groups[g].pts.push(pts[i]); });
  return groups.filter(Boolean).map((g, gi) => {
    const avg = skills.map((_, j) => Math.round(g.pts.reduce((x, p) => x + p[j], 0) / g.pts.length));
    const overall = Math.round(avg.reduce((x, y) => x + y, 0) / avg.length);
    let wi = 0, wd = 1e9; avg.forEach((v, j) => { const d = v - classAvg[j]; if (d < wd) { wd = d; wi = j; } });
    const mc = {};
    A.answers.forEach(a => { if (a.misc && g.members.some(m => m.id === a.sid)) mc[a.misc] = (mc[a.misc] || 0) + 1; });
    const topMisc = Object.entries(mc).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([id, n]) => ({ id, n, ...(MK.MISCONCEPTIONS[id] || { name: id }) }));
    const label = overall >= 72 ? "Cemerlang: sedia untuk cabaran lanjutan" : overall >= 58 && wd > -8 ? "Sederhana: perlu pengukuhan" : "Perlu bimbingan: " + skills[wi].name;
    return { id: gi, label, overall, avg, weakSkill: skills[wi], members: g.members, topMisc };
  }).sort((a, b) => b.overall - a.overall);
};

/* ================= Utiliti ================= */
MK.esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
MK.uid = p => (p || "") + Math.random().toString(36).slice(2, 8).toUpperCase();
MK.toast = function (msg) {
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 3200);
};
MK.timeAgo = ts => {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return s + " saat lalu";
  if (s < 3600) return Math.round(s / 60) + " minit lalu";
  if (s < 86400) return Math.round(s / 3600) + " jam lalu";
  return Math.round(s / 86400) + " hari lalu";
};
/* Carta radar SVG ringkas */
MK.radar = function (labels, values, size) {
  size = size || 260;
  const c = size / 2, r = c - 46, n = labels.length;
  if (n < 3) return "";
  const pt = (i, v) => { const a = -Math.PI / 2 + 2 * Math.PI * i / n; return [c + Math.cos(a) * r * v / 100, c + Math.sin(a) * r * v / 100]; };
  const rings = [25, 50, 75, 100].map(v => `<polygon points="${labels.map((_, i) => pt(i, v).join(",")).join(" ")}" class="rd-ring"/>`).join("");
  const axes = labels.map((_, i) => `<line x1="${c}" y1="${c}" x2="${pt(i, 100)[0]}" y2="${pt(i, 100)[1]}" class="rd-axis"/>`).join("");
  const shape = `<polygon points="${values.map((v, i) => pt(i, v).join(",")).join(" ")}" class="rd-shape"/>`;
  const dots = values.map((v, i) => `<circle cx="${pt(i, v)[0]}" cy="${pt(i, v)[1]}" r="3.5" class="rd-dot"/>`).join("");
  const lbl = labels.map((l, i) => { const [x, y] = pt(i, 122); return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" class="rd-label">${MK.esc(l.length > 16 ? l.slice(0, 15) + "…" : l)}</text>`; }).join("");
  return `<svg viewBox="0 0 ${size} ${size}" class="radar" role="img" aria-label="Carta radar penguasaan kemahiran">${rings}${axes}${shape}${dots}${lbl}</svg>`;
};
