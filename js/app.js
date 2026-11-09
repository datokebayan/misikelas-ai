/* MisiKelas AI — Penghala, kawalan akses & kerangka aplikasi */
window.MK = window.MK || {};

MK.route = function () {
  const hash = location.hash || "#/";
  const [r0, r1, r2] = hash.slice(1).split("/").filter(Boolean);
  const app = document.getElementById("app");
  const u = MK.auth.user();
  window.speechSynthesis && speechSynthesis.cancel();

  // ---- Kawalan akses ----
  const needStaff = r0 === "guru", needAdmin = r0 === "admin", needStudent = r0 === "pelajar" || r0 === "sertai";
  if ((needStaff && !MK.auth.isStaff()) || (needAdmin && MK.auth.role() !== "admin") || (needStudent && MK.auth.role() !== "pelajar")) {
    if (u && !needStudent) { MK.toast("Akaun anda tiada akses ke halaman itu."); location.hash = u.role === "pelajar" ? "#/pelajar" : "#/guru"; return; }
    if (u && needStudent && u.role !== "pelajar") { MK.toast("Sila log keluar dan log masuk sebagai pelajar."); location.hash = "#/guru"; return; }
    const next = r0 === "sertai" ? "#/pelajar/main/" + (r1 || "") : hash;
    location.replace("#/login?next=" + encodeURIComponent(next) + (needStudent ? "&tab=pelajar" : ""));
    return;
  }
  if (r0 === "sertai") { location.replace("#/pelajar/main/" + (r1 || "")); return; }

  document.body.dataset.role = u ? u.role : "home";
  MK.renderUserChip();

  let html = "", after = null;
  if (r0 && r0.startsWith("login")) {
    const q = new URLSearchParams(hash.split("?")[1] || "");
    if (u) { location.hash = u.role === "pelajar" ? "#/pelajar" : u.role === "admin" ? "#/admin" : "#/guru"; return; }
    html = MK.loginView(q.get("next"), q.get("tab")); after = () => MK.loginAfter(q.get("next"));
  } else if (r0 === "admin") {
    html = MK.admin.v(); after = () => MK.admin.a();
  } else if (r0 === "guru") {
    const tab = r1 || "papan";
    html = MK.teacher.render(tab, r2); after = () => MK.teacher.after(tab, r2);
  } else if (r0 === "pelajar") {
    if (r1 === "main") { html = MK.student.v_play(r2); after = () => MK.student.a_play(r2); }
    else html = MK.student.v_home();
  } else {
    html = MK.home(); after = MK.homeAfter;
  }
  app.innerHTML = html;
  window.scrollTo(0, 0);
  after && after();
  document.querySelectorAll("[data-open-settings]").forEach(b => b.onclick = e => { e.preventDefault(); MK.openSettings(); });
};

MK.renderUserChip = function () {
  const u = MK.auth.user();
  const box = document.getElementById("userBox");
  const roleName = { admin: "Pentadbir", guru: "Guru", juri: "Juri", pelajar: "Pelajar" };
  box.innerHTML = u
    ? `<span class="chip-user" title="${MK.esc(u.email || u.id)}"><b>${MK.esc(u.name)}</b><small>${roleName[u.role]}${u.via === "demo" ? " · demo" : ""}</small></span>
       ${u.role === "admin" ? `<a href="#/admin" class="btn ghost small">Pentadbir</a>` : ""}
       <button class="btn ghost small" id="logoutBtn">Log keluar</button>`
    : `<a href="#/login" class="btn primary small">Log masuk</a>`;
  const lo = document.getElementById("logoutBtn");
  if (lo) lo.onclick = () => MK.auth.logout();
  document.getElementById("settingsBtn").hidden = !(u && (u.role === "guru" || u.role === "admin"));
};

/* Kemas kini langsung tanpa mengganggu permainan atau borang */
MK.liveRefresh = function () {
  const h = location.hash;
  const safe = /^#\/guru(\/papan|\/langsung.*)?$/.test(h) || h === "#/pelajar";
  if (!safe) return;
  if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  if (document.querySelector(".working, .working-box")) return;
  clearTimeout(MK._rt); MK._rt = setTimeout(MK.route, 250);
};

