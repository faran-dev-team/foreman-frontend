/* eslint-disable no-undef */
// Service worker for Firebase Cloud Messaging (FCM)
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Initialize Firebase App in Service Worker context using URL query parameters or fallback
const urlParams = new URLSearchParams(self.location.search);

const firebaseConfig = {
  apiKey: urlParams.get("apiKey") || "",
  authDomain: urlParams.get("authDomain") || "",
  projectId: urlParams.get("projectId") || "",
  storageBucket: urlParams.get("storageBucket") || "",
  messagingSenderId: urlParams.get("messagingSenderId") || "",
  appId: urlParams.get("appId") || "",
};

if (firebase.apps.length === 0 && firebaseConfig.apiKey) {
  firebase.initializeApp(firebaseConfig);
}

try {
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message:", payload);

    const notificationTitle =
      payload.notification?.title || payload.data?.title || "Foreman Notification";
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || "New update received.",
      icon: payload.notification?.icon || "/foreman-app-icon-512.png",
      badge: "/foreman-app-icon-512.png",
      data: payload.data || {},
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (err) {
  console.error("[firebase-messaging-sw.js] Error initializing messaging service worker:", err);
}
