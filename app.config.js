export default {
  expo: {
    name: 'plot-app-maplibre-main',
    slug: 'plot-app-maplibre-main',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.jayashakthi28.plotmap',
      googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST,
      googleServicesFile: './assets/GoogleService-Info.plist',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.jayashakthi28.plotmap',
      googleServicesFile: process.env.GOOGLE_SERVICE_JSON,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      '@maplibre/maplibre-react-native',
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
      '@react-native-firebase/crashlytics',
      '@react-native-google-signin/google-signin',
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: 'b16e6a46-77b2-4a1f-8071-b46797bb323d',
      },
    },
  },
};
