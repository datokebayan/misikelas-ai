/* MisiKelas AI — Log masuk hibrid
   Mod Demo (lalai): akaun disemak dalam peranti; berfungsi tanpa internet.
   Mod Firebase (pilihan): staf disahkan oleh Firebase Authentication. */
window.MK = window.MK || {};

MK.auth = {
  user() { try { return JSON.parse(localStorage.getItem("mk_session") || "null"); } catch (e) { return null; } },
  _set(u) { localStorage.setItem("mk_session", JSON.stringify(u)); },
  mode() { return MK.FIREBASE_AUTH && MK.store.fb && window.firebase && firebase.auth ? "firebase" : "demo"; },
  role() { const u = this.user(); return u ? u.role : null; },
  canWrite() { const r = this.role(); return r === "guru" || r === "admin"; },
  isStaff() { return ["guru", "admin", "juri"].includes(this.role()); },

  async loginStaff(email, password) {
    email = (email || "").trim().toLowerCase();
    const acc = MK.STAFF.find(s => s.email.toLowerCase() === email);
    if (this.mode() === "firebase") {
      try { await firebase.auth().signInWithEmailAndPassword(email, password); }
      catch (e) { throw new Error("E-mel atau kata laluan salah (Firebase)."); }
      const role = acc ? acc.role : "guru";
      this._set({ role, id: email, name: acc ? acc.name : email, email, via: "firebase" });
      return this.user();
    }
    if (!acc || acc.password !== password) throw new Error("E-mel atau kata laluan salah.");
    this._set({ role: acc.role, id: acc.email, name: acc.name, email: acc.email, via: "demo" });
    return this.user();
  },

  loginStudent(code, name, pin) {
    if ((code || "").trim().toUpperCase() !== MK.CLASS_CODE) throw new Error("Kod kelas tidak sah.");
    const st = MK.store.roster().find(s => s.name.toLowerCase() === (name || "").trim().toLowerCase());
    if (!st) throw new Error("Nama samaran tidak dijumpai. Pelajar baharu? Pilih \"Daftar pelajar baharu\".");
    if (String(st.pin) !== String(pin).trim()) throw new Error("PIN salah. Minta guru menetapkan semula PIN anda.");
    this._set({ role: "pelajar", id: st.id, name: st.name, via: "pin" });
    return this.user();
  },

  registerStudent(code, name) {
    if ((code || "").trim().toUpperCase() !== MK.CLASS_CODE) throw new Error("Kod kelas tidak sah.");
    name = (name || "").trim();
    if (name.length < 3) throw new Error("Nama samaran terlalu pendek.");
    if (MK.store.roster().some(s => s.name.toLowerCase() === name.toLowerCase())) throw new Error("Nama samaran sudah digunakan. Pilih nama lain.");
    const st = { id: "L" + MK.uid(), name, pin: String(1000 + Math.floor(Math.random() * 9000)), group: "Baharu", createdAt: Date.now() };
    MK.store.saveStudent(st);
    this._set({ role: "pelajar", id: st.id, name: st.name, via: "pin" });
    return st;
  },

  logout() {
    try { if (this.mode() === "firebase") firebase.auth().signOut(); } catch (e) {}
    localStorage.removeItem("mk_session");
    location.hash = "#/";
  }
};

