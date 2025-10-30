<script setup lang="ts">
import { ref, onMounted } from "vue";
import { LocalNotifications } from "@capacitor/local-notifications";
import TaskTile from "@/components/TaskTile.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import AppButton from "@/components/buttons/AppButton.vue";
import { useReminderStore } from "@/stores/reminders";
import BottomSheet from "@/components/bottom_sheet/BottomSheet.vue";
import type { Reminder } from "@/types/reminder";

const reminderStore = useReminderStore();

const isSheetOpen = ref(false);
const editingReminder = ref<Reminder | null>(null);

function openSheet() {
  editingReminder.value = null;
  isSheetOpen.value = true;
}

function openEditSheet(task: { id: number; title: string; date: string }) {
  editingReminder.value = reminderStore.getReminderById(task.id) || null;
  isSheetOpen.value = true;
}

function closeSheet() {
  isSheetOpen.value = false;
  editingReminder.value = null;
}

function handleTaskDone(task: { id: number; title: string; date: string }) {
  reminderStore.deleteReminder(task.id);
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
      <p>
        <span>Tout est terminé ici !</span><br />
      </p>
    </div>

    <div class="task-section" :key="key" v-for="(reminders, key) in reminderStore.remindersByDate">
      <h2>{{ key }}</h2>
      <div class="task-list">
        <task-tile v-for="reminder in reminders" :key="reminder.id" :id="reminder.id" :title="reminder.title"
          :date="reminder.getTimeString()"
          @task-done="handleTaskDone"
          @edit-task="openEditSheet"
          @delete-task="reminderStore.deleteReminder(reminder.id);" />
      </div>
    </div>
  </div>

  <div class="bottom-action-bar">
    <app-button :text="'Créer une nouvelle tâche'" @click="openSheet" />
  </div>

  <BottomSheet :isSheetOpen="isSheetOpen" :editingReminder="editingReminder" @close="closeSheet"></BottomSheet>
</template>

<style scoped>
.page-content {
  padding-bottom: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: var(--section-gap);
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
  height: 50vh;
  text-align: center;
  gap: var(--element-gap);
}

.task-empty span {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-large);
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
