import React from "react";
import {
  View,
  Text,
  Linking,
  Pressable,
  Image,
} from "react-native";
import FastImage from "react-native-fast-image";

import EmptyView from "../../components/EmptyView";

import { useCustomer } from "../../context/CustomerContext";
import styles from "./EventDetailsStyle";

const EventStreams = (props) => {
  const { streams = [] } = props;

  const { icons = {}, currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  const onLinkPress = async (link = "") => {
    if (link) {
      try {
        await Linking.openURL(link);
      } catch (error) { }
    }
  };

  return (
    <View style={styles.streamContainer}>
      {
        streams.length > 0 ? streams.map((strm, i) => {
          const { name = "", link = "" } = strm;
          return (
            <Pressable
              key={`${name}-${i}`}
              onPress={() => onLinkPress(link)}
              style={styles.streamLinkBtn(primary1)}
            >
              {/* <FastImage
                style={{ height: 25, width: 25 }}
                tintColor={"#FFF"}
                resizeMode={FastImage.resizeMode.contain}
                source={{ uri: icons["live-streaming"]?.icon_png_light || icons["live-streaming"]?.icon_png_dark || "" }}
              /> */}

              <Image
                style={{ height: 25, width: 25, tintColor:'#fff' }}
                resizeMode={'contain'}
                source={{ uri: icons["live-streaming"]?.icon_png_light || icons["live-streaming"]?.icon_png_dark || "" }}
              />
              <Text style={styles.streamLinkBtnTxt}>{name}</Text>
            </Pressable>
          );
        }) : (
          <EmptyView message="No streaming available!" />
        )
      }
    </View>
  );
};

export default EventStreams;
