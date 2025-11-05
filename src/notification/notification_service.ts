import { Reminder } from "@/types/reminder";
import { LocalNotifications } from "@capacitor/local-notifications";

export async function scheduleNotification(reminder: Reminder) {
  try {
    if (!reminder?.datetime || !reminder?.title || !reminder?.id) {
      throw new Error("Invalid reminder data");
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: reminder.id,
          title: "Reminder",
          body: reminder.title,
          schedule: { at: new Date(reminder.datetime) },
          extra: { reminderId: reminder.id },
        },
      ],
    });
  } catch (error) {
    alert(
      `Error scheduling notification: ${error instanceof Error ? error.message : "Unknown error"}`
    );
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
      `Pending Notification: ${notification.id} - ${notification.title} at ${new Date(
        notification.schedule?.at ?? ""
      ).toLocaleString()}`
    );
  }
}
