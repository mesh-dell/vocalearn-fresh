export interface Notification {
  className: string;
  courseName: string;
  sentAt: string;   // ISO date string
  messages: string; // backend uses "messages"
  read: boolean;
}

