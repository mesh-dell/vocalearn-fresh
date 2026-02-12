"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@repo/ui/card";
import { useAuth } from "@/Context/useAuth";
import { getNotificationsAPI } from "@/Services/NotificationService";
import { Notification } from "@/Models/Notification";

export default function NotificationsPage() {
  const { token } = useAuth();
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

  // Helper function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

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
            <Card 
              key={index}
              className={!notif.read ? "border-l-4 border-l-primary" : ""}
            >
              <CardContent className="p-5 space-y-1">
                <div className="flex items-start justify-between gap-4">
                  <p className={`font-semibold ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                    {notif.messages}
                  </p>
                  {!notif.read && (
                    <span className="flex h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{notif.courseName}</span>
                  <span>•</span>
                  <span>{notif.className}</span>
                  <span>•</span>
                  <span>{formatDate(notif.sentAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
