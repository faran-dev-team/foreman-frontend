"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useFCM, FCMNotificationPayload } from "@/hooks/useFCM";
import { Bell, X } from "lucide-react";

interface NotificationContextType {
  fcmToken: string | null;
  permission: NotificationPermission;
  foregroundNotification: FCMNotificationPayload | null;
  isRegistering: boolean;
  requestPermission: () => Promise<string | null>;
  unsubscribe: () => Promise<boolean>;
  clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  fcmToken: null,
  permission: "default",
  foregroundNotification: null,
  isRegistering: false,
  requestPermission: async () => null,
  unsubscribe: async () => false,
  clearNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const fcm = useFCM();
  const { foregroundNotification, clearNotification } = fcm;

  // Auto clear notification after 6 seconds
  useEffect(() => {
    if (foregroundNotification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [foregroundNotification, clearNotification]);

  return (
    <NotificationContext.Provider value={fcm}>
      {children}

      {/* Foreground Banner Notification Toast */}
      {foregroundNotification && (
        <div className="fixed top-4 right-4 z-[9999] max-w-md w-full animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-md text-zinc-100 flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              {foregroundNotification.title && (
                <h4 className="font-semibold text-sm text-zinc-100 truncate">
                  {foregroundNotification.title}
                </h4>
              )}
              {foregroundNotification.body && (
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {foregroundNotification.body}
                </p>
              )}
            </div>
            <button
              onClick={clearNotification}
              className="text-zinc-400 hover:text-zinc-200 transition-colors p-1 rounded-md hover:bg-zinc-800"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
