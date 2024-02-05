import React, { useState } from "react";
import {
  Text,
  View,
  Platform,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import GradientButton from "../../components/GradientButton";
import NavLink from "../../components/NavLink";
// import SocialSignIn from "./SocialSignIn";

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import API from "../../services/api";
import fonts from "../../theme/fonts";

const SignInScreen = ({ navigation }) => {
  const { currentCustomer } = useCustomer();
  const {
    primary1 = "#1F376A",
    primary2 = "#1183C7",
    login_type,
  } = currentCustomer;
  console.log(currentCustomer);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idPassport, setIdPassport] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const onSignInPress = async () => {
    try {
      setIsSigningIn(true);
      let loginData = {};
      let apiName = "";
      if (login_type == 1) {
        loginData.email = email;
        loginData.password = password;
        apiName = "emailPasswordLogin";
      } else {
        loginData.id_passport = idPassport;
        apiName = "idLogin";
      }
      const { data = {} } = await API[apiName](loginData);
      const { message = "", status, user_id } = data;
      setIsSigningIn(false);
      if (login_type == 1 && user_id) {
        await AsyncStorage.setItem("@userId", JSON.stringify(user_id));
        navigation.reset({
          index: 0,
          routes: [{ name: "MainFlow" }],
        });
      } else if (login_type != 1 && status === "Success") {
        navigation.navigate("OTP", { idPassport });
      } else {
        hFunctions.showNotificationMessage("Authentication Error", message, {
          type: "danger",
        });
      }
    } catch (error) {
      setIsSigningIn(false);
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage(
        "Authentication Error",
        errorMessage.trim(),
        {
          type: "danger",
        }
      );
    }
  };

  const renderLoginInputs = () => {
    if (login_type == 1) {
      return (
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel(primary2)}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Feather
              style={styles.loginIcons(primary1)}
              name="mail"
              size={30}
              color="white"
            />
            <TextInput
              value={email}
              autoCapitalize="none"
              style={styles.inputs(primary1)}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <Text style={[styles.inputLabel(primary2), { marginTop: 15 }]}>
            Password
          </Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              style={styles.loginIcons(primary1)}
              name="lock-outline"
              size={30}
              color="white"
            />
            <TextInput
              secureTextEntry
              value={password}
              autoCapitalize="none"
              style={styles.inputs(primary1)}
              onSubmitEditing={() => onSignInPress()}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <NavLink
            routeName="ForgotPassword"
            text="Forgot Password?"
            containerStyle={{ marginTop: 20, alignSelf: "flex-end" }}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel(primary2)}>ID / Passport Number</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              style={styles.loginIcons(primary1)}
              name="passport"
              size={30}
              color="white"
            />
            <TextInput
              value={idPassport}
              autoCapitalize="none"
              style={styles.inputs(primary1)}
              onSubmitEditing={() => onSignInPress()}
              onChangeText={(text) => setIdPassport(text)}
            />
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        extraScrollHeight={20}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        enableAutomaticScroll={Platform.OS === "ios"}
      >
        <View style={styles.headerStyle}>
          <Text style={[styles.headerTitle(primary1)]}>HELLO!</Text>
          <Text style={styles.headerSubTitle}>Please Login to Continue</Text>
        </View>
        {renderLoginInputs()}
        <GradientButton
          text={"Let's Go!"}
          onPress={onSignInPress}
          showLoading={isSigningIn}
          gradientContainer={{
            marginHorizontal: 35,
            marginTop: 20,
            marginBottom: 15,
          }}
        />
        <NavLink
          routeName="SignUp"
          text="Need an Account? Register"
          containerStyle={{ alignSelf: "center" }}
        />
        {/* <View style={{ marginTop: 30 }}>
          <View style={styles.orSignInWithContainer}>
            <View style={styles.borderStyle} />
            <Text style={styles.otherLable}>OR SIGN IN WITH</Text>
            <View style={styles.borderStyle} />
          </View>
          <SocialSignIn />
        </View> */}
        <View style={styles.powerByContainer}>
          <Text style={styles.powerBy}>Powered by ItsHappening</Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

SignInScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  powerBy: {
    fontFamily: fonts.Regular_Font,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 1,
    color: "#7E7E7E",
    textAlign: "center",
    marginBottom: 20,
  },
  powerByContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  orSignInWithContainer: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  otherLable: {
    marginHorizontal: 10,
    fontSize: 14,
    lineHeight: 16,
    color: "#7E7E7E",
    fontFamily: fonts.Regular_Font,
  },
  borderStyle: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: "#7E7E7E",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputLabel: (color) => ({
    color: color || "#062D5B",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.Medium_Font,
    marginBottom: 5,
    marginLeft: 5,
  }),
  inputBox: {
    marginHorizontal: 35,
  },
  headerSubTitle: {
    color: "#7E7E7E",
    fontSize: 12,
    lineHeight: 15,
    fontFamily: fonts.Regular_Font,
  },
  headerTitle: (color) => ({
    color: color || "#062D5B",
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 1.5,
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
  }),
  headerStyle: {
    marginLeft: 23,
    marginTop: 90,
    marginBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputs: (color) => ({
    fontSize: 16,
    fontFamily: fonts.Regular_Font,
    color: color || "#062D5B",
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderStartColor: "transparent",
    borderColor: "#D1D1D1",
    padding: 15,
    flex: 1,
  }),
  signInButton: {
    marginTop: 30,
    marginBottom: 25,
    marginHorizontal: 35,
    alignSelf: "center",
  },
  signInText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loginIcons: (color) => ({
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "white",
    backgroundColor: color || "#062D5B",
  }),
});

export default SignInScreen;
