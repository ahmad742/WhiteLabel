import React, { useEffect } from "react";
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import RNBootSplash from "react-native-bootsplash";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoadingView from "../../components/LoadingView";

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import APIs from "../../services/api";
import * as config from '../../config/config';

const SplashScreen = ({ navigation }) => {
  const { updateCustomer, updateIcons } = useCustomer();
  useEffect(() => {

    console.log("Config", config);

    (async () => {
      try {
        const userID = await AsyncStorage.getItem("@userId");
        const res = await new Promise.all([
          APIs.getCustomerDetails({}),
          APIs.getIcons({}),
        ]);
        // console.log(`getCustomerDetails ~ res`, res[0].data);
        updateCustomer(res[0].data || {});
        updateIcons(res[1].data || {});
        if (!userID || userID == -1) {
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginFlow" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "MainFlow" }],
          });
        }
      } catch (error) {
        const errorMessage = hFunctions.getErrorMessage(error);
        hFunctions.showNotificationMessage("App Error", errorMessage.trim(), {
          type: "danger",
        });
      } finally {
        await RNBootSplash.hide({ fade: true });
      }
    })();
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (!enabled && Platform.OS === "android") {
        Alert.alert(
          "Notification Permission",
          "Please enable notification permission for receive all the app notifications.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Okay",
              style: "default",
              onPress: () => Linking.openSettings(),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      // console.log("permission error", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingView />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});

export default SplashScreen;
