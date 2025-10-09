<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import TaskTilePopup from "./TaskTilePopup.vue";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["task-done", "edit-task", "delete-task"]);

// Reactive data
const startX = ref(0);
const currentX = ref(0);
const translateX = ref(0);
const isDragging = ref(false);
const isDisappearing = ref(false);
const containerWidth = ref(0);
const longPressTimer = ref(null);
const longPressTriggered = ref(false);
const longPressDuration = ref(600); // 600ms for long press
const showPopup = ref(false);

// Template ref
const taskTileRef = ref(null);

// Methods
function updateContainerWidth() {
  if (taskTileRef.value) {
    containerWidth.value = taskTileRef.value.offsetWidth;
  }
}

function handleTouchStart(e) {
  startDrag(e.touches[0].clientX);
}

function handleTouchMove(e) {
  if (isDragging.value) {
    e.preventDefault();
    updateDrag(e.touches[0].clientX);
  }
}

function handleTouchEnd() {
  endDrag();
}

function handleMouseDown(e) {
  startDrag(e.clientX);
}

function handleMouseMove(e) {
  if (isDragging.value) {
    updateDrag(e.clientX);
  }
}

function handleMouseUp() {
  endDrag();
}

function startDrag(clientX) {
  if (isDisappearing.value) return;
  startX.value = clientX;
  currentX.value = clientX;
  isDragging.value = true;
  longPressTriggered.value = false;

  // Start long press timer
  longPressTimer.value = setTimeout(() => {
    if (isDragging.value && !hasMovedSignificantly()) {
      longPressTriggered.value = true;
      onLongPress();
    }
  }, longPressDuration.value);
}

function updateDrag(clientX) {
  currentX.value = clientX;
  const deltaX = currentX.value - startX.value;

  // Cancel long press if user has moved significantly
  if (hasMovedSignificantly()) {
    clearLongPressTimer();
  }

  // Only allow left swipe (negative values)
  if (deltaX < 0) {
    // Allow swiping the full width of the container
    translateX.value = Math.max(deltaX, -containerWidth.value);
  }
}

function endDrag() {
  if (!isDragging.value) return;

  isDragging.value = false;
  clearLongPressTimer();

  const deltaX = currentX.value - startX.value;

  // Check if swiped completely to the left (80% of container width)
  if (Math.abs(deltaX) > containerWidth.value * 0.8 && deltaX < 0) {
    triggerSwipeAction();
  } else {
    // Reset position if not swiped far enough
    translateX.value = 0;
  }
}

function hasMovedSignificantly() {
  const deltaX = Math.abs(currentX.value - startX.value);
  return deltaX > 10; // 10px threshold for significant movement
}

function clearLongPressTimer() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
}

function onLongPress() {
  // Show the popup on long press
  showPopup.value = true;
  console.log(`Task long pressed: ${props.title}`);
}

function triggerSwipeAction() {
  // Complete the swipe animation
  translateX.value = -containerWidth.value;
  isDisappearing.value = true;

  // Wait for the animation to complete before emitting the event
  setTimeout(() => {
    onSwipeLeft();
  }, 300); // Match the CSS transition duration
}

function onSwipeLeft() {
  // Emit an event that parent components can listen to
  emit("task-done", { id: props.id, title: props.title, date: props.date });
  console.log(`Task completed: ${props.title}`);
}

function closePopup() {
  showPopup.value = false;
}

function editTask() {
  // Emit edit event to parent component
  emit("edit-task", { id: props.id, title: props.title, date: props.date });
  console.log(`Edit task: ${props.title}`);
}

function deleteTask() {
  // Emit delete event to parent component
  emit("delete-task", { id: props.id, title: props.title, date: props.date });
  console.log(`Delete task: ${props.title}`);
}

// Lifecycle hooks
onMounted(() => {
  updateContainerWidth();
  window.addEventListener("resize", updateContainerWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateContainerWidth);
  clearLongPressTimer();
});
</script>

<template>
  <div class="task-tile-container">
    <div class="task-tile-swipe-wrapper" ref="taskTileRef">
      <!-- Background with check icon -->
      <div class="swipe-background" :class="{ active: isDragging && translateX < 0 }">
        <font-awesome-icon :icon="faCheck" style="color: var(--color-background-soft)" />
      </div>

      <!-- Main tile -->
      <div
        class="task-tile"
        :style="{ transform: `translateX(${translateX}px)` }"
        :class="{ disappearing: isDisappearing }"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
      >
        <h3 class="task-date">{{ date }}</h3>
        <h3 class="task-title">{{ title }}</h3>
      </div>
    </div>
    <!-- Popup -->
    <task-tile-popup
      :visible="showPopup"
      @close="closePopup"
      @edit="editTask"
      @delete="deleteTask"
    />
  </div>
</template>

<style scoped>
.task-tile-container {
  position: relative;
  width: 100%;
}
.task-tile-swipe-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.swipe-background {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background-color: /*#22c55e;*/ var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 24px;
  opacity: 0;
  transition: opacity 0.2s ease-out;
}

.swipe-background.active {
  opacity: 1;
}

.check-icon {
  color: var(--color-background-soft);
  font-size: 24px;
  font-weight: bold;
}

.task-tile {
  position: relative;
  z-index: 1;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: var(--element-gap);
  width: 100%;
  padding: 12px 16px;
  background-color: var(--color-background-soft);
  border-radius: 12px;
  transition: transform 0.3s ease-out;
  cursor: grab;
  user-select: none;
}

.task-tile:active {
  cursor: grabbing;
}

.task-tile.disappearing {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  opacity: 0;
}

.task-title {
  width: 100%;
  font-family: var(--primary-font-family);
  font-size: var(--font-size-normal);
  font-weight: var(--font-weight-regular);
}

.task-date {
  color: var(--accent-color);
  font-family: var(--secondary-font-family);
  font-size: var(--font-size-normal);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}
</style>
