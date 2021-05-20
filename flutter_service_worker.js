'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "061c0d391810a9fa881bc28ba4c4fc48",
"index.html": "a65d5d5548f6f4daede4c7b0003228f9",
"/": "a65d5d5548f6f4daede4c7b0003228f9",
"main.dart.js": "bff50884cc561b59818f1fee0b1c6336",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "7dea94ab7d77c0d2a7e3c72b6e190bdd",
"assets/AssetManifest.json": "90477a4ef395f51dccd5a6e36bb4b263",
"assets/NOTICES": "5067a11f07436a6e2637c0655cdb59b6",
"assets/FontManifest.json": "f8ec27312bf02bf4ac4f918c39934293",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/assets/svg/akar-icons_facebook-fill.svg": "dc8eb96f3647d99d09e28632ef1ba5aa",
"assets/assets/svg/health_plan_two.svg": "d1c64bd741075fd2815f3c1b917b46ae",
"assets/assets/svg/user.svg": "18156d6df766b4dae83559c32a677ad3",
"assets/assets/svg/Vector%2520(4).svg": "1dcf75d60916da16db6d0b309f353590",
"assets/assets/svg/Vector.svg": "3c3efc30059993c769021296d1f627dc",
"assets/assets/svg/Group%252048.svg": "9fd149111f546e7a03abedee819da696",
"assets/assets/svg/Vector%2520(3).svg": "6f9c941a265334e0f2c1d3508631a418",
"assets/assets/svg/Group.svg": "266e52111dfa87c488c61621ffa548be",
"assets/assets/svg/pre%25E2%2580%25A1o.svg": "4e295ecf8e6d57c95aae75fbcb43feab",
"assets/assets/svg/fluent_doctor-20-filled.svg": "0328db21a591f17b75a63901ac5440a5",
"assets/assets/svg/Group%2520103.svg": "9d0b0ebe9d6e0ce7562665a548a138df",
"assets/assets/svg/Vector%2520(2).svg": "45eed780b4212af6dacf2c0695442e4e",
"assets/assets/svg/Vector%2520(1).svg": "f7d85cf348a84fb9444375acb4dd0148",
"assets/assets/svg/Group%2520(1).svg": "97e75761390bcc360e845d0884b7a802",
"assets/assets/svg/Group%2520121.svg": "559857a54d88d2dce1c7be4b4d75a7a9",
"assets/assets/svg/health_plan_one.svg": "559857a54d88d2dce1c7be4b4d75a7a9",
"assets/assets/svg/medico.svg": "07819e7355321389f80faedcf1f7e562",
"assets/assets/images/familia.png": "b2f438809d6a079fa360c7a631ba97cb",
"assets/assets/images/saude.png": "49818334a08ec43c5414caa4976e0423",
"assets/assets/images/instagram.png": "e43535cb6d1ebe8b61527c991788c807",
"assets/assets/images/logo_bsaude_2.png": "4cd61d4e36afface4f903fb544285802",
"assets/assets/images/logo_bsaude_1.png": "50d4f2b6442e5e232cd0ff7da4f8c555",
"assets/assets/images/health_plan_two.png": "70004bf98e4e187113a3153312841774",
"assets/assets/images/Cores.png": "990a2f2c4c1aa5c648710dc071c02e39",
"assets/assets/images/medico.png": "bf6e2dc837a200280ca4726d12a8863a",
"assets/assets/images/health_plan_one.png": "d19121fcd240dc928e077aa2d797d6de",
"assets/assets/images/linkedin.png": "a68f526fc118218cd000cc42969f8d26",
"assets/assets/images/facebook.png": "b71b8361a1afb95c513fa94275aedc36",
"assets/assets/fonts/CustomIcons.ttf": "8acc5ceffe590223eb4146452dbcc436"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
