import React, { Fragment, useEffect, useState } from 'react';
import {
  View,
  Text,
} from "react-native";
import FastImage from 'react-native-fast-image';

import TextMarquee from "../../components/TextMarquee";
import EmptyView from "../../components/EmptyView";

import { useCustomer } from "../../context/CustomerContext";
import styles from "./GameDetailsStyle";

export default (props) => {
  const { userId, stats = {} } = props;

  const { icons = {}, currentCustomer = {} } = useCustomer();
  const { primary2 = "#1183C7" } = currentCustomer;

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const allTms = Object.values(stats);
    if (allTms.some(tm => tm.players.length > 0)) {
      let tms = Object.values(stats).map(tm => ({
        team_id: tm.team_id,
        team: tm.team,
        players: tm?.players ? tm.players.map(getPlayerStaffDetails) : [],
        staff: tm?.staff ? tm.staff.map(getPlayerStaffDetails) : [],
      }));
      setTeams(tms);
    }
  }, [stats]);

  const getPlayerStaffDetails = (plr) => {
    const {
      player_id,
      stats: playerState = {},
      player = "",
    } = plr;
    const {
      goals = {},
      fouls = {},
      cards = {},
      in_play = {},
      conversion_rate = "",
    } = playerState;
    let playerStateIcons = [];
    if (Number(goals?.total) > 0) {
      const gls = new Array(Number(goals?.total)).fill(icons?.goal?.icon_png_light || icons?.goal?.icon_png_dark || "");
      playerStateIcons.push(...gls);
    }
    if (Number(fouls?.total) > 0) {
      const fls = new Array(Number(fouls?.total)).fill(icons?.foul?.icon_png_light || icons?.foul?.icon_png_dark || "");
      playerStateIcons.push(...fls);
    }
    if (Number(cards?.total) > 0) {
      if (Number(cards?.reds) > 0) {
        const rCards = new Array(Number(cards?.reds)).fill(icons["red-card"]?.icon_png_light || icons["red-card"]?.icon_png_dark || "");
        playerStateIcons.push(...rCards);
      }
      if (Number(cards?.yellows) > 0) {
        const yCards = new Array(Number(cards?.reds)).fill(icons["yellow-card"]?.icon_png_light || icons["yellow-card"]?.icon_png_dark || "");
        playerStateIcons.push(...yCards);
      }
    }
    if (Number(in_play?.total) > 0) {
      if (Number(in_play?.block) > 0) {
        const blocks = new Array(Number(in_play?.block)).fill(icons?.block?.icon_png_light || icons["red-card"]?.icon_png_dark || "");
        playerStateIcons.push(...blocks);
      }
      if (Number(in_play?.steal) > 0) {
        const steals = new Array(Number(in_play?.steal)).fill(icons?.steal?.icon_png_light || icons["yellow-card"]?.icon_png_dark || "");
        playerStateIcons.push(...steals);
      }
    }
    return {
      player,
      player_id,
      conversion_rate,
      playerStateIcons,
    };
  };

  const renderPlayerStaff = (plr, ind, index, playersLength = 0) => {
    const { player = "", player_id, playerStateIcons = [], conversion_rate = "" } = plr;
    return (
      <View
        key={`${player_id}`}
        style={[
          styles.playerStyle(index, ind),
          ind === playersLength - 1 ? { borderBottomWidth: 0 } : undefined,
          { alignItems: index % 2 == 0 ? "flex-end" : "flex-start" },
        ]}
      >
        <TextMarquee duration={15000} loop style={styles.playerName}>{player}</TextMarquee>
        <View style={styles.statsIconContainer}>
          {
            playerStateIcons.map((i, pIndex) => (
              <FastImage
                key={`${i}-${pIndex}`}
                source={{ uri: i }}
                style={styles.statsIcon}
                resizeMode={FastImage.resizeMode.cover}
              />
            ))
          }
        </View>
        {
          conversion_rate ? (
            <View style={{ marginTop: 3, alignItems: index % 2 == 0 ? "flex-end" : "flex-start" }}>
              <Text style={styles.playerName}>Conversion Rate:</Text>
              <Text style={styles.playerName}>{conversion_rate}%</Text>
            </View>
          ) : null
        }
      </View>
    );
  };

  const renderPlayerState = (item, index) => {
    const { players = [] } = item;
    return (
      <View key={`player-state-${index}`} style={[styles.playerStateContainer, { width: "50%" }]}>
        {players.map((plr, ind) => renderPlayerStaff(plr, ind, index, players.length))}
      </View>
    );
  };

  const renderFooterComponent = () => {
    const goal = icons?.goal?.icon_png_light || icons?.goal?.icon_png_dark || "";
    const foul = icons?.foul?.icon_png_light || icons?.foul?.icon_png_dark || "";
    const block = icons?.block?.icon_png_light || icons?.block?.icon_png_dark || "";
    const steal = icons?.steal?.icon_png_light || icons?.steal?.icon_png_dark || "";
    const redCard = icons["red-card"]?.icon_png_light || icons["red-card"]?.icon_png_dark || "";
    const yellowCard = icons["yellow-card"]?.icon_png_light || icons["yellow-card"]?.icon_png_dark || "";

    const team1Staff = teams[0] && teams[0].staff ? teams[0].staff : [];
    const team2Staff = teams[1] && teams[1].staff ? teams[1].staff : [];
    return (
      <View style={[styles.footerContainer]}>
        {
          (team1Staff.length > 0) || (team2Staff.length > 0) ? (
            <Fragment>
              <View style={styles.footerTitleContainer(primary2)}>
                <Text style={styles.footerTitleTxt}>Staff</Text>
              </View>
              <View style={styles.staffContainer}>
                <View style={styles.playerStateContainer}>
                  {team1Staff.map((plr, ind) => renderPlayerStaff(plr, ind, 0, team1Staff.length))}
                </View>
                <View style={styles.playerStateContainer}>
                  {team2Staff.map((plr, ind) => renderPlayerStaff(plr, ind, 0, team1Staff.length))}
                </View>
              </View>
            </Fragment>
          ) : null
        }
        <View style={styles.footerTitleContainer(primary2)}>
          <Text style={styles.footerTitleTxt}>Key</Text>
        </View>
        {goal ? (
          <View style={styles.keyDataContainer}>
            <FastImage resizeMode={FastImage.resizeMode.cover} style={styles.keyIcon} source={{ uri: goal }} />
            <Text style={styles.keyName}>Goal</Text>
          </View>
        ) : null}
        {foul ? (
          <View style={styles.keyDataContainer}>
            <FastImage resizeMode={FastImage.resizeMode.cover} style={styles.keyIcon} source={{ uri: foul }} />
            <Text style={styles.keyName}>Foul</Text>
          </View>
        ) : null}
        {block ? (
          <View style={styles.keyDataContainer}>
            <FastImage resizeMode={FastImage.resizeMode.cover} style={styles.keyIcon} source={{ uri: block }} />
            <Text style={styles.keyName}>Block</Text>
          </View>
        ) : null}
        {steal ? (
          <View style={styles.keyDataContainer}>
            <FastImage resizeMode={FastImage.resizeMode.cover} style={styles.keyIcon} source={{ uri: steal }} />
            <Text style={styles.keyName}>Steal</Text>
          </View>
        ) : null}
        {redCard ? (
          <View style={styles.keyDataContainer}>
            <FastImage resizeMode={FastImage.resizeMode.cover} style={styles.keyIcon} source={{ uri: redCard }} />
            <Text style={styles.keyName}>Red Card</Text>
          </View>
        ) : null}
        {yellowCard ? (
          <View style={styles.keyDataContainer}>
            <FastImage resizeMode={FastImage.resizeMode.cover} style={styles.keyIcon} source={{ uri: yellowCard }} />
            <Text style={styles.keyName}>Yellow Card</Text>
          </View>
        ) : null}
      </View>
    );
  };

  if (!userId || userId == -1) {
    return (
      <View style={styles.playerStatsContainer}>
        <EmptyView message="You need to register/login if you want to see player stats" />
      </View>
    );
  }
  return (
    <View style={styles.playerStatsContainer}>
      {
        teams.length === 0 ? (
          <EmptyView message="No player stats found" />
        ) : (
          <Fragment>
            <View style={{ width: "100%", flexDirection: "row", alignItems: "flex-start", flexWrap: "wrap" }}>
              {teams.map(renderPlayerState)}
            </View>
            {renderFooterComponent()}
          </Fragment>
        )
      }
      {/* <FlatList
        data={teams}
        numColumns={2}
        scrollEnabled={false}
        nestedScrollEnabled={true}
        renderItem={renderPlayerState}
        keyExtractor={(t) => `${t.team_id}`}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooterComponent}
        contentContainerStyle={styles.scrollContainer}
        ListEmptyComponent={() => {
          if (!dataFetching) {
            return <EmptyView message="No player stats found" />;
          } else {
            return null;
          }
        }}
      /> */}
    </View>
  );
};
