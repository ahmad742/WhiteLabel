import React, { useState } from 'react';
import {
  Text,
  View,
  Platform,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Feather from "react-native-vector-icons/Feather";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import GradientButton from '../../components/GradientButton';

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import API from "../../services/api";
import fonts from '../../theme/fonts';

const ResetPasswordScreen = ({ navigation, route }) => {
  const { currentCustomer } = useCustomer();
  const { token = "" } = route?.params ?? {};
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const onSignUpPress = async () => {
    try {
      setIsResetting(true);
      const params = {
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      };
      const response = await API.resetPassword(params);
      const { message = "", status } = response?.data ?? {};
      hFunctions.showNotificationMessage(`Reset Password ${status == "Success" ? "Success" : "Error"}`, message, {
        type: status == "Success" ? "success" : "danger",
      });
      if (status === "Success") {
        navigation.navigate("SignIn");
      }
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Reset Password Error", errorMessage.trim(), {
        type: "danger",
      });
    } finally {
      setIsResetting(false);
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
        enableAutomaticScroll={Platform.OS === 'ios'}
      >
        <View style={styles.headerStyle}>
          <Text style={styles.headerTitle(primary1)}>Reset Password!</Text>
          <Text style={styles.headerSubTitle}>Please Enter Details For Reset Your Password</Text>
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.inputLabel(primary2)}>Email</Text>
          <View style={styles.inputContainer}>
            <Feather style={styles.loginIcons(primary1)} name="mail" size={30} color="white" />
            <TextInput
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.inputs(primary1)}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <Text style={styles.inputLabel(primary2)}>Password</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons style={styles.loginIcons(primary1)} name="lock-outline" size={30} color="white" />
            <TextInput
              secureTextEntry
              value={password}
              autoCapitalize="none"
              style={styles.inputs(primary1)}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <Text style={styles.inputLabel(primary2)}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons style={styles.loginIcons(primary1)} name="lock-outline" size={30} color="white" />
            <TextInput
              secureTextEntry
              autoCapitalize="none"
              value={confirmPassword}
              style={styles.inputs(primary1)}
              onChangeText={(text) => setConfirmPassword(text)}
            />
          </View>
          <GradientButton
            text={"Reset Password"}
            onPress={onSignUpPress}
            showLoading={isResetting}
            gradientContainer={{ marginTop: 30, marginBottom: 15 }}
          />
        </View>
        <View style={[styles.powerByContainer, { marginTop: 50 }]}>
          <Text style={styles.powerBy}>Powered by ItsHappening</Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

ResetPasswordScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputs: (color) => ({
    fontSize: 14,
    fontFamily: fonts.Regular_Font,
    color: color || "#062D5B",
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderStartColor: 'transparent',
    borderColor: '#D1D1D1',
    padding: 15,
    flex: 1,
  }),
  signInButton: {
    marginTop: 30,
    marginBottom: 25,
    marginHorizontal: 35,
    alignSelf: 'center',
  },
  signInText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginIcons: (color) => ({
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: 'white',
    backgroundColor: color || '#062D5B',
  }),
  orSignInWithContainer: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 30,
  },
  otherLable: {
    marginHorizontal: 10,
    fontSize: 14,
    lineHeight: 16,
    color: '#7E7E7E',
    fontFamily: fonts.Regular_Font,
  },
  borderStyle: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: "#7E7E7E",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: "center",
  },
  inputLabel: (color) => ({
    color: color || '#062D5B',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
    marginTop: 15,
  }),
  inputBox: {
    marginHorizontal: 35,
  },
  headerSubTitle: {
    color: '#7E7E7E',
    fontSize: 12,
    lineHeight: 15,
    fontFamily: fonts.Regular_Font,
  },
  headerTitle: (color) => ({
    color: color || '#062D5B',
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    alignSelf: "flex-start",
  },
  checkboxText: (color) => ({
    fontFamily: fonts.Medium_Font,
    fontSize: 17,
    lineHeight: 19,
    color: color || '#062D5B',
    marginLeft: 10,
    flex: 1,
  }),
});

export default ResetPasswordScreen;
