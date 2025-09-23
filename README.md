# app_rappel_mobilite

This template should help get you started developing with Vue 3 in Vite.

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

## Links

See [Capacitor](https://capacitorjs.com/docs/getting-started)
See [Notifications](https://capacitorjs.com/docs/apis/local-notifications)
