import React from 'react';
import {
  View,
  Text,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { useCustomer } from "../../context/CustomerContext";
import fonts from '../../theme/fonts';

export default (props) => {
  const { item = {}, onPress } = props;

  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  const { image = "", venue = "" } = item;
  return (
    <Pressable onPress={onPress} style={styles.venueContainer}>
      <FastImage
        source={{ uri: image }}
        style={styles.venueImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.venueDataContainer}>
        <Text style={styles.venueName(primary1)}>{venue}</Text>
        {/* <Text style={styles.venueSubText(primary2)}>{published}</Text> */}
        <Text style={styles.readMoreBtnTxt}>See More</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  venueContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  venueImage: {
    height: 60,
    width: 60,
    marginRight: 10,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  venueDataContainer: {
    flex: 1,
    paddingRight: 10,
  },
  venueName: (color) => ({
    color: color || "#062D5B",
    fontSize: 18,
    lineHeight: 21,
    fontFamily: fonts.Bold_Font,
  }),
  venueSubText: (color) => ({
    color: color || "#062D5B",
    fontSize: 11,
    lineHeight: 13,
    fontFamily: fonts.Bold_Font,
  }),
  readMoreBtnTxt: {
    marginTop: 5,
    borderRadius: 4,
    color: "#fff",
    fontSize: 13,
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    backgroundColor: "#062D5B",
  },
});
