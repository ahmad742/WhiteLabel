/**
 * @format
 */

import 'react-native-gesture-handler';

import React from "react";
import { AppRegistry, LogBox } from "react-native";
import messaging from "@react-native-firebase/messaging";

import App from "./App";

import { name as appName } from "./app.json";

LogBox.ignoreLogs([
  "new NativeEventEmitter",
  "EventEmitter.removeListener",
  'VirtualizedLists should never be nested',
]);

messaging().setBackgroundMessageHandler(async remoteMessage => {
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
