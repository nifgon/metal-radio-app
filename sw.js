const CACHE = 'metal-radio-v2';
const STATIC = ['/metal-radio-app/', '/metal-radio-app/index.html', '/metal-radio-app/bg.png', '/metal-radio-app/cover.png', '/metal-radio-app/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Аудиопоток и API не кэшируем — всегда сеть
  if (url.hostname.includes('myradio24')) return;

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
