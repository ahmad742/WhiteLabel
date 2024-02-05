import React from 'react';
import {
  View,
  Text,
  Platform,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import DescriptionComponent from "../DescriptionComponent";

import { useCustomer } from "../../context/CustomerContext";
import fonts from '../../theme/fonts';

export default (props) => {
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  const { item = {}, onReadMorePress } = props;
  const {
    media = "",
    name = "",
    published = "",
    description = "",
    media_caption = "",
  } = item;
  return (
    <View style={styles.cardStyle}>
      <FastImage
        source={{ uri: media }}
        style={styles.newsImage}
        resizeMode={FastImage.resizeMode.cover}
      >
        <View style={styles.newsImageOverlay}>
          <View>
            <Text style={styles.newsTitle}>{name}</Text>
            <Text style={styles.newsPublished}>{published}</Text>
          </View>
          <Pressable onPress={onReadMorePress} style={styles.readMoreBtn(primary1)}>
            <Text style={styles.readMoreBtnTxt}>Read More</Text>
          </Pressable>
        </View>
      </FastImage>
      {media_caption ? <Text style={styles.mediaCaption(primary2)}>{media_caption}</Text> : null}
      {description ? (
        <DescriptionComponent
          description={description}
          baseStyle={styles.mediaDescription}
        />
      ) : null}
    </View>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  cardStyle: {
    padding: 10,
    marginTop: 15,
    marginHorizontal: 10,
    backgroundColor: "#fff",
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
  newsImage: {
    width: "100%",
    height: width * 0.5,
    borderRadius: 10,
  },
  newsImageOverlay: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  newsTitle: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 21,
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
  },
  newsPublished: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 17,
    fontFamily: fonts.Medium_Font,
    textTransform: "uppercase",
    marginTop: 5,
  },
  readMoreBtn: (color) => ({
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-end",
    backgroundColor: color || "#5086A7",
  }),
  readMoreBtnTxt: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 15,
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
  },
  mediaCaption: (color) => ({
    marginTop: 5,
    fontFamily: fonts.Bold_Font,
    fontSize: 15,
    lineHeight: 17,
    color: color || "#7E7E7E",
    letterSpacing: 1,
  }),
  mediaDescription: {
    marginTop: 5,
    fontFamily: fonts.Regular_Font,
    fontSize: 13,
    lineHeight: 15,
    color: "#7E7E7E",
  },
});
