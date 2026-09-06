const CACHE_NAME = 'churuchubu-fan-v4';
const APP_SHELL=['/','/index.html','/favicon.svg','/apple-touch-icon.png','/pwa-192.png','/pwa-512.png','/favorites-v1.js','/assets/index-1ah60nyv.css','/assets/index-20260906-benefit.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE_NAME).then(x=>x.put('/index.html',c));return res}).catch(()=>caches.match('/index.html')));return}e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{const cp=res.clone();if(new URL(r.url).origin===self.location.origin)caches.open(CACHE_NAME).then(x=>x.put(r,cp));return res})))})
