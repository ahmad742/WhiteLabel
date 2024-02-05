import React, { useEffect, useState } from "react";
import {
  View,
  Text,
} from "react-native";
import { isEmpty } from "lodash";
import Ionicons from "react-native-vector-icons/Ionicons";
import Accordion from "react-native-collapsible/Accordion";

import LoadingView from "../../components/LoadingView";
import EmptyView from "../../components/EmptyView";

import { useCustomer } from "../../context/CustomerContext";
import styles from "./EventDetailsStyle";

const AccordionComponent = (props) => {
  const { data = [] } = props;
  const { currentCustomer = {} } = useCustomer();
  const { primary2 = "#1183C7", secondary1 = "#009245" } = currentCustomer;
  const [activeSections, setActiveSections] = useState([]);

  const handleContentChange = (sections = []) => {
    setActiveSections(sections);
  };

  const renderSectionHeader = (section, _index, isActive) => {
    const { title = "" } = section;
    return (
      <View style={[styles.poolNameContainer, isActive && styles.activePoolNameContainer]}>
        <Text style={styles.poolName(primary2)}>{title}</Text>
        <Ionicons
          size={20}
          color={primary2 || "#062D5B"}
          name={isActive ? "caret-down-sharp" : "caret-up-sharp"}
        />
      </View>
    );
  };

  const renderSectionContent = ({ sub_stats = false, data: subData = [], players = [], teams = [] }) => {
    if (sub_stats && !isEmpty(subData)) {
      return (
        <View style={{ paddingHorizontal: 5 }}>
          <AccordionComponent data={subData} />
        </View>
      );
    }
    return (
      <View style={styles.poolContentContainer}>
        <View style={styles.statByContainer(secondary1)}>
          <Text style={styles.statByTxt}>By Player</Text>
        </View>
        {
          players.map(({ player = "", team = "", figure = "" }, index) => (
            <View key={`${player}${team}${index}`} style={styles.playerNameContainer2}>
              <View
                style={[index === players.length - 1 ? { borderBottomWidth: 0 } : undefined]}
              >
                <Text style={styles.statPlayerName}>{player}</Text>
                <Text style={styles.statPlayerTeamName}>{team}</Text>
              </View>
              <Text style={styles.statPlayerName}>{figure}</Text>
            </View>
          ))
        }
        {
          players.length === 0 ? (
            <EmptyView
              message="No stats yet, keep checking in!"
            />
          ) : null
        }
        <View style={styles.statByContainer(secondary1)}>
          <Text style={styles.statByTxt}>By Team</Text>
        </View>
        {
          teams.map(({ team = "", figure = "" }, index) => (
            <View key={`${team}${index}`} style={styles.playerNameContainer2}>
              <View
                style={[index === teams.length - 1 ? { borderBottomWidth: 0 } : undefined]}
              >
                <Text style={styles.statPlayerName}>{team}</Text>
              </View>
              <Text style={styles.statPlayerName}>{figure}</Text>
            </View>
          ))
        }
        {
          teams.length === 0 ? (
            <EmptyView
              message="No stats yet, keep checking in!"
            />
          ) : null
        }
      </View>
    );
  };

  return (
    <Accordion
      sections={data}
      underlayColor={"transparent"}
      activeSections={activeSections}
      onChange={handleContentChange}
      renderHeader={renderSectionHeader}
      renderContent={renderSectionContent}
    />
  );
};

export default (props) => {
  const { data = [], stats = [], fetchingTeamsPlayers = false, eventSubType = "" } = props;

  const { currentCustomer = {} } = useCustomer();
  const { primary2 = "#1183C7" } = currentCustomer;
  const [teams, setTeams] = useState([]);
  const [eventStats, setEventStats] = useState([]);
  const [activeSections, setActiveSections] = useState([0]);
  const [fetchingPlayers, setFetchingPlayers] = useState(fetchingTeamsPlayers);
  const [isCultural, setIsCultural] = useState(false);

  useEffect(() => {
    if (data.length > 0) {
      setTeams(data);
    }
  }, [data]);

  useEffect(() => {
    setEventStats(stats);
  }, [stats]);

  useEffect(() => {
    setFetchingPlayers(fetchingTeamsPlayers);
  }, [fetchingTeamsPlayers]);

  useEffect(() => {
    if (["Debating", "Choir", "Competition", "Theatre", "Soiree", "Exhibition"].some(est => eventSubType.includes(est))) {
      setIsCultural(true);
      setActiveSections([undefined]);
    } else {
      setActiveSections([0]);
      setIsCultural(false);
    }
  }, [eventSubType]);

  const handleContentChange = (sections = []) => {
    setActiveSections(sections);
  };

  const renderSectionHeader = (section, _index, isActive) => {
    return (
      <View style={[styles.poolNameContainer, isActive && styles.activePoolNameContainer]}>
        <Text style={styles.poolName(primary2)}>{section.team}</Text>
        {!isCultural ? <Ionicons
          size={20}
          color={primary2 || "#062D5B"}
          name={isActive ? "caret-down-sharp" : "caret-up-sharp"}
        /> : null}
      </View>
    );
  };

  const renderSectionContent = ({ players = [], staff = [] }) => {
    return (
      <View style={styles.poolContentContainer}>
        {
          players.map(({ player = "", player_id = "" }, index) => (
            <View
              key={`${player}${player_id}${index}`}
              style={[styles.playerNameContainer, index === players.length - 1 ? { borderBottomWidth: 0 } : undefined]}
            >
              <Text style={styles.playerName}>{player}</Text>
            </View>
          ))
        }
        {
          staff.map(({ player = "", player_id = "" }, index) => (
            <View
              key={`${player}${player_id}${index}`}
              style={[styles.playerNameContainer, index === players.length - 1 ? { borderBottomWidth: 0 } : undefined]}
            >
              <Text style={styles.playerName}>{player}</Text>
            </View>
          ))
        }
        {
          players.length === 0 && staff.length === 0 ? (
            <EmptyView
              message="No players found"
            />
          ) : null
        }
      </View>
    );
  };

  return (
    <View style={styles.infoContainer}>
      {
        teams.length > 0 ? (
          <View style={styles.cardContainer}>
            <Text style={styles.poolTitle}>{isCultural ? "Teams" : "Team Players"}</Text>
          </View>
        ) : null
      }
      <Accordion
        sections={teams}
        underlayColor={"transparent"}
        activeSections={activeSections}
        onChange={handleContentChange}
        renderHeader={renderSectionHeader}
        renderContent={renderSectionContent}
        disabled={isCultural ? true : false}
      />
      {
        !fetchingPlayers && teams.length === 0 ? (
          <EmptyView
            message="No teams found"
          />
        ) : null
      }
      {!isCultural ?
        <>
          {
            eventStats.length > 0 ? (
              <View style={styles.cardContainer}>
                <Text style={styles.poolTitle}>Stats</Text>
              </View>
            ) : null
          }
          <AccordionComponent data={eventStats} />
          {
            !fetchingPlayers && eventStats.length === 0 ? (
              <EmptyView
                message="No stats found"
              />
            ) : null
          }
        </> : null}
      {
        fetchingPlayers ? <LoadingView /> : null
      }
    </View>
  );
};
