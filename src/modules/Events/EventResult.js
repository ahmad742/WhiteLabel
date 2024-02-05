import React, { useState, useEffect } from "react";
import {
  View,
  Text,
} from "react-native";

import DescriptionComponent from "../../components/DescriptionComponent";

import styles from "./EventDetailsStyle";

export default (props) => {
  const {
    infoText = "",
    extraInfo = {},
    eventSubType = "",
  } = props;
  const {
    sport = "",
    rep_team = "",
    rep_type = "",
    rep_competition = "",
  } = extraInfo;
  const [welcomeText, setWelcomeText] = useState(infoText);

  useEffect(() => {
    setWelcomeText(infoText);
  }, [infoText]);

  return (
    <View style={styles.infoContainer}>
      {
        eventSubType.includes("Reps") ? (
          <View style={styles.repView}>
            {rep_type ? (<Text style={styles.repType}>{rep_type} Rep</Text>) : null}
            {sport ? (<Text style={styles.repLabel}>Sport: <Text style={styles.repValue}>{sport}</Text></Text>) : null}
            {rep_team ? (<Text style={styles.repLabel}>Team: <Text style={styles.repValue}>{rep_team}</Text></Text>) : null}
            {rep_competition ? (<Text style={styles.repLabel}>Competition: <Text style={styles.repValue}>{rep_competition}</Text></Text>) : null}
          </View>
        ) : null
      }
      <DescriptionComponent
        description={welcomeText}
        baseStyle={styles.eventInfoText}
      />
      {
        eventSubType.includes("Social Responsibility") ? Object.entries(extraInfo).map(e => ({ title: e[0] || "", description: e[1] || "" })).map((info, index) => (
          <View key={`${index}`} style={[
            styles.extraInfoBox,
            { backgroundColor: index % 2 === 0 ? "#fff" : "#F5F5F5" },
          ]}>
            <Text style={styles.extraInfoBoxTitle}>{info.title.replace("_", " ")}</Text>
            <Text style={styles.extraInfoBoxDescription}>{info.description}</Text>
          </View>
        )) : null
      }
    </View>
  );
};