/* ---------------- Skrin log masuk ---------------- */
MK.loginView = function (next, tab) {
  const E = MK.esc;
  tab = tab || "staf";
  const fb = MK.auth.mode() === "firebase";
  const sug = MK.STUDENT_NAMES[Math.floor(Math.random() * MK.STUDENT_NAMES.length)] + ["Bijak", "Pantas", "Cerdik", "Berani"][Math.floor(Math.random() * 4)];
  return `<section class="login">
    <div class="login-card card">
      <div id="loginAvatar"></div>
      <h1>Log masuk MisiKelas AI</h1>
      <p class="muted small">${fb ? "🔐 Mod Firebase: log masuk staf disahkan oleh Firebase Authentication." : "🧪 Mod Demo: akaun disemak dalam peranti ini (untuk demonstrasi)."}</p>
      <div class="tabs" role="tablist">
        <button role="tab" class="${tab === "staf" ? "on" : ""}" data-tab="staf">Guru / Staf</button>
        <button role="tab" class="${tab === "pelajar" ? "on" : ""}" data-tab="pelajar">Pelajar</button>
        <button role="tab" class="${tab === "baharu" ? "on" : ""}" data-tab="baharu">Pelajar baharu</button>
      </div>
      <form class="form" id="fStaf" ${tab === "staf" ? "" : "hidden"}>
        <label>E-mel<input name="email" type="email" autocomplete="username" required placeholder="guru@misikelas.demo"></label>
        <label>Kata laluan<input name="pwd" type="password" autocomplete="current-password" required></label>
        <button class="btn primary big">Log masuk</button>
      </form>
      <form class="form" id="fPelajar" ${tab === "pelajar" ? "" : "hidden"}>
        <label>Kod kelas<input name="code" required value="${E(MK.CLASS_CODE)}" autocapitalize="characters"></label>
        <label>Nama samaran<input name="name" required placeholder="Contoh: Harimau01"></label>
        <label>PIN (4 digit)<input name="pin" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required></label>
        <button class="btn primary big">Masuk</button>
      </form>
      <form class="form" id="fBaharu" ${tab === "baharu" ? "" : "hidden"}>
        <label>Kod kelas<input name="code" required value="${E(MK.CLASS_CODE)}" autocapitalize="characters"></label>
        <label>Pilih nama samaran<input name="name" required maxlength="20" value="${E(sug)}"></label>
        <p class="muted small">Gunakan nama samaran sahaja. Jangan masukkan nama penuh atau maklumat peribadi. PIN akan dijana untuk anda.</p>
        <button class="btn primary big">Daftar &amp; mula</button>
      </form>
      <p class="err small" id="loginErr" role="alert"></p>
      <details class="demo-acc"><summary>Akaun demo</summary>
        <table class="mini">
          <tr><th>Peranan</th><th>ID</th><th>Kata laluan / PIN</th></tr>
          ${MK.STAFF.map(s => `<tr><td>${E({ admin: "Pentadbir", guru: "Guru", juri: "Juri (baca sahaja)" }[s.role])}</td><td><button type="button" class="link" data-fill-staff="${E(s.email)}">${E(s.email)}</button></td><td>${fb ? "<i>ikut Firebase</i>" : E(s.password)}</td></tr>`).join("")}
          ${Object.entries(MK.DEMO_PINS).map(([n, p]) => `<tr><td>Pelajar</td><td><button type="button" class="link" data-fill-stu="${E(n)}|${p}">${E(MK.CLASS_CODE)} + ${E(n)}</button></td><td>${p}</td></tr>`).join("")}
        </table>
        <p class="muted small">Ketik ID untuk mengisi borang secara automatik.</p>
      </details>
    </div></section>`;
};

MK.loginAfter = function (next) {
  MK.avatar.mount(document.getElementById("loginAvatar"));
  MK.avatar.say("Selamat datang! Sila log masuk mengikut peranan anda.", "happy");
  const err = document.getElementById("loginErr");
  const show = t => {
    document.querySelectorAll(".tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === t));
    ["staf", "pelajar", "baharu"].forEach(k => document.getElementById("f" + k[0].toUpperCase() + k.slice(1)).hidden = k !== t);
    err.textContent = "";
  };
  document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => show(b.dataset.tab));
  const go = u => {
    if (next && ((u.role === "pelajar" && /^#\/(pelajar|sertai)/.test(next)) || (u.role !== "pelajar" && /^#\/(guru|admin)/.test(next)))) location.hash = next;
    else location.hash = u.role === "pelajar" ? "#/pelajar" : u.role === "admin" ? "#/admin" : "#/guru";
  };
  document.getElementById("fStaf").onsubmit = async e => {
    e.preventDefault(); err.textContent = "";
    try { go(await MK.auth.loginStaff(e.target.email.value, e.target.pwd.value)); } catch (x) { err.textContent = x.message; }
  };
  document.getElementById("fPelajar").onsubmit = e => {
    e.preventDefault(); err.textContent = "";
    try { go(MK.auth.loginStudent(e.target.code.value, e.target.name.value, e.target.pin.value)); } catch (x) { err.textContent = x.message; }
  };
  document.getElementById("fBaharu").onsubmit = e => {
    e.preventDefault(); err.textContent = "";
    try {
      const st = MK.auth.registerStudent(e.target.code.value, e.target.name.value);
      const box = document.querySelector(".login-card");
      box.innerHTML = `<h1>🎉 Pendaftaran berjaya</h1>
        <p>Nama samaran: <b>${MK.esc(st.name)}</b></p>
        <p class="pin-show">PIN anda: <b>${st.pin}</b></p>
        <p class="muted small">Catat PIN ini. Anda memerlukannya untuk log masuk semula. Guru boleh menetapkan semula PIN jika terlupa.</p>
        <button class="btn primary big" id="contBtn">Teruskan ▶</button>`;
      document.getElementById("contBtn").onclick = () => go(MK.auth.user());
    } catch (x) { err.textContent = x.message; }
  };
  document.querySelectorAll("[data-fill-staff]").forEach(b => b.onclick = () => {
    show("staf"); const f = document.getElementById("fStaf"); f.email.value = b.dataset.fillStaff;
    const acc = MK.STAFF.find(s => s.email === b.dataset.fillStaff); if (MK.auth.mode() === "demo" && acc) f.pwd.value = acc.password;
  });
  document.querySelectorAll("[data-fill-stu]").forEach(b => b.onclick = () => {
    show("pelajar"); const [n, p] = b.dataset.fillStu.split("|"); const f = document.getElementById("fPelajar"); f.name.value = n; f.pin.value = p;
  });
};
