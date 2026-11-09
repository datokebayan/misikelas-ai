/* MisiKelas AI — Empat ejen AI: Perancang, Pereka Permainan, Penganalisis, Penyesuai
   Mod Demo berfungsi tanpa API. Mod Gemini/Claude memanggil LLM sebenar. */
window.MK = window.MK || {};

MK.llm = async function (system, user) {
  const s = MK.settings.load();
  if (s.provider === "demo" || !s.apiKey) throw new Error("DEMO");
  if (s.provider === "gemini") {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(s.geminiModel) + ":generateContent?key=" + encodeURIComponent(s.apiKey);
    const r = await fetch(url, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
      })
    });
    const j = await r.json();
    if (!r.ok) throw new Error((j.error && j.error.message) || "Ralat Gemini");
    return MK.parseJSON(j.candidates[0].content.parts.map(p => p.text).join(""));
  }
  if (s.provider === "claude") {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json", "x-api-key": s.apiKey,
        "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({ model: s.claudeModel, max_tokens: 6000, system: system + "\nBalas dengan JSON sahaja, tanpa teks lain.", messages: [{ role: "user", content: user }] })
    });
    const j = await r.json();
    if (!r.ok) throw new Error((j.error && j.error.message) || "Ralat Claude");
    return MK.parseJSON(j.content.map(c => c.text || "").join(""));
  }
  throw new Error("DEMO");
};

MK.parseJSON = function (txt) {
  const a = txt.indexOf("{"), b = txt.lastIndexOf("}");
  if (a < 0 || b < 0) throw new Error("Output AI bukan JSON");
  return JSON.parse(txt.slice(a, b + 1));
};

const wait = ms => new Promise(r => setTimeout(r, ms));
const BASE_SYS = "Anda ialah ejen AI dalam aplikasi pendidikan MisiKelas AI di Malaysia. Gunakan Bahasa Melayu baku yang mudah difahami. Watak pemandu misi ialah Sang Kancil (cerita rakyat Melayu). Kandungan mesti tepat, sesuai umur dan berteraskan budaya tempatan.";

