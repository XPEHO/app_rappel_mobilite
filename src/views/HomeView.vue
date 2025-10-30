<script setup lang="ts">
import { ref, onMounted } from "vue";
import { LocalNotifications } from "@capacitor/local-notifications";
import TaskTile from "@/components/TaskTile.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import AppButton from "@/components/buttons/AppButton.vue";
import { useReminderStore } from "@/stores/reminders";
import BottomSheet from "@/components/bottom_sheet/BottomSheet.vue";

const reminderStore = useReminderStore();

const isSheetOpen = ref(false)

function openSheet() {
  isSheetOpen.value = true
}

function closeSheet() {
  isSheetOpen.value = false
}

// TODO: Remove these functions when not needed anymore
function addTestReminders() {
  reminderStore.addReminder("Faire les courses", "2025-10-09T09:47", "none");
  reminderStore.addReminder("Faire les course 2", "2025-10-09T18:30", "none");
  reminderStore.addReminder("Réunion avec l'équipe", "2025-10-10T10:30", "none");
  reminderStore.addReminder("Réunion avec l'équipe 2", "2025-10-10T14:30", "none");
  reminderStore.addReminder("Tondre la pelouse", "2025-10-13T09:55", "none");
  reminderStore.addReminder("Tondre la pelouse 2", "2025-10-13T13:51", "none");
  reminderStore.addReminder("Appeler le plombier", "2025-10-16T16:00", "none");
  reminderStore.addReminder("Appeler le plombier 2", "2025-10-16T16:30", "none");
  reminderStore.addReminder("Dentiste", "2025-10-20T11:15", "none");
  reminderStore.addReminder("Dentiste 2", "2025-10-20T15:45", "none");
}

// TODO: Remove this function when not needed anymore
function cleanReminders() {
  reminderStore.reminders.forEach((reminder) => {
    reminderStore.deleteReminder(reminder.id);
  });
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

    <!--TODO: Remove this button when not needed anymore-->
    <app-button :text="'Clean tasks'" @click="cleanReminders" />

    <div class="task-empty" v-if="Object.keys(reminderStore.remindersByDate).length === 0">
      <font-awesome-icon :icon="faCheckCircle" style="color: var(--accent-color)" />
      <p>
        <span>Félicitations !</span><br />
        Aucune tâche pour le moment<br />
        Cliquez sur le bouton ci-dessous pour créer une nouvelle tâche
      </p>
      <!--TODO: Remove this button when not needed anymore-->
      <app-button :text="'Add test tasks'" @click="addTestReminders" />
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
    <app-button :text="'Créer une nouvelle tâche'" @click="openSheet" />
  </div>

  <BottomSheet :isSheetOpen="isSheetOpen" @close="closeSheet"></BottomSheet>
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
