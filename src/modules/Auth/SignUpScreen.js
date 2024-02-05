import React, { useState, Fragment } from 'react';
import {
  Text,
  View,
  Linking,
  Platform,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Feather from "react-native-vector-icons/Feather";
import messaging from "@react-native-firebase/messaging";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import GradientButton from '../../components/GradientButton';
import NavLink from '../../components/NavLink';
// import SocialSignIn from "./SocialSignIn";

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import { PRIVACY_POLICY_URL } from "../../config/config";
import API from "../../services/api";
import fonts from '../../theme/fonts';

const SignUpScreen = ({ navigation }) => {
  const { currentCustomer } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7", login_type } = currentCustomer;

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [cellphone, setCellPhone] = useState('');
  const [idPassport, setIdPassport] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasId, setHasId] = useState(false);
  const [isParentMember, setIsPrentMember] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const onSignUpPress = async () => {
    try {
      setIsSigningUp(true);
      const deviceToken = await messaging().getToken();
      const params = {
        name,
        email,
        surname,
        cellphone,
        terms: termsAccepted,
        device_id: deviceToken,
        parent_member: isParentMember,
      };
      let apiCall = "";
      if (login_type == 1) {
        params.platform = "";
        params.social = false;
        params.platform_id = "";
        params.profile_image = "";
        params.password = password;
        params.password_confirmation = confirmPassword;

        apiCall = "emailPasswordRegister";
      } else {
        params.no_id = hasId;
        params.id_passport = idPassport;
        apiCall = "idRegister";
      }
      const response = await API[apiCall](params);
      const { message = "", status, user_id } = response?.data ?? {};
      setIsSigningUp(false);
      if (login_type == 1 && user_id) {
        await AsyncStorage.setItem("@userId", JSON.stringify(user_id));
        navigation.navigate("MainFlow");
      } else if (login_type != 1 && status === "Success") {
        navigation.navigate("OTP", { idPassport });
      } else {
        hFunctions.showNotificationMessage("Registration Error", message, {
          type: "danger",
        });
      }
    } catch (error) {
      setIsSigningUp(false);
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Error", errorMessage.trim(), {
        type: "danger",
      });
    }
  };

  const onPrivacyPress = async () => {
    try {
      await Linking.openURL(PRIVACY_POLICY_URL);
    } catch (error) { }
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
          <Text style={styles.headerTitle(primary1)}>HELLO!</Text>
          <Text style={styles.headerSubTitle}>Please Register to Continue</Text>
        </View>

        <View style={styles.inputBox}>
          <Text style={[styles.inputLabel(primary2), { marginTop: 0 }]}>Name</Text>
          <View style={styles.inputContainer}>
            <AntDesign style={styles.loginIcons(primary1)} name="user" size={30} color="white" />
            <TextInput
              value={name}
              autoCapitalize="none"
              style={styles.inputs(primary1)}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <Text style={styles.inputLabel(primary2)}>Surname</Text>
          <View style={styles.inputContainer}>
            <AntDesign style={styles.loginIcons(primary1)} name="user" size={30} color="white" />
            <TextInput
              value={surname}
              autoCapitalize="none"
              style={styles.inputs(primary1)}
              onChangeText={(text) => setSurname(text)}
            />
          </View>
          <Text style={styles.inputLabel(primary2)}>Cell Phone</Text>
          <View style={styles.inputContainer}>
            <Feather style={styles.loginIcons(primary1)} name="phone" size={30} color="white" />
            <TextInput
              value={cellphone}
              returnKeyType="done"
              autoCapitalize="none"
              keyboardType="phone-pad"
              style={styles.inputs(primary1)}
              onChangeText={(text) => setCellPhone(text)}
              placeholder="Please start with your country code"
            />
          </View>
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
          {
            login_type == 1 ? (
              <Fragment>
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
              </Fragment>
            ) : (
              <Fragment>
                <Pressable
                  onPress={() => setHasId(!hasId)}
                  style={[styles.checkboxContainer, { marginTop: 30 }]}
                >
                  <MaterialCommunityIcons
                    name={hasId ? "checkbox-marked" : "checkbox-blank-outline"}
                    color={primary1 || '#062D5B'}
                    size={30}
                  />
                  <Text style={styles.checkboxText(primary1)}>I don't have a South African ID Number</Text>
                </Pressable>
                <Text style={styles.inputLabel(primary2)}>{hasId ? "Passport Number" : "ID Number"}</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons style={styles.loginIcons(primary1)} name="passport" size={30} color="white" />
                  <TextInput
                    value={idPassport}
                    autoCapitalize="none"
                    style={styles.inputs(primary1)}
                    onChangeText={(text) => setIdPassport(text)}
                  />
                </View>
              </Fragment>
            )
          }
          <Pressable
            onPress={() => setIsPrentMember(!isParentMember)}
            style={[styles.checkboxContainer, { marginTop: 50 }]}
          >
            <MaterialCommunityIcons
              name={isParentMember ? "checkbox-marked" : "checkbox-blank-outline"}
              color={primary1 || '#062D5B'}
              size={30}
            />
            <Text style={styles.checkboxText(primary1)}>I'm a parent of participating students</Text>
          </Pressable>
          <Pressable
            style={styles.checkboxContainer}
            onPress={() => setTermsAccepted(!termsAccepted)}
          >
            <MaterialCommunityIcons
              name={termsAccepted ? "checkbox-marked" : "checkbox-blank-outline"}
              color={primary1 || '#062D5B'}
              size={30}
            />
            <Text style={styles.checkboxText(primary1)}>
              I have read and agree to the
              <Text onPress={onPrivacyPress} style={{ color: primary2 || "#5086A7" }}> Privacy Policy</Text>
            </Text>
          </Pressable>
          <GradientButton
            text={"Let's Go!"}
            onPress={onSignUpPress}
            showLoading={isSigningUp}
            gradientContainer={{ marginTop: 30, marginBottom: 15 }}
          />
          <NavLink
            routeName="SignIn"
            text="Already have an Account? Login"
            containerStyle={{ alignSelf: 'center' }}
          />
        </View>
        {/* <View style={{ marginTop: 30 }}>
          <View style={styles.orSignInWithContainer}>
            <View style={styles.borderStyle} />
            <Text style={styles.otherLable}>OR SIGN IN WITH</Text>
            <View style={styles.borderStyle} />
          </View>
          <SocialSignIn operation="signup" />
        </View> */}
        <View style={[styles.powerByContainer, { marginTop: 50 }]}>
          <Text style={styles.powerBy}>Powered by ItsHappening</Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

SignUpScreen.navigationOptions = () => {
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

export default SignUpScreen;
