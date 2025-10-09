import { Reminder } from "@/types/reminder";

export function saveReminders(reminders: Reminder[]) {
  localStorage.setItem("reminders", JSON.stringify(reminders));
}

export function loadReminders(): Reminder[] {
  const stored = localStorage.getItem("reminders");
  if (!stored) return [];

  const plainObjects = JSON.parse(stored);
  return plainObjects.map(
    (obj: any) => new Reminder(obj.id, obj.title, obj.datetime, obj.repeatMode)
  );
}
