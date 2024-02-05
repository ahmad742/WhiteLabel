import React from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { useCustomer } from "../context/CustomerContext";
import fonts from "../theme/fonts";

const GradientButton = (props) => {
  const {
    text = "",
    textStyle = {},
    buttonStyle = {},
    disabled = false,
    showLoading = false,
    onPress = () => { },
    gradientContainer = {},
  } = props;

  const { currentCustomer } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  return (
    <LinearGradient
      end={{ x: 1, y: 1 }}
      locations={[0.3, 1]}
      start={{ x: 0, y: 1 }}
      colors={[primary1 || 'rgba(6, 45, 91, 1)', primary2 || 'rgba(80, 134, 167, 1)']}
      style={[styles.gradient, gradientContainer]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled || showLoading}
        style={[styles.buttonContainer, disabled ? styles.disabledButton : undefined, buttonStyle]}
      >
        <Text style={[styles.buttonText, disabled ? styles.disabledText : undefined, textStyle]}>{text}</Text>
        {
          showLoading ? <ActivityIndicator size="small" color="#fff" style={styles.indicatorStyle} /> : null
        }
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: '#3CC8F4',
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 22,
    fontStyle: "normal",
    fontFamily: fonts.Medium_Font,
  },
  disabledButton: {
    backgroundColor: "#D0D0D0",
  },
  disabledText: {
    color: "#464646",
  },
  indicatorStyle: {
    position: "absolute",
    right: 10,
  },
});

export default GradientButton;
