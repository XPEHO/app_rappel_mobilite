<script setup lang="ts">
import { ref, onMounted } from "vue";
import { LocalNotifications, PermissionStatus } from "@capacitor/local-notifications";
import { loadReminders } from "@/local_storage/reminder_service";
import type { Reminder } from "@/types/reminder";
import ButtonTextSized from "@/components/buttons/ButtonTextSize.vue";
import { BUTTONCOLORS } from "@/constants/componentsSettings.enum";

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
  <div style="display: flex; justify-content: center; margin-top: 16px;">
    <ButtonTextSized :text="'Create new task'" type="submit" />
  </div>
</template>
