import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// PWA install prompt
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event fired');
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show your custom install button
  showInstallButton();
});

function showInstallButton() {
  // Create and show install button
  const installButton = document.createElement('button');
  installButton.textContent = '📱 Installer l\'app';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4DBA87;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1000;
    font-family: system-ui;
  `;
  
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // Clear the deferredPrompt so it can only be used once
      deferredPrompt = null;
      // Remove the install button
      installButton.remove();
    }
  });
  
  // Only show if not already installed
  if (!window.matchMedia('(display-mode: standalone)').matches) {
    document.body.appendChild(installButton);
  }
}

// Hide install button if app is already installed
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  const installButton = document.querySelector('button');
  if (installButton && installButton.textContent?.includes('Installer')) {
    installButton.remove();
  }
});
