<script setup lang="ts">
import { ref, onMounted } from "vue";
import { LocalNotifications, PermissionStatus } from "@capacitor/local-notifications";
import { loadReminders } from "@/local_storage/reminder_service";
import type { Reminder } from "@/types/reminder";
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

</script>

<template>
  <h1>Accueil</h1>
  <p>Bienvenue sur l'application de rappel mobilité</p>
  <div class="bottom-action-bar">
    <AppButton :text="'Create new task'" />
  </div>
</template>

<style scoped>
.bottom-action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #FFFFFF;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.30);
  min-height: 80px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
