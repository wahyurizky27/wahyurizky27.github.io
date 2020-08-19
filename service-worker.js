console.log("Hello");
// # installing workbox
try {
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
  );
} catch (e) {
  console.log("importScripts error", e);
}

if (self.workbox) {
  console.log("Workbox is loaded");
} else {
  console.log("Workbox didn't load");
}

const CACHE_NAME = "seria-A-pwa";
var urlsToCache = [
  { url: "/", revision: "2" },
  { url: "/index.html", revision: "2" },
  { url: "/nav.html", revision: "2" },
  { url: "/pages/about.html", revision: "2" },
  { url: "/pages/favorite.html", revision: "2" },
  { url: "/pages/standing.html", revision: "2" },
  { url: "/pages/team.html", revision: "2" },
  { url: "/images/logo.png", revision: "2" },
  { url: "/images/logo-192x192.png", revision: "2" },
  { url: "/images/logo-512x512.png", revision: "2" },
  { url: "/css/materialize.min.css", revision: "2" },
  { url: "/css/style.css", revision: "2" },
  { url: "/js/materialize.min.js", revision: "2" },
  { url: "/js/api.js", revision: "2" },
  { url: "/js/idb.js", revision: "2" },
  { url: "/js/nav.js", revision: "2" },
  { url: "/js/sw.js", revision: "2" },
];

workbox.precaching.precacheAndRoute(urlsToCache);

// cache binary
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: "images"
  })
);

workbox.routing.registerRoute(
  new RegExp("/css/"),
  workbox.strategies.cacheFirst({
    cacheName: "styles"
  })
);

workbox.routing.registerRoute(
  new RegExp("/images/"),
  workbox.strategies.cacheFirst({
    cacheName: "images"
  })
);

// fetch link
workbox.routing.registerRoute(
  new RegExp("/#standing"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "pages"
  })
);
workbox.routing.registerRoute(
  new RegExp("/#team"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "pages"
  })
);
workbox.routing.registerRoute(
  new RegExp("/#favorite"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "pages"
  })
);
workbox.routing.registerRoute(
  new RegExp("/#about"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "pages"
  })
);

// cache footbal api
workbox.routing.registerRoute(
  new RegExp("https://api.football-data.org/v2/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "api-cache",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [200, 404]
      })
    ]
  })
);

// Menyimpan cache dari CSS Google Fonts
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "google-fonts-stylesheets"
  })
);

// Menyimpan cache untuk file font selama 1 tahun
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30
      })
    ]
  })
);

self.addEventListener("notificationclick", function(event) {
  if (!event.action) {
    // Penguna menyentuh area notifikasi diluar action
    console.log("Notification Click.");
    return;
  }
  switch (event.action) {
    case "yes-action":
      console.log("Pengguna memilih action yes.");
      // buka tab baru
      // eslint-disable-next-line no-undef
      clients.openWindow("https://google.com");
      break;
    case "no-action":
      console.log("Pengguna memilih action no");
      break;
    default:
      console.log(`Action yang dipilih tidak dikenal: '${event.action}'`);
      break;
  }
  // event.notification.close();
});

self.addEventListener("push", function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  var options = {
    body: body,
    icon: "images/logo.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
