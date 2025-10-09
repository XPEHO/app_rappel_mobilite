<script setup lang="ts">
import { ref, onMounted } from "vue";
import { LocalNotifications } from "@capacitor/local-notifications";
import TaskTile from "@/components/TaskTile.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import AppButton from "@/components/buttons/AppButton.vue";
import { useReminderStore } from "@/stores/reminders";

const reminderStore = useReminderStore();

const newReminder = ref<{
  title: string;
  datetime: string;
  repeatMode: "none" | "minutely" | "daily" | "weekly" | "monthly" | "yearly";
}>({
  title: "",
  datetime: "",
  repeatMode: "none",
});

function addReminder() {
  reminderStore.addReminder(
    newReminder.value.title,
    newReminder.value.datetime,
    newReminder.value.repeatMode
  );
  newReminder.value = {
    title: "",
    datetime: "",
    repeatMode: "none",
  };
}

onMounted(async () => {
  // Request permissions on app start
  reminderStore.init();
  reminderStore.setPermission(await LocalNotifications.requestPermissions());
});
</script>

<template>
  <div class="page-content">
    <h1>Remembrall</h1>

    <div class="task-empty" v-if="Object.keys(reminderStore.remindersByDate).length === 0">
      <font-awesome-icon :icon="faCheckCircle" style="color: var(--accent-color)" />
    </div>

    <div class="task-section" :key="key" v-for="(reminders, key) in reminderStore.remindersByDate">
      <h2>{{ key }}</h2>
      <div class="task-list">
        <task-tile v-for="reminder in reminders" :key="reminder.id" :id="reminder.id" :title="reminder.title"
          :date="reminder.getTimeString()" />
      </div>
    </div>
  </div>

  <div class="bottom-action-bar">
    <app-button :text="'Create new task'" @click="addReminder()" />
  </div>
</template>

<style scoped>
.page-content {
  padding-bottom: 100px;
  width: 100%;
}

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

.task-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: var(--element-gap);
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
