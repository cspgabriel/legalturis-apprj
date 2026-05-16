// ============================================
// LegiRJ - Service Worker (PWA)
// ============================================

const CACHE_NAME = 'legirj-v1.1.0';
const RUNTIME_CACHE = 'legirj-runtime';

const STATIC_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './premium.html',
  './account.html',
  './styles.css',
  './premium.css',
  './app.js',
  './data.js',
  './premium.js',
  './account.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-maskable.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap'
];

// ============================================
// INSTALL - Cache de assets estáticos
// ============================================
self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cacheando assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })))
          .catch(err => console.log('[SW] Erro ao cachear:', err));
      })
      .then(() => self.skipWaiting())
  );
});

// ============================================
// ACTIVATE - Limpa caches antigos
// ============================================
self.addEventListener('activate', event => {
  console.log('[SW] Ativando...');
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== RUNTIME_CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ============================================
// FETCH - Estratégia Cache First + Network Fallback
// ============================================
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições não-GET
  if (request.method !== 'GET') return;

  // Ignora chrome-extension e adsense
  if (url.protocol === 'chrome-extension:') return;
  if (url.hostname.includes('googlesyndication') ||
      url.hostname.includes('googleadservices') ||
      url.hostname.includes('doubleclick')) return;

  // HTML: Network First (sempre busca versão atualizada)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const cloned = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, cloned));
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('./offline.html')))
    );
    return;
  }

  // Assets estáticos: Cache First
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        // Atualiza em background (stale-while-revalidate)
        fetch(request).then(response => {
          if (response && response.status === 200) {
            caches.open(RUNTIME_CACHE).then(cache => cache.put(request, response));
          }
        }).catch(() => {});
        return cached;
      }

      return fetch(request)
        .then(response => {
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }
          const cloned = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, cloned));
          return response;
        })
        .catch(() => {
          // Fallback para imagens
          if (request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚖️</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
        });
    })
  );
});

// ============================================
// PUSH NOTIFICATIONS
// ============================================
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'LegiRJ';
  const options = {
    body: data.body || 'Nova lei publicada',
    icon: './icons/icon-192.png',
    badge: './icons/icon-72.png',
    vibrate: [200, 100, 200],
    data: data.url || './',
    actions: [
      { action: 'view', title: 'Ver Lei' },
      { action: 'close', title: 'Fechar' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'close') return;
  event.waitUntil(clients.openWindow(event.notification.data || './'));
});

// ============================================
// MESSAGE - Comunicação com app
// ============================================
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
  }
});

console.log('[SW] LegiRJ Service Worker v1.0.0 carregado');
