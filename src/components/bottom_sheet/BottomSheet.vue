<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, onUnmounted } from "vue";
import { useReminderStore } from "@/stores/reminders";
import AppButton from "@/components/buttons/AppButton.vue";
import type { Reminder } from "@/types/reminder";

const props = defineProps<{
  isSheetOpen: boolean;
  editingReminder?: Reminder | null;
}>();
const emit = defineEmits(["close"]);
const closeSheet = () => emit("close");

const newReminder = ref({
  title: "",
  datetime: "",
  repeatMode: "none" as "none" | "daily" | "weekly",
});

const reminderStore = useReminderStore();

// Form related refs
const hiddenDateInput = ref<HTMLInputElement | null>(null);
const selectedDate = ref("");
const displayDate = ref("");

// Watch for editing reminder changes
watch(
  () => props.editingReminder,
  (newEditingReminder) => {
    if (newEditingReminder) {
      // Mode édition : pré-remplir les champs
      newReminder.value.title = newEditingReminder.title;
      newReminder.value.datetime = newEditingReminder.datetime;
      newReminder.value.repeatMode = newEditingReminder.repeatMode as "none" | "daily" | "weekly";
      selectedDate.value = newEditingReminder.datetime;
      updateDisplayDate();
    } else {
      // Mode création : vider les champs
      clearReminder();
    }
  },
  { immediate: true }
);

function addReminder() {
  if (!newReminder.value.title || !newReminder.value.datetime) {
    alert("Veuillez remplir tous les champs avant de continuer.");
    return;
  }
  if (props.editingReminder) {
    // Mode édition
    reminderStore.updateReminder(
      props.editingReminder.id,
      newReminder.value.title,
      newReminder.value.datetime,
      newReminder.value.repeatMode
    );
  } else {
    // Mode création
    reminderStore.addReminder(
      newReminder.value.title,
      newReminder.value.datetime,
      newReminder.value.repeatMode
    );
  }
  closeSheet();
}

function handleCancel() {
  clearReminder();
  closeSheet();
}

function clearReminder() {
  newReminder.value = {
    title: "",
    datetime: "",
    repeatMode: "none",
  };
  selectedDate.value = "";
  displayDate.value = "";
}

function openDatePicker() {
  hiddenDateInput.value?.showPicker?.();
  hiddenDateInput.value?.click();
}

function updateDisplayDate() {
  if (selectedDate.value) {
    const date = new Date(selectedDate.value);
    displayDate.value = date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    newReminder.value.datetime = selectedDate.value;
  }
}

// Cleanup on unmount
onUnmounted(() => {
  clearReminder();
});
</script>

<template>
  <transition name="slide-up">
    <div v-if="isSheetOpen" class="bottom-sheet">
      <div class="sheet-content">
        <input
          v-model="newReminder.title"
          type="text"
          placeholder="Titre de la tâche"
          class="custom-input"
        />
        <input
          type="text"
          v-model="displayDate"
          placeholder="01/01/1970 09:00"
          class="custom-input"
          readonly
          @click="openDatePicker"
        />
        <input
          ref="hiddenDateInput"
          type="datetime-local"
          v-model="selectedDate"
          @change="updateDisplayDate"
          style="display: none"
        />
        <select v-model="newReminder.repeatMode" class="custom-input-select">
          <option value="none">Aucune répétition</option>
          <option value="minutely">Chaque minute</option>
          <option value="daily">Quotidienne</option>
          <option value="weekly">Hebdomadaire</option>
          <option value="monthly">Mensuelle</option>
          <option value="yearly">Annuelle</option>
        </select>
        <div class="row">
          <app-button color="white" :text="'Annuler'" @click="handleCancel" class="button-size" />
          <app-button
            color="red"
            :text="props.editingReminder ? 'Modifier' : 'Créer'"
            @click="addReminder"
            class="button-size"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f9f2f2;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  z-index: 200;
  max-height: 50%;
  overflow-y: auto;
  padding: 20px;
}

.sheet-content {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  text-align: center;
}

.button-size {
  width: 100px;
}

.custom-input {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  font-size: 16px;
  color: #333;
  outline: none;
  transition: box-shadow 0.2s ease;
}

.custom-input::placeholder {
  color: #999;
}

.custom-input:focus {
  box-shadow: 0 0 0 2px rgba(248, 0, 47, 0.2);
  background-color: #fff;
}

.custom-input-select:focus {
  box-shadow: 0 0 0 2px rgba(248, 0, 47, 0.2);
  background-color: #fff;
}

.custom-input-select {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  font-size: 16px;
  color: #333;
  outline: none;
  transition: box-shadow 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg fill='gray' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}
</style>
