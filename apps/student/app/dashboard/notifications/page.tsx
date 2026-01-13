"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@repo/ui/card";
import { useAuth } from "@/Context/useAuth";
import { getNotificationsAPI } from "@/Services/NotificationService";
import { Notification } from "@/Models/Notification";

export default function NotificationsPage() {
  const { token } = useAuth(); // assuming token is stored here
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchNotifications = async () => {
      setLoading(true);
      const res = await getNotificationsAPI(token);
      if (res) setNotifications(res);
      setLoading(false);
    };

    fetchNotifications();
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with course and class activity
        </p>
      </header>

      {/* Content */}
      {loading ? (
        <p className="text-muted-foreground">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-muted-foreground">You have no notifications.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif, index) => (
            <Card key={index}>
              <CardContent className="p-5 space-y-1">
                <p className="font-semibold text-foreground">{notif.message}</p>
                <p className="text-sm text-muted-foreground">
                  {notif.courseName} • {notif.className}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
