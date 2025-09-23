# app_rappel_mobilite

Application Vue 3 + TypeScript pour la gestion des rappels de mobilité.

This template should help get you started developing with Vue 3 in Vite.

## Stack Technique

- **Vue 3** - Framework JavaScript progressif
- **TypeScript** - Superset typé de JavaScript
- **Vite** - Build tool et serveur de développement
- **Pinia** - Store management officiel pour Vue 3
- **Vue Router** - Routage côté client
- **Vitest** - Framework de test unitaire

## Gestion d'État avec Pinia

Ce projet utilise **Pinia** comme solution de gestion d'état. Pinia est le store officiel pour Vue 3 qui remplace Vuex.

### Configuration

Pinia est configuré dans `src/main.ts` :

```typescript
import { createPinia } from 'pinia'
app.use(createPinia())
```

### Stores Disponibles

#### Counter Store (`src/stores/counter.ts`)

Store d'exemple utilisant la Composition API :

```typescript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

### Utilisation dans les Composants

Pour utiliser un store dans un composant :

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()
</script>

<template>
  <div>
    <p>Count: {{ store.count }}</p>
    <button @click="store.increment()">Increment</button>
  </div>
</template>
```

### Exemple d'Implémentation

Voir `src/views/HomeView.vue` pour un exemple concret d'utilisation du store Pinia dans un composant.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

## Capacitor Setup

```sh
npm i @capacitor/core
npm i -D @capacitor/cli
npx cap init
npm i @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
npm install @capacitor/local-notifications
npm run build
npx cap sync
```

### Compile and run with capacitor

```sh
# Build the Vue app
npm run build
# Copy web assets to native platforms and sync plugins
npx cap sync
# Run the native app on Android or iOS
npx cap run android # or ios
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Generate basic assets

```sh
# This package allow you to create assets easily, but it's better have real assets with every sizes
# Install the package that will generate all sizes needed
npm install @capacitor/assets --save-dev
# Create a resources folder and add an image inside and then generate all images needed
npx capacitor-assets generate
```

## Links

See [Capacitor](https://capacitorjs.com/docs/getting-started)
See [Notifications](https://capacitorjs.com/docs/apis/local-notifications)
