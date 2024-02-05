import React, { useEffect } from "react";
import FlashMessage from "react-native-flash-message";
import messaging from "@react-native-firebase/messaging";
import mobileAds from 'react-native-google-mobile-ads';

import NavContainer from "./src/navigation/NavigationContainer";
import ThemeProvider from "./src/context/CustomerContext";

const App = () => {
  useEffect(() => {
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        console.log("Google Admob initialization complete....");
      });
    (async () => {
      if (!(await messaging().getAPNSToken())) {
        await messaging().setAPNSToken("IHA");
      }
    })();
  }, []);

  return (
    <ThemeProvider>
      <NavContainer />
      <FlashMessage />
    </ThemeProvider>
  );
};

export default App;
