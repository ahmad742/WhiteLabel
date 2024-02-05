import React, { useState } from "react";
import {
  View,
  Pressable,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

import PerformerComponent from "../../components/PerformerComponent/PerformerComponent";
import EmptyView from "../../components/EmptyView";

export default (props) => {
  const {
    userId,
    performers = [],
  } = props;

  const [iconIndex, setIconIndex] = useState(0);

  if (!userId || userId == -1) {
    return (
      <View style={{
        flex: 1,
        marginTop: -150,
      }}>
        <EmptyView message="You need to register/login if you want to see player stats" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 5, marginTop: 5 }}>
      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
        <Pressable onPress={() => setIconIndex(0)} style={{
          padding: 7,
          backgroundColor: iconIndex == 0 ? 'rgba(217, 217, 217, 0.76)' : 'transparent',
          borderRadius: 6,
          margin: 2,
        }}>
          <AntDesign name={"appstore1"} size={25} color={"#7E7E7E"} />
        </Pressable>
        <Pressable onPress={() => setIconIndex(1)} style={{
          margin: 2,
          padding: 7,
          backgroundColor: iconIndex == 1 ? 'rgba(217, 217, 217, 0.76)' : 'transparent',
          borderRadius: 6,
        }}>
          <MaterialCommunityIcons name={"format-list-text"} size={25} color={"#7E7E7E"} />
        </Pressable>
      </View>
      <PerformerComponent data={performers} iconIndex={iconIndex} tab={'performers'} />
    </View >
  );
};
