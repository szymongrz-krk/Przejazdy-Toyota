const C='przejazdy-v2';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const u=new URL(req.url),same=u.origin===location.origin;
  if(!same&&/(^|\.)open-meteo\.com$/.test(u.hostname))return;
  const store=res=>{if(res.status===200||res.type==='opaque'){const copy=res.clone();caches.open(C).then(c=>c.put(req,copy)).catch(()=>{})}return res};
  if(same){
    e.respondWith(fetch(req).then(store).catch(()=>caches.match(req).then(h=>h||caches.match('index.html'))));
  }else{
    e.respondWith(caches.match(req).then(h=>h||fetch(req).then(store)));
  }
});
