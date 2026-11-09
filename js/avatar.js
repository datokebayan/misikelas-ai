/* MisiKelas AI — Ejen berjasad: Sang Kancil (avatar SVG asal) + suara (Web Speech API) */
window.MK = window.MK || {};

MK.avatarSVG = function () {
  return `
<svg class="kancil" viewBox="0 0 200 200" role="img" aria-label="Sang Kancil, pemandu misi">
  <g class="k-body">
    <ellipse cx="100" cy="186" rx="52" ry="7" class="k-shadow"/>
    <path d="M62 150 q-4 28 2 34 h8 q2-16 6-30z" class="k-leg"/>
    <path d="M128 150 q6 28 0 34 h-8 q-2-16-6-30z" class="k-leg"/>
    <ellipse cx="100" cy="142" rx="46" ry="30" class="k-fur"/>
    <ellipse cx="100" cy="150" rx="28" ry="16" class="k-belly"/>
    <path d="M144 132 q16 -6 12 8 q-6 6 -14 0z" class="k-fur"/>
    <g class="k-head">
      <path d="M58 46 q-14 -34 6 -38 q12 6 10 40z" class="k-fur"/>
      <path d="M62 44 q-8 -24 3 -28 q6 6 6 30z" class="k-ear-in"/>
      <path d="M142 46 q14 -34 -6 -38 q-12 6 -10 40z" class="k-fur"/>
      <path d="M138 44 q8 -24 -3 -28 q-6 6 -6 30z" class="k-ear-in"/>
      <ellipse cx="100" cy="80" rx="46" ry="40" class="k-fur"/>
      <ellipse cx="100" cy="102" rx="26" ry="18" class="k-belly"/>
      <path d="M78 52 q22 -12 44 0 q-22 -4 -44 0z" class="k-stripe"/>
      <g class="k-eyes">
        <ellipse cx="80" cy="78" rx="9" ry="11" class="k-eye"/>
        <ellipse cx="120" cy="78" rx="9" ry="11" class="k-eye"/>
        <circle cx="82" cy="75" r="3.2" class="k-glint"/>
        <circle cx="122" cy="75" r="3.2" class="k-glint"/>
      </g>
      <path d="M70 62 q10 -6 18 -2" class="k-brow"/>
      <path d="M130 62 q-10 -6 -18 -2" class="k-brow"/>
      <ellipse cx="100" cy="96" rx="7" ry="5" class="k-nose"/>
      <path class="k-mouth" d="M90 108 q10 8 20 0"/>
      <ellipse class="k-mouth-open" cx="100" cy="110" rx="7" ry="5"/>
      <circle cx="68" cy="96" r="6" class="k-cheek"/>
      <circle cx="132" cy="96" r="6" class="k-cheek"/>
    </g>
    <g class="k-sparkles">
      <path d="M30 40 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4z"/>
      <path d="M170 30 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z"/>
      <path d="M176 100 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z"/>
    </g>
    <text class="k-think" x="150" y="40">?</text>
  </g>
</svg>`;
};

MK.avatar = {
  el: null, bubble: null, recog: null,
  mount(container) {
    container.innerHTML = `<div class="avatar-wrap"><div class="avatar-stage mood-happy">${MK.avatarSVG()}</div>
      <div class="bubble" aria-live="polite"><span class="bubble-text"></span>
      <button class="icon-btn speak-toggle" title="Suara hidup/mati" aria-label="Suara hidup/mati"></button></div></div>`;
    this.el = container.querySelector(".avatar-stage");
    this.bubble = container.querySelector(".bubble-text");
    const tg = container.querySelector(".speak-toggle");
    const upd = () => tg.textContent = MK.settings.load().voice ? "🔊" : "🔇";
    upd();
    tg.onclick = () => { const s = MK.settings.load(); s.voice = !s.voice; MK.settings.save(s); upd(); if (!s.voice) speechSynthesis && speechSynthesis.cancel(); };
  },
  mood(m) {
    if (!this.el) return;
    this.el.className = "avatar-stage mood-" + m;
  },
  say(text, mood) {
    if (mood) this.mood(mood);
    if (this.bubble) this.bubble.textContent = text;
    const s = MK.settings.load();
    if (!s.voice || !("speechSynthesis" in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      const v = voices.find(v => /ms[-_]MY/i.test(v.lang)) || voices.find(v => /^ms/i.test(v.lang)) || voices.find(v => /id[-_]ID/i.test(v.lang));
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "ms-MY";
      u.rate = 1.0; u.pitch = 1.25;
      u.onstart = () => this.el && this.el.classList.add("talking");
      u.onend = () => this.el && this.el.classList.remove("talking");
      speechSynthesis.speak(u);
    } catch (e) {}
  },
  /* Pengecaman suara: pelajar menyebut "A", "B", "satu", atau sebahagian teks pilihan */
  canListen() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); },
  listen(options, onResult, onEnd) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { MK.toast("Pelayar ini tidak menyokong pengecaman suara. Cuba Chrome."); return; }
    const r = new SR();
    r.lang = "ms-MY"; r.interimResults = false; r.maxAlternatives = 3;
    r.onresult = e => {
      const said = [...e.results[0]].map(x => x.transcript.toLowerCase().trim());
      onResult(MK.avatar.matchAnswer(said, options), said[0]);
    };
    r.onerror = () => MK.toast("Suara tidak dapat dikesan. Sila cuba lagi atau sentuh jawapan.");
    r.onend = () => onEnd && onEnd();
    r.start();
    this.recog = r;
  },
  matchAnswer(saidList, options) {
    const letters = ["a", "b", "c", "d"], words = [["satu", "pertama", "ei"], ["dua", "kedua", "bi"], ["tiga", "ketiga", "si"], ["empat", "keempat", "di"]];
    for (const said of saidList) {
      const t = said.replace(/[^a-z0-9\s]/g, " ").trim();
      const tok = t.split(/\s+/);
      for (let i = 0; i < options.length; i++) {
        if (tok.includes(letters[i]) && tok.length <= 3) return i;
        if (words[i].some(w => tok.includes(w)) && tok.length <= 3) return i;
      }
      let best = -1, bestScore = 0;
      options.forEach((o, i) => {
        const ow = o.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 3);
        const hit = ow.filter(w => t.includes(w)).length / (ow.length || 1);
        if (hit > bestScore) { bestScore = hit; best = i; }
      });
      if (bestScore >= 0.4) return best;
    }
    return -1;
  }
};
