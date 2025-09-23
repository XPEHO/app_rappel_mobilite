import type { Reminder } from '@/types/reminder';

export function saveReminders(reminders: Reminder[]) {
  localStorage.setItem("reminders", JSON.stringify(reminders));
}

export function loadReminders(): Reminder[] {
  return JSON.parse(localStorage.getItem("reminders") || "[]");
}
