import { Reminder } from "@/types/reminder";
import {
  isDateBeforeToday,
  isDateInNextWeek,
  isDateThisWeek,
  isSameDay,
  plusOneDay,
} from "@/utils/date_utils";

export function saveReminders(reminders: Reminder[]) {
  localStorage.setItem("reminders", JSON.stringify(reminders));
}

export function loadReminders(): Reminder[] {
  const stored = localStorage.getItem("reminders");
  if (!stored) return [];

  const plainObjects = JSON.parse(stored);
  const reminders = plainObjects.map(
    (obj: any) => new Reminder(obj.id, obj.title, obj.datetime, obj.repeatMode)
  );
  const sortedReminders = reminders.sort(
    (a: Reminder, b: Reminder) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );
  return sortedReminders;
}

export function groupRemindersByDate(reminders: Reminder[]): { [key: string]: Reminder[] } {
  const grouped: { [key: string]: Reminder[] } = {};

  const today = new Date();
  const tomorrow = plusOneDay(today);

  for (const reminder of reminders) {
    const reminderDate = new Date(reminder.datetime);

    let key: string;

    if (isDateBeforeToday(reminderDate)) {
      key = "En retard";
    } else if (isSameDay(reminderDate, today)) {
      key = `Aujourd'hui, ${reminderDate.getDate().toString().padStart(2, "0")}/${(
        reminderDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;
    } else if (isSameDay(reminderDate, tomorrow)) {
      key = `Demain, ${reminderDate.getDate().toString().padStart(2, "0")}/${(
        reminderDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;
    } else if (isDateThisWeek(reminderDate)) {
      key = `${reminderDate.getDate().toString().padStart(2, "0")}/${(reminderDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    } else if (isDateInNextWeek(reminderDate)) {
      key = "La semaine prochaine";
    } else {
      key = "À venir";
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(reminder);
  }

  return grouped;
}
