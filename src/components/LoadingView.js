import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { useCustomer } from "../context/CustomerContext";

const LoadingView = (props) => {
  const { style = {} } = props;
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={primary1 || "#062D5B"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoadingView;
