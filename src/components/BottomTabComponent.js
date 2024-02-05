import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useCustomer } from "../context/CustomerContext";
import fonts from "../theme/fonts";

const BottomTabComponent = (props) => {
  const {
    size = 24,
    name = "",
    Component,
    tabName = "",
    tintColor = "",
    focused = false,
  } = props;

  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  return (
    <View style={styles.iconContainer}>
      {Component !== undefined ? (
        <Component
          size={size}
          name={name}
          color={(focused && primary1) ? primary1 : tintColor}
        />
      ) : null}
      <Text
        numberOfLines={1}
        style={styles.tabText(focused && primary1 ? primary1 : tintColor)}
      >
        {tabName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
  },
  tabText: (color) => ({
    marginTop: 3,
    color: color,
    fontSize: 11,
    letterSpacing: 1,
    fontFamily: fonts.Medium_Font,
  }),
});

export default BottomTabComponent;