MK.home = function () {
  const u = MK.auth.user();
  const dest = u ? (u.role === "pelajar" ? "#/pelajar" : u.role === "admin" ? "#/admin" : "#/guru") : null;
  return `<section class="home">
    <div class="hero">
      <div class="hero-text">
        <span class="tag">Agentic AI · Edutainment</span>
        <h1>Tukar sebarang pelajaran kepada <em>misi permainan kelas</em></h1>
        <p class="lead">Empat ejen AI merancang, membina, menganalisis dan menyesuaikan misi. Knowledge tracing memperibadikan pembelajaran setiap pelajar. Sang Kancil membimbing. Guru kekal membuat keputusan.</p>
        <div class="row cta">${dest ? `<a class="btn primary big" href="${dest}">Teruskan ke papan pemuka</a>`
          : `<a class="btn primary big" href="#/login">Log masuk Guru / Staf</a><a class="btn big" href="#/login?tab=pelajar">Log masuk Pelajar</a>`}</div>
      </div>
      <div class="hero-ava" id="homeAvatar"></div>
    </div>
    <div class="loop">
      ${[["1", "Rancang", "Ejen Perancang memetakan hasil pembelajaran"], ["2", "Bina", "Ejen Pereka Permainan mencipta misi bercerita"], ["3", "Laksana", "Pelajar bermain melalui QR dengan avatar bersuara"], ["4", "Nilai", "BKT & Ejen Penganalisis mengesan penguasaan dan miskonsepsi"], ["5", "Suai", "Elo melaras kesukaran; Ejen Penyesuai jana misi kumpulan"]].map(s => `<div class="loop-step"><b>${s[0]}</b><h3>${s[1]}</h3><p>${s[2]}</p></div>`).join('<span class="arrow">→</span>')}
    </div>
    <p class="center muted small">👩‍🏫 Setiap kandungan AI diluluskan guru sebelum sampai kepada pelajar (AI Berpusatkan Insan). Data pelajar dalam demo ini ialah data simulasi.</p>
  </section>`;
};
MK.homeAfter = function () {
  MK.avatar.mount(document.getElementById("homeAvatar"));
  MK.avatar.say("Hai! Saya Sang Kancil, pemandu misi anda. Log masuk untuk bermula.", "happy");
};

/* ---------------- Tetapan (guru & pentadbir sahaja) ---------------- */
MK.openSettings = function () {
  if (!MK.auth.canWrite()) return MK.toast("Tetapan hanya untuk guru dan pentadbir.");
  const s = MK.settings.load();
  const d = document.getElementById("settingsDlg");
  d.innerHTML = `<form method="dialog" class="form" id="setForm">
    <h2>Tetapan</h2>
    <label>Enjin AI
      <select name="provider">
        <option value="demo" ${s.provider === "demo" ? "selected" : ""}>Mod Demo (tanpa internet / API)</option>
        <option value="gemini" ${s.provider === "gemini" ? "selected" : ""}>Google Gemini (ada peringkat percuma)</option>
        <option value="claude" ${s.provider === "claude" ? "selected" : ""}>Anthropic Claude</option>
      </select></label>
    <label>Kunci API<input name="apiKey" type="password" autocomplete="off" value="${MK.esc(s.apiKey)}" placeholder="Tampal kunci API di sini"></label>
    <p class="muted small">Kunci disimpan dalam pelayar peranti ini sahaja. <b>Jangan</b> letak kunci API dalam fail GitHub.</p>
    <details><summary>Tetapan lanjutan</summary>
      <label>Model Gemini<input name="geminiModel" value="${MK.esc(s.geminiModel)}"></label>
      <label>Model Claude<input name="claudeModel" value="${MK.esc(s.claudeModel)}"></label>
      <label>Konfigurasi Firebase untuk peranti ini sahaja (pilihan; lebih baik guna js/config.js)<textarea name="firebase" rows="4" placeholder="Tampal firebaseConfig">${MK.esc(s.firebase)}</textarea></label>
    </details>
    <label class="check"><input type="checkbox" name="voice" ${s.voice ? "checked" : ""}> Suara Sang Kancil</label>
    <div class="row"><button class="btn primary" value="save">Simpan</button><button class="btn ghost" value="cancel" formnovalidate>Batal</button></div>
  </form>`;
  d.showModal();
  d.onclose = () => {
    if (d.returnValue !== "save") return;
    const f = new FormData(document.getElementById("setForm"));
    const ns = { provider: f.get("provider"), apiKey: f.get("apiKey").trim(), geminiModel: f.get("geminiModel").trim(), claudeModel: f.get("claudeModel").trim(), firebase: f.get("firebase").trim(), voice: !!f.get("voice") };
    if (ns.firebase) { try { MK.parseCfg(ns.firebase); } catch (e) { MK.toast("Konfigurasi Firebase tidak sah"); ns.firebase = s.firebase; } }
    MK.settings.save(ns);
    MK.toast("Tetapan disimpan" + (ns.provider === "demo" ? " (Mod Demo)" : ""));
    if (ns.firebase !== s.firebase) location.reload(); else MK.route();
  };
};

/* ---------------- Mula ---------------- */
window.addEventListener("DOMContentLoaded", async () => {
  await MK.store.init();
  MK.store.onChange(MK.liveRefresh);
  window.addEventListener("hashchange", MK.route);
  document.getElementById("settingsBtn").onclick = MK.openSettings;
  MK.route();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
});
