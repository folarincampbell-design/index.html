// Firebase Cloud Messaging service worker — receives push notifications in the background.
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyABs_RRv1g5xIfCXTg0_nXTSXTgDKz4G30",
  authDomain: "racer36-f42dc.firebaseapp.com",
  projectId: "racer36-f42dc",
  storageBucket: "racer36-f42dc.firebasestorage.app",
  messagingSenderId: "483188745779",
  appId: "1:483188745779:web:7927f80ffc553b1ecfa546"
});

const messaging = firebase.messaging();

// Show a notification when a push arrives while the app is closed/in the background.
messaging.onBackgroundMessage(function(payload) {
  const title = (payload.notification && payload.notification.title) || 'Racer #36';
  const options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});

// When the user taps the notification, focus or open the app.
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
