import { Reminder } from "@/types/reminder";
import {
  LocalNotifications,
  ScheduleEvery,
} from "@capacitor/local-notifications";

export async function scheduleNotification(reminder: Reminder) {
  try {
    if (
      !reminder ||
      !reminder.datetime ||
      !reminder.title ||
      !reminder.id ||
      !reminder.repeatMode
    ) {
      throw new Error("Invalid reminder data");
    }

    const schedule = getNotificationSchedule(reminder);

    await LocalNotifications.schedule({
      notifications: [
        {
          id: reminder.id,
          title: "Reminder",
          body: reminder.title,
          schedule: schedule,
          extra: { reminderId: reminder.id },
        },
      ],
    });
  } catch (error) {
    alert(`Error scheduling notification: ${error instanceof Error ? error.message : "Unknown error"}`);
    console.error("Notification scheduling error:", error);
  }
}

export async function cancelNotification(id: number) {
  await LocalNotifications.cancel({ notifications: [{ id }] });
}

export async function listPendingNotifications() {
  const pending = await LocalNotifications.getPending();
  for (const notification of pending.notifications) {
    alert(
      `Pending Notification: ${notification.id} - ${
        notification.title
      } at ${new Date(notification.schedule?.at ?? "").toLocaleString()}`
    );
  }
}

function getNotificationSchedule(reminder: Reminder) {
  const date = new Date(reminder.datetime);

  switch (reminder.repeatMode) {
    case "minutely":
      return {
        repeats: true,
        every: "minute" as ScheduleEvery,
        at: date,
      };
    case "daily":
      return {
        repeats: true,
        every: "day" as ScheduleEvery,
        at: date,
      };
    case "weekly":
      return {
        repeats: true,
        every: "week" as ScheduleEvery,
        at: date,
      };
    case "monthly":
      return {
        repeats: true,
        every: "month" as ScheduleEvery,
        at: date,
      };
    case "yearly":
      return {
        repeats: true,
        every: "year" as ScheduleEvery,
        at: date,
      };
    case "none":
      return { at: date };
    default:
      throw new Error("Invalid repeat mode");
  }
}
