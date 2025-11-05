<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
  onClick: {
    type: Function,
    required: false,
  },
  color: {
    type: String,
    validator: (value) => ["white", "red"].includes(value),
    required: false,
    default: "red",
  },
});
</script>

<template>
  <button class="button-text-size" :class="[`button-${color}`]" @click="onClick">
    <p class="button-text">{{ text }}</p>
  </button>
</template>

<style scoped>
/* ========================================
   BUTTON BASE STYLES
======================================== */
.button-text-size {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Dimensions */
  height: 32px;
  padding-inline: 16px;

  /* Visual */
  border: 2px solid;
  border-radius: 16px;

  /* Interaction */
  cursor: pointer;
  transition: all 0.1s ease;
}

/* RED BUTTON VARIANT */
.button-red {
  background-color: #f8002f;
  border-color: color-mix(in srgb, #f8002f, #000 15%);
  box-shadow: 0px 4px 0px 0px color-mix(in srgb, #f8002f, #000 15%);
}

.button-red:active {
  transform: translateY(4px);
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.15) !important;
}

.button-red .button-text {
  color: #ffffff;
}

/* WHITE BUTTON VARIANT */
.button-white {
  background-color: #ffffff;
  border-color: color-mix(in srgb, #ffffff, #000 15%);
  box-shadow: 0px 4px 0px 0px color-mix(in srgb, #ffffff, #000 15%);
}

.button-white:active {
  transform: translateY(4px);
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.15) !important;
}

.button-white .button-text {
  color: #333333;
}

/* ========================================
   BUTTON TEXT STYLES
======================================== */
.button-text {
  /* Typography */
  font-family: "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;

  /* Reset */
  margin: 0;

  /* User interaction */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
