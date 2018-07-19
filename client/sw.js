importScripts(
  'https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval-iife.min.js' //Src: https://www.npmjs.com/package/idb-keyval
);

const staticCache = 'mws-p1-static-cache-1';
const dynamicCache = 'mws-p1-dynamic-cache-1';
const staticUrlsToCache = [
  './',
  'index.html',
  'css/styles.css',
  'css/leaflet.css',
  'js/main.js',
  'js/dbhelper.js',
  '404.html',
  'offline.html',
  'restaurant.html',
  'js/idb-keyval-iife.min.js',
  'js/leaflet.js',
  'css/images/marker-icon.png',
  'css/images/marker-shadow.png'
];

const cacheStaticRessources = async () => {
  const cache = await caches.open(staticCache);
  try {
    await cache.addAll(staticUrlsToCache);
    console.log('cached static ressources');
  } catch (error) {
    console.log(`An error happened during static assets caching: ${error}`); //TODO: better error handling and more detailed error
  }
};

/**
 * @param {RequestInfo} request
 */
const useRessourceStrategy = async request => {
  try {
    /**
     * @type {Response | undefined}
     */
    const response = await caches.match(request);
    if (response) {
      //if in cache use cache
      return response;
    } else {
      //if not in cache try to fetch using internet
      const fetchResponse = await fetch(request);
      //if response 404 (does not exist)
      if (fetchResponse.status === 404) {
        // use offline fallback page
        /**
         * @type {Response | undefined}
         */
        const fallbackPage = await caches.match('404.html');
        return fallbackPage;
      } else {
        addRessourceToDynamicCache(request, fetchResponse.clone());
        return fetchResponse;
      }
    }
  } catch (error) {
    console.log(error);

    /**
     * @type {Response | undefined}
     */
    const offlinePage = await caches.match('offline.html');
    return offlinePage;
  }
};

/**
 * @param {RequestInfo} request
 */
const addRestaurantDataToDB = async request => {
  console.log('trying to add response of restaurant to db');
  const res = await fetch(request.url);
  if (res.ok) {
    const restaurantData = await res.json();
    idbKeyval.set('restaurantsData', restaurantData.restaurants);
  }
};

/**
 * @param {RequestInfo} request
 * @param {Response} res
 */
const addRessourceToDynamicCache = async (request, res) => {
  try {
    const dynCache = await caches.open(dynamicCache);
    dynCache.put(request, res);
  } catch (error) {
    console.log(error);
  }
};

self.addEventListener('install', (/** @type {ExtendableEvent} */ event) => {
  console.log('SW: Install Event');
  event.waitUntil(cacheStaticRessources());
});

self.addEventListener('activate', (/** @type {Event} */ event) => {
  console.log('SW: Activate Event');
});

self.addEventListener('fetch', (/** @type {FetchEvent} */ event) => {
  if (event.request.url.endsWith('/restaurants')) {
    addRestaurantDataToDB(event.request.clone());
    event.respondWith(fetch(event.request));
  }
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(useRessourceStrategy(event.request));
  }
});
