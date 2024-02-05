import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Linking,
  Pressable,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

import TextMarquee from "../TextMarquee";

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import styles from "./ProgramComponentStyle";
import APIs from "../../services/api";
import FastImage from "react-native-fast-image";

export default (props) => {
  const { index, isLastProgram = false, data = {}, onPress } = props;
  const [componentHeight, setComponentHeight] = useState(0);
  const [programData, setProgramData] = useState(data);

  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  const isFirst = index === 0;
  const {
    id,
    date = "",
    name = "",
    team1 = "",
    team2 = "",
    venue = "",
    status = "",
    end_time = "",
    start_time = "",
    scoresheet = "",
    description = "",
    team1_score = "",
    team2_score = "",
    team1_logo = "",
    team2_logo = "",
    ref1 = "",
    ref2 = "",
    fixture_number,
    my_favourite = false,
    info_program = false,
    show_logos = false
  } = programData;

  const isCompleted = !!status && (status.toLowerCase() === "completed");

  useEffect(() => {
    setProgramData(data);
  }, [data]);

  const getLineStyle = () => {
    if (isFirst && isLastProgram) {
      return {
        width: 0,
        height: componentHeight * 0.6,
      };
    } else if (isFirst) {
      return {
        height: componentHeight * 0.6,
        top: 30,
      };
    } else if (isLastProgram) {
      return {
        height: componentHeight * 0.6,
        top: -15,
      };
    } else {
      return {
        height: componentHeight,
        top: 0,
      };
    }
  };

  const getIncompleteDot = () => {
    if (isFirst) {
      return {
        top: "30%",
      };
    } else if (isLastProgram) {
      return {
        top: "30%",
      };
    } else {
      return {
        top: "45%",
      };
    }
  };

  const title = name || `${team1} vs ${team2}`;
  let fullDateTime = "";

  if (date) {
    const eDate = moment(date).format("DD MMM");
    fullDateTime += eDate;
  }

  if (start_time) {
    const eStartTime = moment(`${date} ${start_time}`).format("HH:mm");
    fullDateTime += `${fullDateTime.length > 0 ? " | " : ""}${eStartTime}`;
  }

  if (end_time) {
    const eEndTime = moment(`${date} ${end_time}`).format("HH:mm");
    fullDateTime += `${fullDateTime.length > 0 ? " - " : ""}${eEndTime}`;
  }

  const onFavouritePress = async () => {
    const userId = await AsyncStorage.getItem("@userId");
    if (!userId || userId == -1) {
      hFunctions.showNotificationMessage("Favourite Warning", "You need to register/login if you want to favourite this program", {
        type: "warning",
      });
      return null;
    }
    try {
      const programUpdateData = {
        program_id: id,
        favourite: !my_favourite,
      };
      const res = await APIs.setEventProgramFavourite(programUpdateData, { user_id: userId });
      const { message, status: resStatus } = res.data;
      hFunctions.showNotificationMessage("Program Update", message, {
        type: "success",
      });
      if (resStatus.toLowerCase() === "success") {
        setProgramData({
          ...programData,
          my_favourite: !my_favourite,
          favourites: !my_favourite === true ? 1 : 0,
        });
      }
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Event Update Error", errorMessage.trim(), {
        type: "danger",
      });
    }
  };

  return (
    // <View
    //   onLayout={({ nativeEvent }) => {
    //     const { height } = nativeEvent.layout;
    //     if (componentHeight === 0) { setComponentHeight(height); }
    //   }}
    //   style={styles.programContainer}
    // >
    //   <View style={styles.leftContainer}>
    //     <View
    //       style={[
    //         styles.lineStyle,
    //         getLineStyle(),
    //       ]}
    //     />
    //     <View style={[
    //       styles.incompleteDot(primary2),
    //       getIncompleteDot(),
    //       // isFirst ? styles.completeDot(primary2) : undefined,
    //     ]} />
    //   </View>
    //   <Pressable
    //     onPress={onPress}
    //     style={[
    //       styles.programDataContainer,
    //       { borderBottomWidth: isLastProgram ? 0 : 1 },
    //     ]}
    //   >
    //     <View style={{ flex: scoresheet ? 0.9 : 0.95 }}>
    //       {
    //         isCompleted ? (
    //           <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
    //             {fullDateTime ? (
    //               <View style={{ maxWidth: "60%" }}>
    //                 <Text style={styles.programTime}>{fullDateTime}</Text>
    //               </View>
    //             ) : null}
    //             {venue ? (
    //               <View style={{ maxWidth: "40%", alignItems: "flex-end" }}>
    //                 <Text style={styles.programVenue(primary2)}>{venue}</Text>
    //               </View>
    //             ) : null}
    //           </View>
    //         ) : null
    //       }
    //       {title ? <TextMarquee duration={15000} loop style={styles.programName(primary2)}>{title.replace(/(<([^>]+)>)/ig, '')}</TextMarquee> : null}
    //       {(!isCompleted && fullDateTime) ? <Text numberOfLines={1} style={styles.programTime}>{fullDateTime}</Text> : null}
    //       {description != "" ? <Text numberOfLines={1} style={[styles.programTime, { paddingTop: 5 }]}>{description}</Text> : null}
    //       {(!isCompleted && venue) ? <TextMarquee duration={15000} loop style={styles.programVenue(primary2)}>{venue}</TextMarquee> : null}
    //       {(team1_score !== '' && team2_score !== '') ? <Text style={styles.programTime}>{team1_score} - {team2_score}</Text> : null}
    //     </View>
    //     {scoresheet ? <DownloadButton link={scoresheet} /> : null}
    //     <Pressable onPress={() => onFavouritePress()}>
    //       <AntDesign name={my_favourite ? "heart" : "hearto"} size={25} color={primary1 || "#2E3A59"} />
    //     </Pressable>
    //   </Pressable>
    // </View>

    show_logos ?
      <View
        onLayout={({ nativeEvent }) => {
          const { height } = nativeEvent.layout;
          if (componentHeight === 0) setComponentHeight(height);
        }}
        style={styles.programContainer}
      >
        <View style={styles.leftContainer}>
          <View
            style={[
              styles.lineStyle,
              getLineStyle(),
            ]}
          />
          <View style={[
            styles.incompleteDot(primary2),
            getIncompleteDot(),
            // isFirst ? styles.completeDot(primary2) : undefined,
          ]} />
        </View>

        <Pressable
          onPress={onPress}
          style={[
            styles.programDataContainer,
            { borderBottomWidth: isLastProgram ? 0 : 1 }
          ]}
        >
          <View style={{ flex: scoresheet ? 0.9 : 0.95 }}>
            {
              <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                {fullDateTime ? (
                  <View style={{ maxWidth: "60%" }}>
                    <Text style={styles.programTime}>{fullDateTime}</Text>
                  </View>
                ) : null}
                {venue ? (
                  <View style={{ maxWidth: "40%", alignItems: "flex-end" }}>
                    <Text style={[styles.programVenue(primary2), { marginTop: 0 }]}>{venue}</Text>
                  </View>
                ) : null}
              </View>
            }

            {/* {title ? <TextMarquee duration={15000} loop style={styles.programName(primary2)}>{title.replace(/(<([^>]+)>)/ig, '')}</TextMarquee> : null} */}
            {/* {(!isCompleted && fullDateTime) ? <Text numberOfLines={1} style={styles.programTime}>{fullDateTime}</Text> : null} */}
            {/* -----------Team Logos---------- */}

            {
              !info_program &&
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, width: '100%' }} >

                <View style={{ width: '35%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                  <View style={{ width: '55%', alignItems: 'flex-end' }}>
                    <Text style={[styles.teamName(primary2), { textAlign: 'right' }]}>{team1}</Text>
                  </View>
                  <View style={{ width: '45%', alignItems: 'center' }}>
                    <FastImage
                      source={{ uri: team1_logo }}
                      resizeMode={FastImage.resizeMode.contain}
                      style={[styles.teamLogo]}
                    />
                  </View>
                </View>

                <View style={{ width: '24%', alignItems: 'center' }}>
                  <Text numberOfLines={1} style={styles.fixtureNo}>{fixture_number}</Text>
                  <View style={{ height: 23, width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 4, backgroundColor: primary2 }}>
                    <Text style={styles.teamScore('#fff')}>{isCompleted ? `${team1_score} - ${team2_score}` : 'VS'}</Text>
                  </View>
                </View>

                <View style={{ width: '35%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                  <View style={{ width: '50%', alignItems: 'center' }}>
                    <FastImage
                      source={{ uri: team2_logo }}
                      resizeMode={FastImage.resizeMode.contain}
                      style={[styles.teamLogo]}
                    />
                  </View>
                  <View style={{ width: '50%' }}>
                    <Text style={styles.teamName(primary2)}>{team2}</Text>
                  </View>
                </View>
              </View>
            }


            {/* {(!isCompleted && venue) ? <TextMarquee duration={15000} loop style={styles.programVenue(primary2)}>{venue}</TextMarquee> : null} */}
            {/* {(info_program && description) ? <Text style={styles.programVenue(primary2)}>{description}</Text> : null} */}
            {/* {(team1_score !== "" && team2_score !== "") ? <Text style={styles.programTime}>{team1_score} - {team2_score}</Text> : null} */}


            {
              (!!ref1 && !!ref2) &&
              <Text numberOfLines={2} style={styles.refrees}>{`Refs: ${ref1} / ${ref2}`}</Text>
            }

            {
              (name) &&
              <Text numberOfLines={2} style={[styles.refrees, { textAlign: 'center' }]}>{name}</Text>
            }

            {
              description &&
              <Text numberOfLines={2} style={styles.matchStage(primary2)}>{description}</Text>
            }

          </View>

          {scoresheet ? <DownloadButton link={scoresheet} /> : null}
          <Pressable onPress={() => onFavouritePress()}>
            <AntDesign name={my_favourite ? "heart" : "hearto"} size={25} color={primary1 || "#2E3A59"} />
          </Pressable>
        </Pressable>
      </View>
      :
      <View
        onLayout={({ nativeEvent }) => {
          const { height } = nativeEvent.layout;
          if (componentHeight === 0) setComponentHeight(height);
        }}
        style={styles.programContainer}
      >
        <View style={styles.leftContainer}>
          <View
            style={[
              styles.lineStyle,
              getLineStyle(),
            ]}
          />
          <View style={[
            styles.incompleteDot(primary2),
            getIncompleteDot(),
            // isFirst ? styles.completeDot(primary2) : undefined,
          ]} />
        </View>

        <Pressable
          onPress={onPress}
          style={[
            styles.programDataContainer,
            { borderBottomWidth: isLastProgram ? 0 : 1 }
          ]}
        >
          <View style={{ flex: scoresheet ? 0.9 : 0.95 }}>
            {
              <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                {fullDateTime ? (
                  <View style={{ maxWidth: "60%" }}>
                    <Text style={styles.programTime}>{fullDateTime}</Text>
                  </View>
                ) : null}
                {venue ? (
                  <View style={{ maxWidth: "40%", alignItems: "flex-end" }}>
                    <Text style={[styles.programVenue(primary2), { marginTop: 0 }]}>{venue}</Text>
                  </View>
                ) : null}
              </View>
            }

            {/* {title ? <TextMarquee duration={15000} loop style={styles.programName(primary2)}>{title.replace(/(<([^>]+)>)/ig, '')}</TextMarquee> : null} */}
            {/* {(!isCompleted && fullDateTime) ? <Text numberOfLines={1} style={styles.programTime}>{fullDateTime}</Text> : null} */}
            {/* -----------Team Logos---------- */}

            {
              !info_program &&
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, width: '100%' }} >

                <View style={{ width: '35%' }}>
                  <Text style={[styles.teamName(primary2), { textAlign: 'right' }]}>{team1}</Text>
                </View>

                <View style={{ width: '24%', alignItems: 'center' }}>
                  <Text numberOfLines={1} style={styles.fixtureNo}>{fixture_number}</Text>
                  <View style={{ height: 23, width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 4, backgroundColor: primary2 }}>
                    <Text style={styles.teamScore('#fff')}>{isCompleted ? `${team1_score} - ${team2_score}` : 'VS'}</Text>
                  </View>
                </View>

                <View style={{ width: '35%', }}>
                  <Text style={styles.teamName(primary2)}>{team2}</Text>
                </View>
              </View>
            }


            {/* {(!isCompleted && venue) ? <TextMarquee duration={15000} loop style={styles.programVenue(primary2)}>{venue}</TextMarquee> : null} */}
            {/* {(info_program && description) ? <Text style={styles.programVenue(primary2)}>{description}</Text> : null} */}
            {/* {(team1_score !== "" && team2_score !== "") ? <Text style={styles.programTime}>{team1_score} - {team2_score}</Text> : null} */}


            {
              (!!ref1 && !!ref2) &&
              <Text numberOfLines={2} style={styles.refrees}>{`Refs: ${ref1} / ${ref2}`}</Text>
            }

            {
              (name) &&
              <Text numberOfLines={2} style={[styles.refrees, { textAlign: 'center' }]}>{name}</Text>
            }

            {
              description &&
              <Text numberOfLines={2} style={styles.matchStage(primary2)}>{description}</Text>
            }

          </View>

          {scoresheet ? <DownloadButton link={scoresheet} /> : null}
          <Pressable onPress={() => onFavouritePress()}>
            <AntDesign name={my_favourite ? "heart" : "hearto"} size={25} color={primary1 || "#2E3A59"} />
          </Pressable>
        </Pressable>
      </View>
  );
};

const DownloadButton = (props) => {
  const { link = "" } = props;
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  const [downloading, setDownloading] = useState(false);

  const onDownloadPress = async () => {
    try {
      if (link && hFunctions.hasUrlPDF(link)) {
        setDownloading(true);
        hFunctions.fileDownload(
          link,
          null,
          async ({ fileContentUrl }) => {
            setDownloading(false);
            hFunctions.openFile({ fileUrl: fileContentUrl, link });
          },
          (error) => {
            setDownloading(false);
            const errorMessage = hFunctions.getErrorMessage(error);
            hFunctions.showNotificationMessage("File Download Error", errorMessage.trim(), {
              type: "danger",
            });
          }
        );
      } else if (link) {
        await Linking.openURL(link);
      }
    } catch (error) { }
  };

  return (
    <>
      {
        downloading ? (
          <ActivityIndicator size="large" color={primary1 || "#062D5B"} />
        ) : (
          <Pressable onPress={onDownloadPress}>
            <AntDesign name="download" size={25} color={primary1 || "#062D5B"} />
          </Pressable>
        )
      }
    </>
  );
};
