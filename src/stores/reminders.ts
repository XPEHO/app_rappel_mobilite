import { ref} from "vue";
import { defineStore } from "pinia";
import { loadReminders, saveReminders } from "@/local_storage/reminder_service";
import { PermissionStatus } from "@capacitor/local-notifications";
import {
  scheduleNotification,
  cancelNotification,
} from "@/notification/notification_service";
import { Reminder } from "@/types/reminder";

export const useReminderStore = defineStore("reminder", () => {
  const reminders = ref<Reminder[]>([]);
  const remindersByDate = ref<{ [key: string]: Reminder[] }>({});
  const permission = ref<PermissionStatus>();

  function addReminder(title: string, date: string, repeatMode: Reminder["repeatMode"]) {
    const id = Date.now() % 2147483647;
    const reminder = new Reminder(id, title, date, repeatMode);
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

  function updateReminder(id: number, title: string, date: string, repeatMode: Reminder["repeatMode"]) {
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

  function setPermission(status: PermissionStatus) {
    permission.value = status;
  }

  function init() {
    reminders.value = loadReminders();

    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    const grouped: { [key: string]: Reminder[] } = {};

    reminders.value.forEach((reminder) => {
      const reminderDate = new Date(reminder.datetime);

      let key: string;

      if (reminderDate.getDate() === today.getDate()) {
        key = `Aujourd'hui, ${reminderDate.getDate().toString().padStart(2, "0")}/${(
          reminderDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}`;
      } else if (reminderDate.getDate() === tomorrow.getDate()) {
        key = `Demain, ${reminderDate.getDate().toString().padStart(2, "0")}/${(
          reminderDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}`;
      } else if (reminderDate.getDate() >= nextWeekStart.getDate()) {
        key = "La semaine prochaine";
      } else {
        key = `${reminderDate.getDate().toString().padStart(2, "0")}/${(reminderDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(reminder);
    });

    remindersByDate.value = grouped;
    return remindersByDate;
  }

  function save() {
    saveReminders(reminders.value);
    init();
  }

  function getReminderById(id: number) {
    return reminders.value.find(r => r.id === id);
  }

  return {
    remindersByDate,
    reminders,
    addReminder,
    deleteReminder,
    updateReminder,
    getReminderById,
    setPermission,
    init
  };
});
