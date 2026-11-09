/* Service worker: membolehkan aplikasi dibuka tanpa internet (Mod Demo) */
const CACHE = "misikelas-v2";
const FILES = ["./", "./index.html", "./css/style.css", "./manifest.json", "./icons/icon.svg", "./icons/icon-192.png", "./icons/icon-512.png",
  "./js/config.js", "./js/data.js", "./js/core.js", "./js/agents.js", "./js/avatar.js", "./js/auth.js", "./js/admin.js", "./js/teacher.js", "./js/student.js", "./js/app.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  // API AI dan Firebase sentiasa melalui rangkaian
  if (/googleapis\.com\/v1beta|anthropic\.com|firebaseio\.com/.test(url.href)) return;
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
