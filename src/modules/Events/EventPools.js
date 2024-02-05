import React, { useState, useEffect } from "react";
import {
  View,
  Text,
} from "react-native";
import has from "lodash/has";
import Ionicons from "react-native-vector-icons/Ionicons";
import Accordion from "react-native-collapsible/Accordion";

import EmptyView from "../../components/EmptyView";

import { useCustomer } from "../../context/CustomerContext";
import styles from "./EventDetailsStyle";

const EventPools = (props) => {
  const { pools: pData = {} } = props;
  const [poolsData, setPoolsData] = useState(pData);
  const [activeSections, setActiveSections] = useState([0]);

  const { currentCustomer = {} } = useCustomer();
  const { primary2 = "#1183C7" } = currentCustomer;

  const { data: pools = [], title = "" } = poolsData;

  useEffect(() => {
    (async () => {
      let newPoolData = await getDataFormat(pData?.data);
      setPoolsData({ ...pData, data: newPoolData });
    })();
  }, [pData]);

  const getDataFormat = (oldPoolData = []) => {
    return new Promise((resolve) => {
      let newPoolData = [];
      const hasTeams = oldPoolData.every(p => has(p, ["teams"]));
      if (oldPoolData.length > 0 && !hasTeams) {
        newPoolData[0] = { teams: oldPoolData };
      } else {
        newPoolData = oldPoolData;
      }
      resolve(newPoolData);
    });
  };

  const handleContentChange = (sections = []) => {
    setActiveSections(sections);
  };

  const renderSectionHeader = (section, _index, isActive) => {
    return (
      <View style={[styles.poolNameContainer, isActive && styles.activePoolNameContainer]}>
        <Text style={styles.poolName(primary2)}>
          {(pools.length === 1 && !section?.pool) ? title : section.pool}
        </Text>
        <Ionicons
          size={20}
          color={primary2 || "#062D5B"}
          name={isActive ? "caret-down-sharp" : "caret-up-sharp"}
        />
      </View>
    );
  };

  const renderSectionContent = (section) => {
    return (
      <View style={styles.poolContentContainer}>
        <View style={styles.poolsTableHeaderContainer}>
          <View style={[styles.headerPointBox, { flex: 0.3 }]}>
            <Text style={styles.headerPointBoxText}>Team</Text>
          </View>
          <View style={styles.headerPointBox}>
            <Text style={styles.headerPointBoxText}>W</Text>
          </View>
          <View style={styles.headerPointBox}>
            <Text style={styles.headerPointBoxText}>L</Text>
          </View>
          <View style={styles.headerPointBox}>
            <Text style={styles.headerPointBoxText}>D</Text>
          </View>
          <View style={styles.headerPointBox}>
            <Text style={styles.headerPointBoxText}>G</Text>
          </View>
          <View style={styles.headerPointBox}>
            <Text style={styles.headerPointBoxText}>GC</Text>
          </View>
          <View style={styles.headerPointBox}>
            <Text style={styles.headerPointBoxText}>GD</Text>
          </View>
          <View style={styles.headerPointBox}>
            <Text style={styles.headerPointBoxText}>Pts</Text>
          </View>
          <View style={styles.headerPointBox}>
            <Text style={styles.headerPointBoxText}>P</Text>
          </View>
        </View>
        {section?.teams && section.teams.length > 0 ? section.teams.map((team) => (
          <View style={styles.poolsTableHeaderContainer} key={team.team_id}>
            <View style={[styles.headerPointBox, { flex: 0.3, alignItems: "flex-start" }]}>
              <Text style={[styles.headerPointBoxText, { marginHorizontal: 5 }]}>{team?.team}</Text>
            </View>
            <View style={styles.headerPointBox}>
              <Text style={styles.headerPointBoxText}>{team?.wins}</Text>
            </View>
            <View style={styles.headerPointBox}>
              <Text style={styles.headerPointBoxText}>{team?.losses}</Text>
            </View>
            <View style={styles.headerPointBox}>
              <Text style={styles.headerPointBoxText}>{team?.draws}</Text>
            </View>
            <View style={styles.headerPointBox}>
              <Text style={styles.headerPointBoxText}>{team?.goals}</Text>
            </View>
            <View style={styles.headerPointBox}>
              <Text style={styles.headerPointBoxText}>{team?.goals_conceded}</Text>
            </View>
            <View style={styles.headerPointBox}>
              <Text style={styles.headerPointBoxText}>{team?.goal_difference}</Text>
            </View>
            <View style={styles.headerPointBox}>
              <Text style={styles.headerPointBoxText}>{team?.points}</Text>
            </View>
            <View style={styles.headerPointBox}>
              <Text style={styles.headerPointBoxText}>{team?.games_played}</Text>
            </View>
          </View>
        )) : null}
      </View>
    );
  };

  return (
    <View style={styles.poolsContainer}>
      {
        pools.length > 0 ? (
          <>
            {
              pools.length > 1 ? (
                <View style={styles.cardContainer}>
                  <Text style={styles.poolTitle}>{title}</Text>
                </View>
              ) : null
            }
            <Accordion
              sections={pools}
              underlayColor={"transparent"}
              activeSections={activeSections}
              onChange={handleContentChange}
              renderHeader={renderSectionHeader}
              renderContent={renderSectionContent}
            />
          </>
        ) : null
      }
      {
        pools.length === 0 ? (
          <EmptyView
            message="No pools found"
          />
        ) : null
      }
    </View>
  );
};

export default EventPools;
