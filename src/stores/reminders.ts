import { ref } from "vue";
import { defineStore } from "pinia";
import {
  groupRemindersByDate,
  loadReminders,
  saveReminders,
} from "@/local_storage/reminder_service";
import { PermissionStatus } from "@capacitor/local-notifications";
import { scheduleNotification, cancelNotification } from "@/notification/notification_service";
import { Reminder } from "@/types/reminder";

export const useReminderStore = defineStore("reminder", () => {
  const reminders = ref<Reminder[]>([]);
  const remindersByDate = ref<{ [key: string]: Reminder[] }>({});
  const permission = ref<PermissionStatus>();

  function addReminder(title: string, date: string, repeatMode: Reminder["repeatMode"]) {
    const reminder = new Reminder(null, title, date, repeatMode);
    reminders.value.push(reminder);
    save();
    if (permission.value && permission.value.display === "granted") {
      scheduleNotification(reminder);
    } else {
      alert("Vous n'avez pas autorisé les notifications.");
    }
  }

  function deleteReminder(id: number) {
    reminders.value = reminders.value.filter((r) => r.id !== id);
    save();
    cancelNotification(id);
  }

  function updateReminder(
    id: number,
    title: string,
    date: string,
    repeatMode: Reminder["repeatMode"]
  ) {
    const reminderIndex = reminders.value.findIndex((r) => r.id === id);
    if (reminderIndex !== -1) {
      // Cancel the old notification
      cancelNotification(id);

      // Update the reminder
      reminders.value[reminderIndex].title = title;
      reminders.value[reminderIndex].datetime = date;
      reminders.value[reminderIndex].repeatMode = repeatMode;

      save();

      // Schedule new notification
      if (permission.value && permission.value.display === "granted") {
        scheduleNotification(reminders.value[reminderIndex]);
      }
    }
  }

  function completeReminder(id: number) {
    const reminderIndex = reminders.value.findIndex((r) => r.id === id);
    if (reminderIndex !== -1) {
      // Cancel the old notification
      cancelNotification(id);

      // Retrieve the reminder and delete the old one
      const reminder = reminders.value[reminderIndex];
      deleteReminder(id);

      // Create a new reminder with the updated date
      const nextDate = reminder.getNextOccurrence();
      if (!nextDate) {
        return; // No repeat, so nothing more to do
      }
      const newReminder = new Reminder(
        null,
        reminder.title,
        nextDate.toISOString(),
        reminder.repeatMode
      );
      reminders.value.push(newReminder);

      // Save changes
      save();

      // Schedule new notification
      if (permission.value && permission.value.display === "granted") {
        scheduleNotification(newReminder);
      }
    }
  }

  function setPermission(status: PermissionStatus) {
    permission.value = status;
  }

  function init() {
    reminders.value = loadReminders();
    remindersByDate.value = groupRemindersByDate(reminders.value);
    return remindersByDate;
  }

  function save() {
    saveReminders(reminders.value);
    init();
  }

  function getReminderById(id: number) {
    return reminders.value.find((r) => r.id === id);
  }

  return {
    remindersByDate,
    reminders,
    addReminder,
    deleteReminder,
    updateReminder,
    completeReminder,
    getReminderById,
    setPermission,
    init,
  };
});
