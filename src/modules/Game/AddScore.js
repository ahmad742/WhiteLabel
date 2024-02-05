import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import EmptyView from "../../components/EmptyView";
import GradientButton from "../../components/GradientButton";
import APIs from "../../services/api";
import * as hFunctions from "../../services/helperFunctions";
import styles from "./GameDetailsStyle";

export default (props) => {
  const { eventId, programId, refreshData = () => {} } = props;
  const [userId, setUserId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [teamOneScore, setTeamOneScore] = useState("");
  const [teamTwoScore, setTeamTwoScore] = useState("");

  const teamOneRef = useRef(null);
  const teamTwoRef = useRef(null);

  useEffect(() => {
    (async () => {
      const uid = await AsyncStorage.getItem("@userId");
      setUserId(uid);
    })();
  }, [userId]);

  const updateMatchScore = async () => {
    teamOneRef.current.blur();
    teamTwoRef.current.blur();
    if (!!!teamOneScore && !!!teamTwoScore) {
      hFunctions.showNotificationMessage(
        "Error!",
        "Please add both team scores",
        {
          type: "danger",
        }
      );
      return;
    }
    if (!!!teamOneScore) {
      hFunctions.showNotificationMessage("Error!", "Please add team 1 score", {
        type: "danger",
      });
      return;
    }
    if (!!!teamTwoScore) {
      hFunctions.showNotificationMessage("Error!", "Please add team 2 score", {
        type: "danger",
      });
      return;
    }
    try {
      setIsUpdating(true);
      const res = await APIs.updateProgramScrore(
        {
          event_id: eventId,
          program_id: programId,
          team1_score: teamOneScore,
          team2_score: teamTwoScore,
        },
        { user_id: userId }
      );
      // console.log('updateMatchScore',res.data);

      hFunctions.showNotificationMessage(
        "Congratulations!",
        res?.data.message,
        {
          type: "success",
        }
      );
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Error!", errorMessage.trim(), {
        type: "danger",
      });
    } finally {
      setIsUpdating(false);
      refreshData();
      setTeamOneScore("");
      setTeamTwoScore("");
    }
  };

  const renderAddScore = () => {
    return (
      <View>
        <View style={styles.scoreContainer}>
          <View
            style={{
              width: "50%",
              alignItems: "center",
            }}
          >
            <Text style={styles.teamTitle}>{"Team 1 Score"}</Text>
            <Pressable
              onPress={() => teamOneRef.current.focus()}
              style={styles.scoreInput}
            >
              <TextInput
                ref={teamOneRef}
                placeholder=""
                onChangeText={(val) => setTeamOneScore(val)}
                value={teamOneScore}
                style={{
                  height: "100%",
                  fontSize: 35,
                  color: "#196391",
                  fontWeight: "bold",
                }}
              />
            </Pressable>
          </View>

          <View
            style={{
              width: "50%",
              alignItems: "center",
            }}
          >
            <Text style={styles.teamTitle}>{"Team 2 Score"}</Text>
            <Pressable
              onPress={() => teamTwoRef.current.focus()}
              style={styles.scoreInput}
            >
              <TextInput
                ref={teamTwoRef}
                placeholder=""
                onChangeText={(val) => setTeamTwoScore(val)}
                value={teamTwoScore}
                style={{
                  height: "100%",
                  fontSize: 35,
                  color: "#196391",
                  fontWeight: "bold",
                }}
              />
            </Pressable>
          </View>
        </View>

        <GradientButton
          text={"Update Score"}
          onPress={updateMatchScore}
          showLoading={isUpdating}
          gradientContainer={{ marginTop: 35, marginBottom: 15 }}
        />
      </View>
    );
  };

  return (
    <View style={styles.upcommingGamesContainer}>
      {!userId || userId == -1 ? (
        <View style={styles.statsContainer}>
          <EmptyView message="You need to register/login if you want to edit scores" />
        </View>
      ) : (
        renderAddScore()
      )}
    </View>
  );
};