MK.agents = {
  /* ---------- EJEN 1: PERANCANG ---------- */
  async planner(topic, notes, level, onStep) {
    onStep && onStep("Perancang", "Membaca topik dan nota guru...");
    MK.store.addLog("Ejen Perancang", "Mula merancang misi untuk topik: " + topic);
    try {
      const plan = await MK.llm(BASE_SYS + " Peranan anda: EJEN PERANCANG.",
        `Topik: ${topic}\nTahap pelajar: ${level}\nNota guru (jika ada):\n${(notes || "").slice(0, 12000)}\n\n` +
        `Rancang satu misi permainan kelas 3 peringkat. Pulangkan JSON:\n` +
        `{"title":"tajuk misi menarik","outcomes":["3 hasil pembelajaran"],"skills":[{"id":"K1","name":"nama kemahiran"}] (3-5 kemahiran),` +
        `"misconceptions":[{"id":"X1","name":"miskonsepsi biasa pelajar","fix":"cadangan intervensi guru"}] (4-6),` +
        `"levels":[{"name":"Peringkat 1: ...","story":"2 ayat cerita Sang Kancil","skills":["K1"]}] (tepat 3 peringkat)}`);
      onStep && onStep("Perancang", "Pelan siap: " + plan.skills.length + " kemahiran, " + plan.levels.length + " peringkat.");
      MK.store.addLog("Ejen Perancang", "Pelan siap: \"" + plan.title + "\"");
      return plan;
    } catch (e) {
      if (e.message !== "DEMO") throw e;
      await wait(900);
      const m = MK.DEMO_MISSION;
      const plan = {
        title: topic && !/kecerdasan|AI/i.test(topic) ? "Misi Kancil: " + topic : m.title,
        outcomes: m.outcomes, skills: MK.SKILLS, levels: m.levels, demo: true
      };
      onStep && onStep("Perancang", "[Mod Demo] Pelan dibina daripada templat terbina dalam.");
      MK.store.addLog("Ejen Perancang", "[Demo] Pelan misi dijana: " + plan.title);
      return plan;
    }
  },

  /* ---------- EJEN 2: PEREKA PERMAINAN ---------- */
  async designer(plan, notes, level, onStep) {
    onStep && onStep("Pereka Permainan", "Mencipta soalan, petunjuk dan jalan cerita...");
    if (plan.demo) {
      await wait(1100);
      onStep && onStep("Pereka Permainan", "[Mod Demo] 30 soalan dipilih daripada bank soalan.");
      MK.store.addLog("Ejen Pereka Permainan", "[Demo] 30 soalan disediakan dengan petunjuk dan penerangan.");
      return { questionIds: MK.QUESTIONS.map(q => q.id), questions: [] };
    }
    const out = await MK.llm(BASE_SYS + " Peranan anda: EJEN PEREKA PERMAINAN.",
      `Pelan misi:\n${JSON.stringify(plan)}\nTahap pelajar: ${level}\nNota guru:\n${(notes || "").slice(0, 8000)}\n\n` +
      `Hasilkan 15 soalan aneka pilihan (3 setiap kemahiran, pelbagai kesukaran). Pulangkan JSON:\n` +
      `{"questions":[{"q":"soalan","o":["A","B","C","D"],"a":indeks_jawapan_betul_0_hingga_3,"s":"id kemahiran","d":kesukaran_-1.5_hingga_1.5,` +
      `"m":{"indeks_pilihan_salah":"id miskonsepsi daripada pelan"},"h":"petunjuk ringkas","e":"penerangan jawapan"}]}\n` +
      `Pastikan setiap pilihan salah dipetakan kepada miskonsepsi yang sesuai jika berkaitan.`);
    const qs = (out.questions || []).map((q, i) => ({
      id: "G" + Date.now().toString(36) + i, s: q.s, d: Number(q.d) || 0, q: q.q, o: q.o, a: Number(q.a) || 0,
      m: q.m || {}, h: q.h || "", e: q.e || ""
    })).filter(q => q.q && Array.isArray(q.o) && q.o.length >= 2);
    onStep && onStep("Pereka Permainan", qs.length + " soalan dijana.");
    MK.store.addLog("Ejen Pereka Permainan", qs.length + " soalan baharu dijana untuk \"" + plan.title + "\"");
    return { questionIds: qs.map(q => q.id), questions: qs };
  },

  /* ---------- EJEN 3: PENGANALISIS ---------- */
  async analyst(onStep) {
    onStep && onStep("Penganalisis", "Menganalisis corak jawapan kelas...");
    const A = MK.analytics();
    const top = A.misc.slice(0, 4);
    const weak = [...A.skillAvg].sort((a, b) => a.avg - b.avg)[0];
    const stats = { pelajar: A.students.length, jawapan: A.answers.length, kadar_betul: A.correctRate, kemahiran: A.skillAvg.map(s => ({ nama: s.name, purata_penguasaan: s.avg })), miskonsepsi: top.map(m => ({ nama: m.name, kekerapan: m.count, bil_pelajar: m.students.length })) };
    try {
      const r = await MK.llm(BASE_SYS + " Peranan anda: EJEN PENGANALISIS untuk guru.",
        `Statistik kelas:\n${JSON.stringify(stats)}\n\nPulangkan JSON: {"summary":"ringkasan 3 ayat untuk guru","actions":["3 cadangan tindakan konkrit"]}`);
      MK.store.addLog("Ejen Penganalisis", "Analisis kelas dijana oleh LLM.");
      return { ...r, top, weak };
    } catch (e) {
      if (e.message !== "DEMO") throw e;
      await wait(900);
      const summary = `Kadar jawapan betul kelas ialah ${A.correctRate}%. Kemahiran paling lemah ialah "${weak.name}" (purata penguasaan ${weak.avg}%). ` +
        (top[0] ? `Miskonsepsi paling kerap ialah "${top[0].name}" yang dikesan pada ${top[0].students.length} pelajar.` : "Tiada miskonsepsi ketara dikesan.");
      const actions = top.slice(0, 3).map(m => m.fix);
      MK.store.addLog("Ejen Penganalisis", "[Demo] " + (top[0] ? "Miskonsepsi utama: " + top[0].name : "Analisis selesai"));
      return { summary, actions, top, weak };
    }
  },

  /* ---------- EJEN 4: PENYESUAI ---------- */
  async adapter(analysis, onStep) {
    onStep && onStep("Penyesuai", "Menyediakan misi pemulihan untuk kumpulan sasaran...");
    const target = analysis.top[0];
    const bank = MK.store.questionBank();
    const id = "R" + MK.uid();
    let mission;
    try {
      const out = await MK.llm(BASE_SYS + " Peranan anda: EJEN PENYESUAI.",
        `Miskonsepsi sasaran: ${target ? target.name : "-"}\nKemahiran lemah: ${analysis.weak.name}\n` +
        `Hasilkan misi pemulihan pendek. Pulangkan JSON: {"title":"...","story":"2 ayat Sang Kancil","questions":[{"q":"","o":["","","",""],"a":0,"h":"","e":""}]} (5 soalan, mudah ke sederhana).`);
      const qs = out.questions.map((q, i) => ({ id: id + "Q" + i, s: analysis.weak.id, d: -0.6 + i * 0.3, q: q.q, o: q.o, a: Number(q.a) || 0, m: {}, h: q.h, e: q.e }));
      mission = { id, title: out.title, topic: "Pemulihan", outcomes: ["Membetulkan miskonsepsi: " + (target ? target.name : analysis.weak.name)],
        levels: [{ name: "Misi Cabaran Kedua", story: out.story, skills: [analysis.weak.id] }], questionIds: qs.map(q => q.id), questions: qs, length: qs.length };
    } catch (e) {
      if (e.message !== "DEMO") throw e;
      await wait(1000);
      let pool = bank.filter(q => target && Object.values(q.m || {}).includes(target.id));
      if (pool.length < 5) pool = pool.concat(bank.filter(q => q.s === analysis.weak.id && !pool.includes(q)));
      pool = pool.sort((a, b) => a.d - b.d).slice(0, 6);
      mission = { id, title: "Cabaran Kedua Kancil: " + (target ? target.name : analysis.weak.name), topic: "Pemulihan",
        outcomes: ["Membetulkan miskonsepsi: " + (target ? target.name : analysis.weak.name)],
        levels: [{ name: "Misi Cabaran Kedua", story: "Sang Kancil terjatuh ke dalam perangkap! Mari bantu Kancil keluar dengan memahami semula konsep ini, langkah demi langkah.", skills: [...new Set(pool.map(q => q.s))] }],
        questionIds: pool.map(q => q.id), questions: [], length: pool.length };
    }
    Object.assign(mission, { status: "pending", type: "pemulihan", createdBy: "Ejen Penyesuai", target: analysis.targetStudents || (target ? target.students : []), groupLabel: analysis.groupLabel || "", createdAt: Date.now() });
    MK.store.saveMission(mission);
    MK.store.addLog("Ejen Penyesuai", "Misi pemulihan \"" + mission.title + "\" menunggu kelulusan guru.");
    onStep && onStep("Penyesuai", "Misi pemulihan dihantar ke panel kelulusan.");
    return mission;
  }
};

/* Gabungkan kemahiran & miskonsepsi daripada misi yang dijana AI */
MK.allSkills = function () {
  const list = [...MK.SKILLS];
  MK.store.missions().forEach(m => (m.skills || []).forEach(s => { if (!list.find(x => x.id === s.id)) list.push(s); }));
  return list;
};
MK.syncMisc = function () {
  MK.store.missions().forEach(m => (m.misconceptions || []).forEach(x => { if (!MK.MISCONCEPTIONS[x.id]) MK.MISCONCEPTIONS[x.id] = { name: x.name, fix: x.fix }; }));
};
