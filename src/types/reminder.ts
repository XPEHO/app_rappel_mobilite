export interface Reminder {
  id: number; // Unique ID (used for notification ID too)
  title: string;
  datetime: string; // ISO format
  repeatMode: "minutely" | "daily" | "weekly" | "monthly" | "yearly" | "none";
}