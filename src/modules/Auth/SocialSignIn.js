import React, { useEffect } from "react";
import {
  View,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import axios from "axios";
import * as WebBrowser from 'expo-web-browser';
import { ResponseType } from "expo-auth-session";
import { AntDesign, Entypo } from "@expo/vector-icons";
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as NavActions from "../../context/NavigationContext";
import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import * as config from "../../config/config";
import API from "../../services/api";

WebBrowser.maybeCompleteAuthSession();

export default (props) => {
  const { operation = "signin" } = props;

  const { currentCustomer } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: config.expoGoProxyClientId,
    iosClientId: config.iosClientId,
    androidClientId: config.androidClientId,
    webClientId: config.webClientId,
  });

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: config.facebookAppId,
    iosClientId: config.facebookAppId,
    androidClientId: config.facebookAppId,
    expoClientId: config.facebookAppId,
    webClientId: config.facebookAppId,
    responseType: ResponseType.Token,
  });

  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        try {
          const { authentication } = response;
          const { accessToken } = authentication;
          let { data = {} } = await axios.get('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const { id = "", email = "", picture = "", family_name = "", given_name = "" } = data;
          if (operation === "signup") {
            socialSignUp({
              email,
              social: true,
              cellphone: "",
              password: null,
              platform_id: id,
              name: family_name,
              platform: "google",
              surname: given_name,
              profile_image: picture,
              password_confirmation: null,
            });
          }
        } catch ({ message = "" }) {
          if (message) {
            hFunctions.showNotificationMessage("Google Auth Error", message.trim(), {
              type: "danger",
            });
          }
        } finally {
          WebBrowser.maybeCompleteAuthSession();
        }
      }
    })();
  }, [response]);

  useEffect(() => {
    (async () => {
      if (fbResponse?.type === 'success') {
        try {
          const { authentication = {} } = fbResponse;
          const { accessToken = "" } = authentication;
          const { data = {} } = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,first_name,last_name,middle_name,email,picture.width(180).height(180)`);
          const { first_name = "", last_name = "", email = "", id = "", picture = {} } = data;
          const { url: pictureUrl = "" } = picture?.data || {};
          if (operation === "signup") {
            socialSignUp({
              email,
              social: true,
              cellphone: "",
              password: null,
              platform_id: id,
              name: first_name,
              surname: last_name,
              platform: "facebook",
              profile_image: pictureUrl,
              password_confirmation: null,
            });
          }
        } catch ({ message = "" }) {
          if (message) {
            hFunctions.showNotificationMessage("Facebook Auth Error", message.trim(), {
              type: "danger",
            });
          }
        } finally {
          WebBrowser.maybeCompleteAuthSession();
        }
      }
    })();
  }, [fbResponse]);

  const socialSignUp = async (userData = {}) => {
    try {
      const { data = {} } = await API.register(userData);
      const { message = "", user_id, errors = {} } = data;
      if (user_id) {
        hFunctions.showNotificationMessage("Success", message, {
          type: "success",
        });
        await AsyncStorage.setItem("@userId", JSON.stringify(user_id));
        NavActions.navigateTo("MainFlow");
      } else {
        const errorMessage = hFunctions.getMessageText(message, errors);
        hFunctions.showNotificationMessage("Auth Error", errorMessage.trim(), {
          type: "danger",
        });
      }
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Auth Error", errorMessage.trim(), {
        type: "danger",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        disabled={!request}
        onPress={() => promptAsync()}
        style={styles.buttonContainer}
      >
        <AntDesign name="google" color={primary1 || "#062D5B"} size={36} />
      </Pressable>
      <Pressable
        disabled={!fbRequest}
        onPress={() => fbPromptAsync()}
        style={[styles.buttonContainer, { marginHorizontal: 25 }]}
      >
        <Entypo name="facebook-with-circle" color={primary1 || "#062D5B"} size={36} />
      </Pressable>
      {
        Platform.OS === 'ios' ? (
          <Pressable style={styles.buttonContainer}>
            <AntDesign name="apple1" color={primary1 || "#062D5B"} size={36} />
          </Pressable>
        ) : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#7E7E7E",
    borderRadius: 10,
  },
});
