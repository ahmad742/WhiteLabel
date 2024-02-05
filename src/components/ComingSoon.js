import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import fonts from "../theme/fonts";

export default () => {
  return (
    <View style={styles.container}>
      <Text style={styles.comingSoonText}>Coming soon!!!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
  },
  comingSoonText: {
    fontFamily: fonts.Medium_Font,
    fontSize: 21,
    lineHeight: 24,
    color: "#7E7E7E",
    textTransform: "uppercase",
  },
});
