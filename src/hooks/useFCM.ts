"use client";

import { useEffect, useState, useCallback } from "react";
import { getToken, deleteToken, onMessage, MessagePayload } from "firebase/messaging";
import { getMessagingInstance } from "@/lib/firebase";
import {
  registerDeviceToken,
  unregisterDeviceToken,
} from "@/lib/api/device";
import { useAuth } from "@clerk/nextjs";

export interface FCMNotificationPayload {
  title?: string;
  body?: string;
  icon?: string;
  data?: Record<string, string>;
}

export function useFCM() {
  const { getToken: getClerkToken, isSignedIn, isLoaded } = useAuth();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [foregroundNotification, setForegroundNotification] =
    useState<FCMNotificationPayload | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const registerServiceWorker = useCallback(async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return null;
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
      const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "";
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";
      const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
      const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "";
      const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "";

      const swUrl = `/firebase-messaging-sw.js?apiKey=${encodeURIComponent(
        apiKey,
      )}&authDomain=${encodeURIComponent(authDomain)}&projectId=${encodeURIComponent(
        projectId,
      )}&storageBucket=${encodeURIComponent(
        storageBucket,
      )}&messagingSenderId=${encodeURIComponent(
        messagingSenderId,
      )}&appId=${encodeURIComponent(appId)}`;

      const registration = await navigator.serviceWorker.register(swUrl);
      return registration;
    } catch (err) {
      console.error("[useFCM] Failed to register FCM service worker:", err);
      return null;
    }
  }, []);

  const requestPermissionAndRegister = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("[useFCM] Notifications not supported in this environment.");
      return null;
    }

    try {
      setIsRegistering(true);

      const currentPermission = await Notification.requestPermission();
      setPermission(currentPermission);

      if (currentPermission !== "granted") {
        console.warn("[useFCM] Notification permission was not granted.");
        setIsRegistering(false);
        return null;
      }

      const messaging = await getMessagingInstance();
      if (!messaging) {
        setIsRegistering(false);
        return null;
      }

      const swRegistration = await registerServiceWorker();
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

      const token = await getToken(messaging, {
        vapidKey: vapidKey || undefined,
        serviceWorkerRegistration: swRegistration || undefined,
      });

      if (token) {
        setFcmToken(token);
        console.log("%c🔥 FIREBASE FCM TOKEN:", "color: #f59e0b; font-weight: bold; font-size: 14px;", token);

        // Sync with backend if signed in
        if (isSignedIn) {
          try {
            const clerkToken = await getClerkToken();
            await registerDeviceToken(token, clerkToken);
            console.log("[useFCM] Device token successfully registered with backend.");
          } catch (apiErr) {
            console.error("[useFCM] Error registering token with backend:", apiErr);
          }
        }
      }

      setIsRegistering(false);
      return token;
    } catch (error) {
      console.error("[useFCM] Error obtaining FCM device token:", error);
      setIsRegistering(false);
      return null;
    }
  }, [getClerkToken, isSignedIn, registerServiceWorker]);

  const unsubscribe = useCallback(async () => {
    try {
      setIsRegistering(true);
      const tokenToRemove = fcmToken;

      if (tokenToRemove && isSignedIn) {
        try {
          const clerkToken = await getClerkToken();
          await unregisterDeviceToken(tokenToRemove, clerkToken);
        } catch (apiErr) {
          console.error("[useFCM] Error unregistering token with backend:", apiErr);
        }
      }

      const messaging = await getMessagingInstance();
      if (messaging) {
        await deleteToken(messaging);
      }
      setFcmToken(null);
      setIsRegistering(false);
      console.log("[useFCM] Unsubscribed from push notifications.");
      return true;
    } catch (err) {
      console.error("[useFCM] Error unsubscribing from FCM:", err);
      setIsRegistering(false);
      return false;
    }
  }, [fcmToken, getClerkToken, isSignedIn]);

  // Listen for foreground notifications
  useEffect(() => {
    let unsubListener: (() => void) | undefined;

    const setupForegroundListener = async () => {
      const messaging = await getMessagingInstance();
      if (!messaging) return;

      unsubListener = onMessage(messaging, (payload: MessagePayload) => {
        console.log("[useFCM] Received foreground message:", payload);

        const notif: FCMNotificationPayload = {
          title: payload.notification?.title || payload.data?.title || "Notification",
          body: payload.notification?.body || payload.data?.body || "",
          icon: payload.notification?.icon || payload.data?.icon || "/foreman-app-icon-512.png",
          data: payload.data as Record<string, string> | undefined,
        };

        setForegroundNotification(notif);
      });
    };

    setupForegroundListener();

    return () => {
      if (unsubListener) unsubListener();
    };
  }, []);

  // Auto-request or register if permission is already granted when user signs in
  useEffect(() => {
    if (isLoaded && isSignedIn && permission === "granted" && !fcmToken && !isRegistering) {
      requestPermissionAndRegister();
    }
  }, [isLoaded, isSignedIn, permission, fcmToken, isRegistering, requestPermissionAndRegister]);

  return {
    fcmToken,
    permission,
    foregroundNotification,
    isRegistering,
    requestPermission: requestPermissionAndRegister,
    unsubscribe,
    clearNotification: () => setForegroundNotification(null),
  };
}
