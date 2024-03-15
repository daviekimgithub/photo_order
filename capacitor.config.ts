import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.test.app',
  appName: 'testapp',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      splashFullScreen: false,
      backgroundColor: '#ffffffff',
      splashImmersive: false,
    },
  },
};

export default config;
