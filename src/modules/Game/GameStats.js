import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
} from "react-native";
import EmptyView from "../../components/EmptyView";

import { useCustomer } from "../../context/CustomerContext";
import styles from "./GameDetailsStyle";

export default (props) => {
  const { userId, stats = {} } = props;

  const { currentCustomer = {} } = useCustomer();
  const { primary2 = "#1183C7" } = currentCustomer;
  const [allStats, setAllStats] = useState([]);

  useEffect(() => {
    let sts = [];
    for (const [key, value] of Object.entries(stats)) {
      const data = value.map(getSubStateObject).filter(d => d);
      data.map((item) => {
        const { subData = {} } = item;
        const { team1 = [], team2 = [] } = subData;
        if (value.length > 0 && data.length > 0) {
          sts.push({
            data,
            title: key.replace("_", " "),
            isDataShow: (team1.includes("") || team1.includes("0%")) && team2.includes("") || team2.includes("0%") ? false : true,
          });
        }
      });
    }
    setAllStats(sts);
  }, [stats]);

  const getSubStateObject = (o) => {
    let obj = null;
    for (const [key, value] of Object.entries(o)) {
      if (
        (value.team1 && value.team1.length > 0)
        || (value.team2 && value.team2.length > 0)
      ) {
        obj = {
          subTitle: key.replace("_", " "),
          subData: value,
        };
      }
    }
    return obj;
  };

  const renderState = (item, index) => {
    const { subTitle = "", subData = {} } = item;
    const { team1 = [], team2 = [] } = subData;
    return (
      <View key={JSON.stringify(index)}>
        <Text style={styles.statsTitle(primary2)}>{subTitle}</Text>
        <View style={styles.teamStateContainer}>
          <View style={[styles.teamDataContainer, team1.length === 0 ? { alignItems: "flex-end" } : undefined]}>
            {team1.length > 0 ? team1.map((s, ind) => (
              <View key={`${s}_${ind}`} style={{ paddingVertical: 5 }}>
                <Text style={styles.statsText}>{s}</Text>
              </View>
            )) : (
              <View style={{ paddingVertical: 5 }}>
                <Text style={styles.statsText}>-</Text>
              </View>
            )}
          </View>
          <View style={styles.statsSepratorStyle}>
            <View style={[styles.pointerStyle(primary2), styles.topPointer(primary2)]} />
            <View style={[styles.pointerStyle(primary2), styles.bottomPointer]} />
          </View>
          <View style={[styles.teamDataRightContainer, team2.length === 0 ? { alignItems: "flex-start" } : undefined]}>
            {team2.length > 0 ? team2.map((s, ind) => (
              <View key={`${s}_${ind}`} style={{ paddingVertical: 5 }}>
                <Text style={styles.statsText}>{s}</Text>
              </View>
            )) : (
              <View style={{ paddingVertical: 5 }}>
                <Text style={styles.statsText}>-</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderStats = (item, index) => {
    const { title = "", data = [], isDataShow = true } = item;
    if (!isDataShow) { return null; }
    return (
      <Fragment key={index}>
        <View style={styles.goalsView}>
          <Text style={styles.goalText}>{title}</Text>
        </View>
        {data.map(renderState)}
      </Fragment>
    );
  };

  if (!userId || userId == -1) {
    return (
      <View style={styles.statsContainer}>
        <EmptyView message="You need to register/login if you want to see game stats" />
      </View>
    );
  }

  return (
    <View style={styles.statsContainer}>
      {allStats.length == 0 ? (
        <EmptyView message="No game stats found" />
      ) : allStats.slice(0,1).map(renderStats)}
    </View>
  );
};
