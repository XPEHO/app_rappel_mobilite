<script setup>
import { defineProps, defineEmits, onMounted, onUnmounted, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPen, faXmark } from "@fortawesome/free-solid-svg-icons";

defineProps({
  visible: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "edit", "delete"]);

const popupRef = ref(null);

function close() {
  emit("close");
}

function editTask() {
  emit("edit");
  close();
}

function deleteTask() {
  emit("delete");
  close();
}

function handleClickOutside(event) {
  if (popupRef.value && !popupRef.value.contains(event.target)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="task-tile-popup" v-if="visible" ref="popupRef">
    <div class="task-tile-popup-option">
      <font-awesome-icon :icon="faPen" style="color: var(--accent-color)" />
      <button @click="editTask">Modifier le rappel</button>
    </div>
    <div class="task-tile-popup-option">
      <font-awesome-icon :icon="faXmark" style="color: var(--accent-color)" />
      <button @click="deleteTask">Supprimer le rappel</button>
    </div>
  </div>
</template>

<style scoped>
.task-tile-popup {
  background: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
  border-radius: 12px;
  position: absolute;
  right: 0;
  transform: translateY(8px);
}

.task-tile-popup-option {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: var(--element-gap);
}

button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: var(--primary-font-family);
  font-size: var(--font-size-normal);
  font-weight: var(--font-weight-regular);
}
</style>
