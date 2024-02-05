import * as React from 'react';
import {
  Text,
  View,
  Linking,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from "react-native-linear-gradient";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useCustomer } from "../../context/CustomerContext";
import fonts from '../../theme/fonts';
import { images } from '../../assets';

const LandingScreen = ({ navigation }) => {
  const { currentCustomer } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  React.useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(primary1);
      StatusBar.setBarStyle("light-content");
    }
    (async () => {
      const url = await Linking.getInitialURL();
      if (url) { handleDeepLink({ url }); }
    })();
    const deeplinkListener = Linking.addEventListener("url", handleDeepLink);
    return () => {
      deeplinkListener.remove();
    };
  }, []);

  const handleDeepLink = (e) => {
    const { url = "" } = e;
    if (url) {
      const mainURL = url.replace(/.*?:\/\//g, '');
      if (mainURL.includes("reset-password")) {
        const token = mainURL.replace("swpsa.itshappening.africa/reset-password/", "");
        navigation.navigate("ResetPassword", { token });
      }
    }
  };

  const onGuestPress = async () => {
    await AsyncStorage.setItem("@userId", "-1");
    navigation.navigate('MainFlow');
  };
  return (
    <LinearGradient
      locations={[0.2, 1]}
      style={styles.background}
      colors={[primary1 || 'rgba(6, 45, 91, 1)', primary2 || 'rgba(80, 134, 167, 1)']}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image
            source={images.logo}
            style={[styles.logoStyle, {}]}
            resizeMode='contain'
          />
          <Pressable style={styles.loginButton} onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.text(primary1)}>LOGIN</Text>
          </Pressable>

          <Pressable style={styles.registerButton} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.text(primary1)}>REGISTER</Text>
          </Pressable>

          <Pressable style={styles.continueBtnContainer} onPress={onGuestPress}>
            <Text style={{ ...styles.text(primary1), marginTop: 3 }}>CONTINUE AS GUEST</Text>
            <AntDesign style={{ marginLeft: 15 }} name="arrowright" size={24} color={primary1} />
          </Pressable>
        </View>
        <Text style={[styles.powerby, { color: primary1 }]}>Powered by ItsHappening</Text>
      </SafeAreaView>
    </LinearGradient>
  );
};

LandingScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  logoStyle: {
    height: 300,
    width: '100%',
    marginRight: 8,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  background: {
    flex: 1,
  },
  loginButton: {
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 20,
  },
  registerButton: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  text: (color) => ({
    fontSize: 18,
    lineHeight: 21,
    color: color || '#062D5B',
    alignSelf: 'center',
    fontFamily: fonts.Bold_Font,
  }),
  powerby: {
    fontSize: 14,
    lineHeight: 17,
    color: '#FFFFFF',
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    fontFamily: fonts.Regular_Font,
  },
  continueBtnContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default LandingScreen;
