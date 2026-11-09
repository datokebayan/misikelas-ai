/* MisiKelas AI — Papan Pemuka Pentadbir */
window.MK = window.MK || {};
(function () {
  const E = s => MK.esc(s);
  MK.admin = {
    v() {
      const A = MK.analytics();
      const roster = MK.store.roster();
      const ms = MK.store.missions();
      const risk = A.students.map(s => MK.studentProfile(s.id, A)).filter(p => p.risk).length;
      const roleName = { admin: "Pentadbir", guru: "Guru", juri: "Juri / Pemerhati" };
      return `<header class="page-head"><div><h1>Papan Pemuka Pentadbir</h1><p class="muted">Urus akaun, kelas dan data. Pentadbir juga boleh membuka semua paparan guru.</p></div>
        <a class="btn primary" href="#/guru">▦ Buka paparan guru</a></header>
        <div class="kpis">
          <div class="kpi"><span>Kelas</span><b>1</b><small>Kod ${E(MK.CLASS_CODE)}</small></div>
          <div class="kpi"><span>Pelajar</span><b>${roster.length}</b><small>berdaftar</small></div>
          <div class="kpi"><span>Misi</span><b>${ms.length}</b><small>${ms.filter(m => m.status === "pending").length} menunggu kelulusan</small></div>
          <div class="kpi"><span>Pelajar berisiko</span><b>${risk}</b><small>seluruh kelas</small></div>
        </div>
        <div class="grid-2">
          <div class="card"><h2>Status sistem</h2>
            <table class="mini full">
              <tr><td>Log masuk</td><td>${MK.auth.mode() === "firebase" ? "🔐 Firebase Authentication" : "🧪 Mod Demo (semakan dalam peranti)"}</td></tr>
              <tr><td>Storan data</td><td>${MK.store.fb ? "☁ Firebase Realtime Database" : "💾 Pelayar peranti ini"}</td></tr>
              <tr><td>Enjin AI</td><td>${E({ demo: "Mod Demo", gemini: "Google Gemini", claude: "Anthropic Claude" }[MK.settings.load().provider])}</td></tr>
              <tr><td>Kadar betul kelas</td><td>${A.correctRate}%</td></tr>
            </table></div>
          <div class="card"><h2>Akaun staf</h2>
            <table class="mini full"><tr><th>E-mel</th><th>Peranan</th></tr>
            ${MK.STAFF.map(s => `<tr><td>${E(s.email)}</td><td>${E(roleName[s.role])}</td></tr>`).join("")}</table>
            <p class="muted small">Tambah atau ubah akaun staf dalam fail <code>js/config.js</code>. Dalam Mod Firebase, cipta pengguna yang sama di Firebase Console → Authentication.</p></div>
        </div>
        <div class="card"><div class="page-head"><h2>Senarai pelajar &amp; PIN</h2>
          <div class="row"><button class="btn small" id="showPins">👁 Papar PIN</button><button class="btn small" id="addStu">＋ Tambah pelajar</button></div></div>
          <div class="heat-wrap"><table class="mini full roster"><thead><tr><th>ID</th><th>Nama samaran</th><th>PIN</th><th>Profil</th><th></th></tr></thead>
          <tbody>${roster.map(s => `<tr><td>${E(s.id)}</td><td><a class="slink" href="#/guru/pelajar/${encodeURIComponent(s.id)}">${E(s.name)}</a></td><td><span class="pin" data-pin="${E(s.pin)}">••••</span></td><td>${E(s.group || "")}</td><td><button class="btn ghost small" data-reset="${E(s.id)}">Tetapkan semula PIN</button></td></tr>`).join("")}</tbody></table></div>
        </div>
        <div class="card"><h2>Data simulasi</h2><p class="muted">Set semula kepada data demo asal (28 pelajar, ±760 jawapan). Pelajar baharu dan jawapan langsung pada peranti ini akan dipadam.</p>
          <button class="btn danger" id="resetDemo">↺ Set semula data demo</button></div>`;
    },
    a() {
      document.getElementById("showPins").onclick = e => {
        const on = e.target.dataset.on !== "1"; e.target.dataset.on = on ? "1" : "0";
        e.target.textContent = on ? "🙈 Sembunyi PIN" : "👁 Papar PIN";
        document.querySelectorAll(".pin").forEach(p => p.textContent = on ? p.dataset.pin : "••••");
      };
      document.querySelectorAll("[data-reset]").forEach(b => b.onclick = () => {
        const st = MK.store.roster().find(s => s.id === b.dataset.reset);
        if (!st || !confirm("Tetapkan semula PIN untuk " + st.name + "?")) return;
        st.pin = String(1000 + Math.floor(Math.random() * 9000));
        MK.store.saveStudent(st);
        alert("PIN baharu untuk " + st.name + ": " + st.pin);
        MK.route();
      });
      document.getElementById("addStu").onclick = () => {
        const name = prompt("Nama samaran pelajar baharu:");
        if (!name) return;
        if (MK.store.roster().some(s => s.name.toLowerCase() === name.trim().toLowerCase())) return alert("Nama samaran sudah wujud.");
        const st = { id: "L" + MK.uid(), name: name.trim(), pin: String(1000 + Math.floor(Math.random() * 9000)), group: "Baharu", createdAt: Date.now() };
        MK.store.saveStudent(st);
        alert("Pelajar ditambah.\nNama samaran: " + st.name + "\nPIN: " + st.pin);
        MK.route();
      };
      document.getElementById("resetDemo").onclick = () => {
        if (!confirm("Set semula semua data kepada data demo?")) return;
        MK.store.resetDemo(); MK.toast("Data demo dimuatkan semula"); MK.route();
      };
    }
  };
})();
