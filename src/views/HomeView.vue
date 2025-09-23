<script setup lang="ts">
import { ref, onMounted } from "vue";
import { LocalNotifications, PermissionStatus } from "@capacitor/local-notifications";
import { loadReminders, saveReminders } from "@/local_storage/reminder_service";
import {
  scheduleNotification,
  cancelNotification,
  listPendingNotifications,
} from "@/notification/notification_service";
import { Reminder } from "@/types/reminder";
import TaskTile from "@/components/TaskTile.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import AppButton from "@/components/buttons/AppButton.vue";

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
  const reminder = new Reminder(
    id,
    newReminder.value.title,
    newReminder.value.datetime,
    newReminder.value.repeatMode
  );
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
  <h1>Remembrall</h1>

  <div class="task-empty" v-if="reminders.length === 0">
    <font-awesome-icon :icon="faCheckCircle" style="color: var(--accent-color)" />
  </div>

  <h2>This day, Sat. 6 jun</h2>
  <div class="task-list">
    <task-tile
      v-for="reminder in reminders"
      :key="reminder.id"
      :id="reminder.id"
      :title="reminder.title"
      :date="reminder.getTimeString()"
    />
  </div>

  <h2>Tomorrow, Sun. 7 jun</h2>
  <div class="task-list">
    <task-tile :id="1" title="Tondre la pelouse" date="11h20" />
    <task-tile :id="2" title="Faire les courses" date="14h00" />
    <task-tile :id="3" title="Réunion avec l'équipe" date="16h30" />
  </div>

  <h2>Next week</h2>
  <div class="task-list">
    <task-tile :id="1" title="Tondre la pelouse" date="Mon. 8 Jun" />
    <task-tile :id="2" title="Faire les courses" date="Tue. 9 Jun" />
    <task-tile :id="3" title="Réunion avec l'équipe" date="Thu. 11 Jun" />
  </div>
  <!--<div>
    <input v-model="newReminder.title" placeholder="Title" />
    <input v-model="newReminder.datetime" type="datetime-local" />
    <select v-model="newReminder.repeatMode">
      <option
        v-for="mode in ['minutely', 'daily', 'weekly', 'monthly', 'yearly', 'none']"
        :key="mode"
        :value="mode"
      >
        {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
      </option>
    </select>

    <ul>
      <li v-for="reminder in reminders" :key="reminder.id">
        {{ reminder.title }} - {{ reminder.datetime }}
        <button @click="deleteReminder(reminder.id)">Delete</button>
      </li>
    </ul>
    <button @click="listPendingNotifications()">
      Show Pending Notifications
    </button>
  </div>-->

  <div class="bottom-action-bar">
    <app-button :text="'Create new task'" />
  </div>
</template>

<style scoped>
h1 {
  font-family: var(--primary-font-family);
  font-size: var(--font-size-xlarge);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  background: linear-gradient(to right, #000c14, #f8002f 70%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

h2 {
  font-family: var(--primary-font-family);
  font-size: var(--font-size-large);
  font-weight: var(--font-weight-bold);
  width: 100%;
  text-align: left;
}

.task-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: var(--element-gap);
}

.task-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  color: var(--color-background-soft);
}

.task-empty svg {
  font-size: 80px;
}

.bottom-action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
  min-height: 80px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
