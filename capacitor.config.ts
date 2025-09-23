import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xpeho.app.rappel',
  appName: 'app_rappel_mobilite',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000, // Duration of the splash (2000 = 2s)
      launchAutoHide: true,     // Automatically hide the splash after the delay
      backgroundColor: '#E8DFDF',
      androidSplashResourceName: 'splash.png', // Android image name
      iosSplashResourceName: 'Default',    // IOS image name
    },
  },
};

export default config;
