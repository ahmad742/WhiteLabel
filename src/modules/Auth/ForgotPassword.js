import React, { useState } from 'react';
import {
  Text,
  View,
  Platform,
  TextInput,
  StyleSheet,
} from 'react-native';
import Feather from "react-native-vector-icons/Feather";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import GradientButton from '../../components/GradientButton';
import NavLink from '../../components/NavLink';

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import APIs from '../../services/api';
import fonts from '../../theme/fonts';

const ForgotPassword = ({ navigation }) => {
  const { currentCustomer } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSendPress = async () => {
    try {
      setLoading(true);
      const response = await APIs.forgotPassword({ email });
      const { status, message } = response?.data ?? {};
      hFunctions.showNotificationMessage(status == "Success" ? "Forgot Password Success" : "Forgot Password Error", message, {
        type: status == "Success" ? "success" : "danger",
      });
      if (status == "Success") {
        navigation.goBack();
      }
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Reset Password Error", errorMessage.trim(), {
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        extraScrollHeight={20}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        enableAutomaticScroll={Platform.OS === 'ios'}
      >
        <View style={{ marginLeft: 23, marginTop: 90, marginBottom: 50 }}>
          <Text style={{ color: primary1 || '#062D5B', fontSize: 24, fontWeight: 'bold' }}>RESET PASSWORD!</Text>
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.inputLabel(primary2)}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Feather style={styles.loginIcons(primary1)} name="mail" size={30} color="white" />
            <TextInput
              style={styles.inputs(primary1)}
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
            />
          </View>
        </View>

        <GradientButton
          text="Submit"
          onPress={onSendPress}
          showLoading={loading}
          gradientContainer={{ marginTop: 30, marginBottom: 15, marginHorizontal: 35 }}
        />

        <NavLink
          routeName="SignUp"
          text="Need an Account? Register"
          containerStyle={{ alignSelf: 'center' }}
        />
        <NavLink
          routeName="SignIn"
          text="Back to Login"
          containerStyle={{ alignSelf: 'center', marginTop: 20 }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

ForgotPassword.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  inputs: (color) => ({
    fontSize: 16,
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
  logoStyle: {
    marginTop: 50,
    marginBottom: 50,
    height: 110,
    width: 360,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: "center",
  },
  inputLabel: (color) => ({
    color: color || '#062D5B',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.Medium_Font,
    marginBottom: 5,
    marginLeft: 5,
  }),
  inputBox: {
    marginHorizontal: 35,
  },
  loginIcons: (color) => ({
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: 'white',
    backgroundColor: color || '#062D5B',
  }),
});

export default ForgotPassword;
