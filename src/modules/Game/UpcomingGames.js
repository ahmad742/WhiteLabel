import React, { useEffect, useState } from "react";
import {
  View,
} from "react-native";

import ProgramComponent from "../../components/ProgramComponent/ProgramComponent";
import EmptyView from "../../components/EmptyView";

import { programNavIgnoreTypes } from "../../services/data";
import { push } from "../../context/NavigationContext";
import styles from "./GameDetailsStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default (props) => {
  const { games = [], navigationParams = {} } = props;
  const { event_id, eventSubType, background_image } = navigationParams;
  const [userId, setUserId] = useState(null);
  const goToGameDetails = (programId) => {
    if (programNavIgnoreTypes.some(et => eventSubType.includes(et))) {
      return null;
    }
    const programParams = {
      event_id,
      eventSubType,
      background_image,
      program_id: programId,
    };
    push("GameDetails", { programParams });
  };

  useEffect(() => {
    (async () => {
      const uid = await AsyncStorage.getItem("@userId");
      setUserId(uid);
    })();
  }, [userId]);

  const renderGames = (item, index) => (
    <ProgramComponent
      data={item}
      index={index}
      key={index.toString()}
      onPress={() => goToGameDetails(item?.id)}
      isLastProgram={index === games.length - 1}
    />
  );

  if (!userId || userId == -1) {
    return (
      <View style={styles.statsContainer}>
        <EmptyView message="You need to register/login if you want to see upcoming games" />
      </View>
    );
  }

  return (
    <View style={styles.upcommingGamesContainer}>
      {games.length == 0 ? (
        <EmptyView message="No upcoming games found" />
      ) : games.map(renderGames)}
    </View>
  );
};
