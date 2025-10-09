import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import "@yaki_ui/yaki_ui_web_components/css/yaki_ui.css";

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
