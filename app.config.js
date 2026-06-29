module.exports = {
  expo: {
    name: "joaia_demo",
    slug: "joaiademo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "joaiademo",
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/expo.icon",
      bundleIdentifier: "com.ratimus.joaia-demo",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "Show your position on the map."
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      predictiveBackGestureEnabled: false,
      package: "com.ratimus.joaia_demo",
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ]
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
      bundler: "metro"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#208AEF",
          android: {
            image: "./assets/images/splash-icon.png",
            imageWidth: 76
          }
        }
      ],
      [
        "react-native-maps",
        {
          // Securely inject the key here using process.env
          "androidGoogleMapsApiKey": process.env.ANDROID_GOOGLE_MAPS_API_KEY || ""
        }
      ],
      "expo-secure-store",
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Allow Joaia to access your location to show your position on the map."
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      eas: {
        "projectId": "5528412b-c15e-4981-90e5-02634dd81292"
      }
    },
    owner: "ratimus"
  }
};