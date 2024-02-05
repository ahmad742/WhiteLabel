import React, { useState } from 'react';
import {
  Text,
  View,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  Cursor,
  CodeField,
  MaskSymbol,
  isLastFilledCell,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import GradientButton from '../../components/GradientButton';

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import APIs from '../../services/api';
import fonts from '../../theme/fonts';

const CELL_COUNT = 5;
const OTPScreen = ({ navigation, route }) => {
  const { idPassport: id_passport = "" } = route?.params ?? {};

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const { currentCustomer } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const onSubmit = async () => {
    try {
      setLoading(true);
      const { data = {} } = await APIs.idVerification({ id_passport, otp: value });
      const { message = "", user_id } = data;
      setLoading(false);
      if (user_id) {
        await AsyncStorage.setItem("@userId", JSON.stringify(user_id));
        navigation.navigate("MainFlow");
      } else {
        const errorMessage = hFunctions.getMessageText(message);
        hFunctions.showNotificationMessage("Authentication Error", errorMessage.trim(), {
          type: "danger",
        });
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Authentication Error", errorMessage.trim(), {
        type: "danger",
      });
    }
  };

  const renderCell = ({ index, symbol, isFocused }) => {
    let textChild = null;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="•"
          isLastFilledCell={isLastFilledCell({ index, value })}>
          {symbol}
        </MaskSymbol>
      );
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <Text
        key={index}
        style={styles.cell(primary1)}
        onLayout={getCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        extraScrollHeight={20}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        enableAutomaticScroll={Platform.OS === 'ios'}
      >
        <View style={styles.headerStyle}>
          <Text style={styles.headerTitle(primary1)}>Verification</Text>
          <Text style={styles.headerSubTitle}>Please enter the verification code we sent to your phone</Text>
        </View>

        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={renderCell}
        />

        <GradientButton
          text="Submit"
          onPress={onSubmit}
          showLoading={loading}
          gradientContainer={{ marginTop: 30, marginHorizontal: 35 }}
        />
      </KeyboardAwareScrollView>
      <View style={styles.powerByContainer}>
        <Text style={styles.powerBy}>Powered by ItsHappening</Text>
      </View>
    </SafeAreaView>
  );
};

OTPScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerStyle: {
    marginHorizontal: 20,
    marginTop: 90,
    marginBottom: 40,
  },
  headerTitle: (color) => ({
    color: color || '#062D5B',
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 1.5,
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
  }),
  headerSubTitle: {
    color: '#7E7E7E',
    fontSize: 12,
    lineHeight: 15,
    fontFamily: fonts.Regular_Font,
  },
  codeFieldRoot: {
    marginHorizontal: 35,
  },
  cell: (color) => ({
    color,
    width: 55,
    height: 55,
    fontSize: 30,
    lineHeight: 55,
    borderRadius: 6,
    textAlign: 'center',
    backgroundColor: '#eee',
    fontFamily: fonts.Bold_Font,
  }),
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
});

export default OTPScreen;
