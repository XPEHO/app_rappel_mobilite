<script setup lang="ts">
import { ref, onMounted } from "vue";
import { LocalNotifications, PermissionStatus } from "@capacitor/local-notifications";
import { loadReminders, saveReminders } from "@/local_storage/reminder_service";
import {
  scheduleNotification,
  cancelNotification,
  listPendingNotifications,
} from "@/notification/notification_service";
import type { Reminder } from "@/types/reminder";

const reminders = ref<Reminder[]>(loadReminders());
const newReminder = ref<{
  title: string;
  datetime: string;
  repeatMode: "none" | "minutely" | "daily" | "weekly" | "monthly" | "yearly";
}>({
  title: "",
  datetime: "",
  repeatMode: "none",
});

let permission: PermissionStatus | null = null;

onMounted(async () => {
  // Request permissions on app start
  permission = await LocalNotifications.requestPermissions();
});

function addReminder() {
  const id = Date.now() % 2147483647;
  const reminder = { ...newReminder.value, id };
  reminders.value.push(reminder);
  saveReminders(reminders.value);
  if (permission && permission.display === "granted") {
    scheduleNotification(reminder);
  } else {
    alert("Notification permission not granted");
  }
  newReminder.value = {
    title: "",
    datetime: "",
    repeatMode: "none",
  };
}

function deleteReminder(id: number) {
  reminders.value = reminders.value.filter((r) => r.id !== id);
  saveReminders(reminders.value);
  cancelNotification(id);
}
</script>

<template>
  <h1>Accueil</h1>
  <p>Bienvenue sur l'application de rappel mobilité</p>
  <div>
    <input v-model="newReminder.title" placeholder="Title" />
    <input v-model="newReminder.datetime" type="datetime-local" />
    <select v-model="newReminder.repeatMode">
      <option
        v-for="mode in [
          'minutely',
          'daily',
          'weekly',
          'monthly',
          'yearly',
          'none',
        ]"
        :key="mode"
        :value="mode"
      >
        {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
      </option>
    </select>
    <button class="new-reminder" @click="addReminder">Add</button>

    <ul>
      <li v-for="reminder in reminders" :key="reminder.id">
        {{ reminder.title }} - {{ reminder.datetime }}
        <button @click="deleteReminder(reminder.id)">Delete</button>
      </li>
    </ul>
    <!-- See Pending Notifications in Alert Button  -->
    <button @click="listPendingNotifications()">
      Show Pending Notifications
    </button>
  </div>
</template>
