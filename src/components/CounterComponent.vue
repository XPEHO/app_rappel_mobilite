<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
</script>

<template>
    <div>
      <h2>Demo Pinia</h2>
      <p>Compteur: {{ counterStore.count }}</p>
      <p>Double: {{ counterStore.doubleCount }}</p>
      <button @click="counterStore.increment()">Incrémenter</button>
    </div>
</template>
