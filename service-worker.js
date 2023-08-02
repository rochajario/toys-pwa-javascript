'use strict';

const CACHE_NAME = 'toy-static-app';
const FILES_TO_CACHE = [
    '../favicon.ico',
    '../offline.html',
    '../css/bootstrap.min.css',
    '../css/styles.css',
    '../imgs/logo.png',
    '../imgs/background01.jpg',
    '../imgs/background02.jpg',
    '../js/app.js',
    '../js/bootstrap.bundle.min.js'
]

//Service Worker Installation
self.addEventListener('install',(evt)=>{
    console.log('Installing Service Worker');
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache)=>{
            console.log('Service Worker adding static cache');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
})

//Service Worker Activation
self.addEventListener('activate', (evt)=>{
    console.log("Service Worker activating");
    evt.waitUntil(
        caches.keys().then((keyList)=>{
            return Promise.all(keyList.map((key)=>{
                if(key !== CACHE_NAME){
                    return caches.delete(key);
                }
            }))
        })
    );
    self.clients.claim();
});

//Answer offline page
self.addEventListener('fetch', (evt)=>{
    if(evt.request.mode !== 'navigate'){
        return;
    }
    evt.respondWith(
        fetch(evt.request).catch(()=>{
            return caches.open(CACHE_NAME).then((cache)=>{
                return cache.match('/offline.html')
            })
        })
    )
});