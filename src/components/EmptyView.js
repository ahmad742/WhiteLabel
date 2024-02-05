import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useCustomer } from "../context/CustomerContext";
import fonts from "../theme/fonts";

const LoadingView = (props) => {
  const { message = "", containerStyle = {} } = props;

  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.emptyText(primary1)}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: (color) => ({
    fontSize: 18,
    color: color || "#062D5B",
    textAlign: "center",
    fontFamily: fonts.Medium_Font,
  }),
});

export default LoadingView;
