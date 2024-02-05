import React from "react";
import {
  View,
} from "react-native";

import EmptyView from "../../components/EmptyView";

import styles from "./EventDetailsStyle";

export default (props) => {
  return (
    <View contentContainerStyle={styles.infoContainer}>
      <EmptyView
        message="No information found"
      />
    </View>
  );
};
