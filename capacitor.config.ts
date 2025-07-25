import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9ddfefad23584729a0adb595b64bed90',
  appName: 'chef-gemini-cook',
  webDir: 'dist',
  server: {
    url: 'https://9ddfefad-2358-4729-a0ad-b595b64bed90.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
  },
};

export default config;