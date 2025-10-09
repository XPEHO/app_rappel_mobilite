<script setup lang="ts">
defineProps({
    text: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <button class="button-text-size">
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
    background-color: #F8002F;
    border-color: color-mix(in srgb, #F8002F, #000 15%);
    box-shadow: 0px 4px 0px 0px color-mix(in srgb, #F8002F, #000 15%);

    /* Interaction */
    cursor: pointer;
    transition: all 0.1s ease;

    /* Active state */
    &:active {
        transform: translateY(4px);
        box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.15) !important;
    }
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

    /* Color */
    color: #FFFFFF;

    /* Reset */
    margin: 0;

    /* User interaction */
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
</style>