import React, { useEffect, useState } from "react";
import {
  View,
  Text,
} from "react-native";
import FastImage from "react-native-fast-image";

import EmptyView from "../../components/EmptyView";

import { useCustomer } from "../../context/CustomerContext";
import styles from "./GameDetailsStyle";

export default (props) => {
  const { commentry = {} } = props;

  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  const [allCommentry, setAllCommentry] = useState([]);
  useEffect(() => {
    let cmnts = [];
    for (const [key, value] of Object.entries(commentry)) {
      cmnts.push({ title: key, data: value });
    }
    setAllCommentry(cmnts);
  }, [commentry]);
  const renderComment = (item, index) => {
    const {
      comment_id,
      minute = "",
      comment = "",
      heading = "",
      icon_png_dark = "",
    } = item;
    return (
      <View
        style={[
          styles.commentryBox,
          { backgroundColor: index % 2 === 0 ? "#fff" : "#F5F5F5" },
        ]}
        key={JSON.stringify(comment_id)}
      >
        <View style={styles.commentImgContainer}>
          <FastImage
            style={styles.commentImage}
            source={{ uri: icon_png_dark }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <View style={{ flex: 1 }}>
          {heading ? <Text style={styles.commentryheading(primary2)}>{heading}</Text> : null}
          {comment ? <Text style={styles.commentryText}>{comment}</Text> : null}
          {minute ? <Text style={styles.commentryheading(primary2)}>{minute}'</Text> : null}
        </View>
      </View>
    );
  };

  const renderCommentry = (item, index) => {
    const { title, data = [] } = item;
    return (
      <View key={index} style={{ marginTop: 10 }}>
        <View style={styles.commentryHeadingBox(primary1)}>
          <Text style={styles.commentryHeadingText}>{title}</Text>
        </View>
        {data.map(renderComment)}
      </View>
    );
  };

  return (
    // <FlatList
    //   data={allCommentry}
    //   renderItem={renderCommentry}
    //   scrollEnabled={false}
    //   nestedScrollEnabled={false}
    //   showsVerticalScrollIndicator={false}
    //   keyExtractor={(c, i) => i.toString()}
    //   contentContainerStyle={styles.scrollContainer}
    //   ListEmptyComponent={() => {
    //     if (!dataFetching) {
    //       return <EmptyView message="No commentary found" />;
    //     } else {
    //       return null;
    //     }
    //   }}
    // />
    allCommentry.length == 0 ? <EmptyView message="No commentary found" /> : allCommentry.map(renderCommentry)
  );
};
