import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  UIManager,
  Pressable,
  ScrollView,
  LayoutAnimation,
  useWindowDimensions,
  Platform,
  Image,
} from "react-native";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
// import Share from "react-native-share";
import FastImage from "react-native-fast-image";
// import { TabView, TabBar } from "react-native-tab-view";
import FontAwesome from "react-native-vector-icons/FontAwesome";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { captureRef, releaseCapture } from "react-native-view-shot";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HeaderComponent from "../../components/HeaderComponent";
import LoadingView from "../../components/LoadingView";
import GameCommentry from "./GameCommentry";
import UpcomingGames from "./UpcomingGames";
import PlayerStats from "./PlayerStats";
import GameStats from "./GameStats";

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import { animtionValue } from "../../services/data";
import styles from "./GameDetailsStyle";
import APIs from "../../services/api";
import AddScore from "./AddScore";

const GameDetails = ({ route }) => {
  const { programParams = {} } = route?.params ?? {};
  const { event_id, program_id, eventSubType, background_image } =
    programParams;

  const { icons = {}, currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  // const [sharing, setSharing] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [loader, setLoader] = useState(false);
  const [programDetails, setProgramDetails] = useState({});
  const [programCommentry, setProgramCommentry] = useState({});
  const [programStats, setProgramStats] = useState({});
  const [playerStats, setPlayerStats] = useState({});
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [userId, setUserId] = useState(null);
  const [index, setIndex] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [routes] = useState([
    {
      key: "comentary",
      title: "Commentary",
      imgUrl:
        icons?.comment?.icon_png_light || icons?.comment?.icon_png_dark || "",
    },
    {
      key: "player_stats",
      title: "Player Stats",
      imgUrl:
        icons?.players?.icon_png_light || icons?.players?.icon_png_dark || "",
    },
    {
      key: "game_stats",
      title: "Game Stats",
      imgUrl: icons?.stats?.icon_png_light || icons?.stats?.icon_png_dark || "",
    },
    {
      key: "upcoming_games",
      title: "Upcoming games",
      imgUrl:
        icons["water-polo"]?.icon_png_light ||
        icons["water-polo"]?.icon_png_dark ||
        "",
    },
    {
      key: "score",
      title: "Score",
      imgUrl:
        icons["prize-giving"]?.icon_png_light ||
        icons["prize-giving"]?.icon_png_dark ||
        "",
    },
  ]);
  const [ignoreTabs, setIgnoreTabs] = useState([]);
  const [tabWidths, setTabWidths] = useState({
    comentary: 0,
    player_stats: 0,
    game_stats: 0,
    upcoming_games: 0,
  });
  let scrollY = useRef(new Animated.Value(0)).current;
  const { HEADER_MAX_HEIGHT, GAME_HEADER_MAX_HEIGHT, HEADER_SCROLL_DISTANCE } =
    animtionValue(false);
  const tabScrollView1 = useRef();
  const tabScrollView2 = useRef();
  const { width, height } = useWindowDimensions();
  let apiCallInterval = useRef();
  let scoreImageContainer = useRef();

  const [MAX_HEIGHT, setMaxHeight] = useState(HEADER_MAX_HEIGHT);

  const {
    team1 = "",
    team2 = "",
    status = "",
    period = "",
    team1_label = "",
    team2_label = "",
    team1_score = "",
    team2_score = "",
  } = programDetails;

  useEffect(() => {
    (async () => {
      const uid = await AsyncStorage.getItem("@userId");
      setUserId(uid);
    })();
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    return () => {
      if (apiCallInterval.current) {
        clearInterval(apiCallInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (userId) {
      getProgramDetails();
    }
  }, [userId]);

  useEffect(() => {
    const displayRoutes = routes.filter((ro) => !ignoreTabs.includes(ro.key));
    if (displayRoutes.length > 2) {
      if (index === 0 && showLeftArrow) {
        setShowLeftArrow(false);
      } else if (index !== 0 && !showLeftArrow) {
        setShowLeftArrow(true);
      }
      if (index === displayRoutes.length - 1 && showRightArrow) {
        setShowRightArrow(false);
      } else if (index !== displayRoutes.length - 1 && !showRightArrow) {
        setShowRightArrow(true);
      }
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [index, ignoreTabs]);

  useEffect(() => {
    apiCallInterval.current = setInterval(() => {
      if (userId && !loader) {
        setLoader(true);
        getProgramDetails();
        getScrores();
      }
    }, 30 * 1000);
  }, [userId]);

  useEffect(() => {
    if (period != "") {
      setMaxHeight(GAME_HEADER_MAX_HEIGHT);
    } else {
      setMaxHeight(HEADER_MAX_HEIGHT);
    }
  }, [period]);

  const onRefreshPress = () => {
    if (!loader) {
      setLoader(true);
      getProgramDetails();
      getScrores();
    }
  };

  const getProgramDetails = async () => {
    try {
      const res = await new Promise.all([
        APIs.getProgramDetails({ event_id, program_id }, { user_id: userId }),
        apiCall(
          userId != -1
            ? APIs.getProgramCommentry(
                { event_id, program_id },
                { user_id: userId }
              )
            : null
        ),
        apiCall(
          userId != -1
            ? APIs.getProgramStats(
                { event_id, program_id },
                { user_id: userId }
              )
            : null
        ),
        apiCall(
          userId != -1
            ? APIs.getUpcomingPrograms(
                { event_id, program_id },
                { user_id: userId }
              )
            : null
        ),
        apiCall(
          userId != -1
            ? APIs.getPlayerStats(
                { event_id, program_id, details: true },
                { user_id: userId }
              )
            : null
        ),
      ]);
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      const pDetails = res[0].data || {};
      console.log("isShowScoring...", res[0].data.show_scoring);
      setProgramDetails((lastStats) => ({
        ...lastStats,
        ...pDetails,
      }));
      let ignrTbs = [];
      if (
        isObject(res[0].data) &&
        !isEmpty(res[0].data) &&
        res[0].data.show_scoring == false
      ) {
        ignrTbs.push("score");
      }
      if (isObject(res[1].data) && !isEmpty(res[1].data)) {
        setProgramCommentry(res[1].data || {});
      } else {
        ignrTbs.push("comentary");
      }
      if (isObject(res[2].data) && !isEmpty(res[2].data)) {
        setProgramStats(res[2].data || {});
      } else {
        if (!userId || userId != -1) {
          ignrTbs.push("game_stats");
        }
      }
      if (isObject(res[3].data?.programs)) {
        setUpcomingGames(res[3].data?.programs || []);
      } else {
        if (!userId || userId != -1) {
          ignrTbs.push("upcoming_games");
        }
      }
      if (isObject(res[4].data) && !isEmpty(res[4].data)) {
        setPlayerStats(res[4].data || {});
      } else {
        if (!userId || userId != -1) {
          ignrTbs.push("player_stats");
        }
      }
      setIgnoreTabs(ignrTbs);
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage(
        "Game Data Error",
        errorMessage.trim(),
        {
          type: "danger",
        }
      );
    } finally {
      setFetching(false);
      setLoader(false);
    }
  };

  const apiCall = (api) => {
    return new Promise(async (resolve) => {
      if (api === null) {
        resolve({ data: undefined });
      } else {
        try {
          const res = await api;
          resolve({ data: res?.data });
        } catch (e) {
          resolve({ data: undefined });
        }
      }
    });
  };

  const getScrores = async () => {
    try {
      const res = await APIs.getProgramScrore(
        { event_id, program_id },
        { user_id: userId }
      );
      const { data = {} } = res;
      if (data?.id) {
        setProgramDetails((lastStats) => ({
          ...lastStats,
          ...data,
        }));
      }
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage(
        "Game Score Error",
        errorMessage.trim(),
        {
          type: "danger",
        }
      );
    }
  };

  // const handleIndexChange = (ind) => {
  //   setIndex(ind);
  // };

  const onTabPress = (ind, key) => {
    setIndex(ind);
    const xValue = getScrollAmount(ind, key);
    tabScrollView1.current.scrollTo({ x: xValue, animated: true });
    tabScrollView2.current.scrollTo({ x: xValue, animated: true });
    const displayRoutes = routes.filter((ro) => !ignoreTabs.includes(ro.key));
    if (displayRoutes.length >= 5) {
      if (ind === 0 && showLeftArrow) {
        onLeftArrowShow(false);
      } else if (ind !== 0 && !showLeftArrow) {
        onLeftArrowShow(true);
      }
      if (ind === displayRoutes.length - 1 && showRightArrow) {
        onRightArrowShow(false);
      } else if (ind !== displayRoutes.length - 1 && !showRightArrow) {
        onLeftArrowShow(true);
      }
    }
  };

  const getScrollAmount = (ind, key) => {
    const centerDistance = Array.from({ length: ind + 1 }).reduce(
      (total, _, i) => {
        const tabWidth = tabWidths[key];
        return total + (ind === i ? tabWidth / 2 : tabWidth);
      },
      0
    );
    const tabBarWidth = tabWidths[key];
    const scrollAmount = centerDistance - width / 2.45;
    const maxDistance = width - tabBarWidth;
    const scrollValue = Math.max(Math.min(scrollAmount, maxDistance), 0);
    return scrollValue;
  };

  const scrollToLeft = () => {
    tabScrollView1.current.scrollTo({ x: 0, y: 0, animated: true });
    tabScrollView2.current.scrollTo({ x: 0, y: 0, animated: true });
    onLeftArrowShow(false);
    if (
      routes.filter((ro) => !ignoreTabs.includes(ro.key)).length >= 5 &&
      !showRightArrow
    ) {
      onRightArrowShow(true);
    }
  };

  const scrollToRight = () => {
    tabScrollView1.current.scrollToEnd({ animated: true });
    tabScrollView2.current.scrollToEnd({ animated: true });
    onRightArrowShow(false);
    if (
      routes.filter((ro) => !ignoreTabs.includes(ro.key)).length >= 5 &&
      !showLeftArrow
    ) {
      onLeftArrowShow(true);
    }
  };

  const onLeftArrowShow = (value) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    setShowLeftArrow(value);
  };

  const onRightArrowShow = (value) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    setShowRightArrow(value);
  };

  // const onSharePress = async () => {
  //   setSharing(true);
  //   const uId = await AsyncStorage.getItem("@userId");
  //   if (!uId || uId == -1) {
  //     hFunctions.showNotificationMessage("Share Warning", "You need to register/login if you want to share this event", {
  //       type: "warning",
  //     });
  //     return null;
  //   }
  //   let uri = "";
  //   try {
  //     uri = await captureRef(scoreImageContainer.current, {
  //       result: "tmpfile",
  //       quality: 1,
  //       format: "png",
  //     });
  //     const fileUrl = !uri.includes("file://") ? `file://${uri}` : uri;
  //     await Share.open({ url: fileUrl });
  //   } catch (error) {
  //     const errorMessage = hFunctions.getErrorMessage(error);
  //     hFunctions.showNotificationMessage("File Sharing Error", errorMessage.trim(), {
  //       type: "danger",
  //     });
  //   } finally {
  //     setSharing(false);
  //     if (uri) {
  //       releaseCapture(uri);
  //     }
  //   }
  // };

  const renderStatusView = (headerTranslate) => {
    if (status && status == "In Play") {
      return (
        <Animated.View
          style={[
            styles.statusBox,
            { transform: [{ translateY: headerTranslate }] },
          ]}
        >
          <Text style={styles.statusText}>In Progress</Text>
        </Animated.View>
      );
    } else if (status && status == "Completed") {
      return (
        <Animated.View
          style={[
            styles.statusBox,
            { transform: [{ translateY: headerTranslate }] },
          ]}
        >
          <Text style={styles.statusText}>Game finished</Text>
        </Animated.View>
      );
    } else {
      return null;
    }
  };

  const renderOpecityStatusView = (titleOpacity) => {
    if (status && status == "In Play") {
      return (
        <Animated.View style={[styles.statusBox, { opacity: titleOpacity }]}>
          <Text style={styles.statusText}>In Progress</Text>
        </Animated.View>
      );
    } else if (status && status == "Completed") {
      return (
        <Animated.View style={[styles.statusBox, { opacity: titleOpacity }]}>
          <Text style={styles.statusText}>Game finished</Text>
        </Animated.View>
      );
    } else {
      return null;
    }
  };

  const renderScene = ({ route: sRoute }) => {
    switch (sRoute.key) {
      case "comentary":
        return (
          <GameCommentry dataFetching={fetching} commentry={programCommentry} />
        );
      case "game_stats":
        return (
          <GameStats
            dataFetching={fetching}
            userId={userId}
            stats={programStats}
          />
        );
      case "player_stats":
        return (
          <PlayerStats
            dataFetching={fetching}
            userId={userId}
            stats={playerStats}
          />
        );
      case "upcoming_games":
        return (
          <UpcomingGames
            games={upcomingGames}
            dataFetching={fetching}
            navigationParams={{
              event_id,
              eventSubType,
              background_image,
            }}
          />
        );
      case "score":
        return (
          <AddScore
            eventId={event_id}
            programId={program_id}
            refreshData={() => {
              getProgramDetails();
            }}
          />
        );
      default:
        return null;
    }
  };

  const renderLabel = ({ route: lRoute, focused, color }) => (
    <Fragment>
      {lRoute?.imgUrl ? (
        // <FastImage
        //   style={styles.tabIconStyle}
        //   source={{ uri: lRoute.imgUrl }}
        //   resizeMode={FastImage.resizeMode.cover}
        //   tintColor={focused ? primary2 : (color || primary1)}
        // />
        <Image
          style={[
            styles.tabIconStyle,
            { tintColor: focused ? primary2 : color || primary1 },
          ]}
          source={{ uri: lRoute.imgUrl }}
          resizeMode={"cover"}
        />
      ) : null}
      <Text
        style={[
          styles.tabText(color || primary1),
          focused ? styles.activeTabText(primary2) : undefined,
        ]}
      >
        {lRoute.title}
      </Text>
    </Fragment>
  );

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: "clamp",
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  const titleTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, -12],
    extrapolate: "clamp",
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="Event Details"
        headerRight={() => (
          <Pressable
            onPress={() => onRefreshPress()}
            style={{ marginRight: 20 }}
          >
            <FontAwesome
              name="refresh"
              size={24}
              color={primary1 || "#062D5B"}
            />
          </Pressable>
        )}
      />
      {fetching ? (
        <LoadingView style={styles.loadingContainer} />
      ) : (
        <View style={{ flex: 1, zIndex: 10 }}>
          <Animated.ScrollView
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flex: 1, marginTop: MAX_HEIGHT }}>
              {renderStatusView(headerTranslate)}
              <Animated.View
                style={{
                  marginTop: 15,
                  transform: [{ translateY: headerTranslate }],
                }}
              >
                <View style={styles.tabScrollContainer}>
                  {showLeftArrow &&
                  (icons["chevron-left"]?.icon_png_dark ||
                    icons["chevron-left"]?.icon_png_light) ? (
                    <Pressable onPress={scrollToLeft}>
                      <FastImage
                        source={{
                          uri:
                            icons["chevron-left"]?.icon_png_dark ||
                            icons["chevron-left"]?.icon_png_light,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        style={styles.scrollLeftRightIcon}
                      />
                    </Pressable>
                  ) : null}
                  <ScrollView
                    horizontal
                    ref={tabScrollView1}
                    scrollEventThrottle={100}
                    onContentSizeChange={(contentWidth) => {
                      if (!showRightArrow && contentWidth > width) {
                        onRightArrowShow(true);
                      }
                    }}
                    onScrollEndDrag={({ nativeEvent }) => {
                      const {
                        layoutMeasurement,
                        targetContentOffset,
                        contentOffset,
                        contentSize,
                      } = nativeEvent;
                      const { x } = contentOffset;
                      let tcOffset = targetContentOffset;
                      if (isEmpty(targetContentOffset)) {
                        tcOffset = { ...contentOffset };
                      }
                      const { x: fx } = tcOffset;
                      if (tabScrollView2?.current) {
                        tabScrollView2.current.scrollTo({ x, animated: true });
                      }
                      const isScrollEnded =
                        layoutMeasurement.width + contentOffset.x >=
                        contentSize.width - 20;
                      if (fx > 0 && !showLeftArrow) {
                        onLeftArrowShow(true);
                      } else if (fx === 0 && showLeftArrow) {
                        onLeftArrowShow(false);
                      }

                      if (!isScrollEnded && fx > 0 && !showRightArrow) {
                        onRightArrowShow(true);
                      } else if (isScrollEnded && showRightArrow) {
                        onRightArrowShow(false);
                      }
                    }}
                    showsHorizontalScrollIndicator={false}
                  >
                    {routes
                      .filter((ro) => !ignoreTabs.includes(ro.key))
                      .map((r, ind) => {
                        const focused = ind === index;
                        return (
                          <View
                            key={r.key}
                            onLayout={({ nativeEvent }) => {
                              const { width: nWidth } = nativeEvent.layout;
                              if (r.key !== nWidth) {
                                setTabWidths({
                                  ...tabWidths,
                                  [`${r.key}`]: nWidth,
                                });
                              }
                            }}
                          >
                            <Pressable
                              style={[
                                styles.tabStyle,
                                focused
                                  ? styles.tabIndicator(primary2)
                                  : undefined,
                              ]}
                              onPress={onTabPress.bind(this, ind, r.key)}
                            >
                              {renderLabel({ route: r, focused })}
                            </Pressable>
                          </View>
                        );
                      })}
                  </ScrollView>
                  {showRightArrow &&
                  (icons["chevron-right"]?.icon_png_dark ||
                    icons["chevron-right"]?.icon_png_light) ? (
                    <Pressable onPress={scrollToRight}>
                      <FastImage
                        source={{
                          uri:
                            icons["chevron-right"]?.icon_png_dark ||
                            icons["chevron-right"]?.icon_png_light,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        style={styles.scrollLeftRightIcon}
                      />
                    </Pressable>
                  ) : null}
                </View>
              </Animated.View>
              <View
                style={{
                  flex: 1,
                  minHeight: height * 0.67,
                  paddingHorizontal: 15,
                }}
              >
                {renderScene({
                  route: routes.filter((ro) => !ignoreTabs.includes(ro.key))[
                    index
                  ],
                })}
              </View>
            </View>
          </Animated.ScrollView>

          <Animated.View
            style={[
              styles.header(primary1),
              {
                transform: [{ translateY: headerTranslate }],
                height: MAX_HEIGHT,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.imageContainer,
                {
                  height: MAX_HEIGHT,
                  opacity: imageOpacity,
                  transform: [{ translateY: imageTranslate }],
                },
              ]}
            >
              <FastImage
                style={styles.gameImage(MAX_HEIGHT)}
                ref={scoreImageContainer}
                source={{ uri: background_image }}
                resizeMode={FastImage.resizeMode.stretch}
              >
                <View style={styles.team1ScoreView(primary1)}>
                  <View style={styles.teamScoreView}>
                    {String(team1_score) ? (
                      <Text style={styles.scoreText}>{team1_score}</Text>
                    ) : null}
                    {team1 ? (
                      <View style={styles.teamNameBox}>
                        <Text numberOfLines={2} style={styles.teamName}>
                          {team1}
                        </Text>
                      </View>
                    ) : null}
                    {team1_label && ["Blue", "White"].includes(team1_label) ? (
                      <View style={styles.teamLblView(team1_label)}>
                        <Text style={styles.teamLblViewText(team1_label)}>
                          {team1_label}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.teamScoreView}>
                    {String(team2_score) ? (
                      <Text style={styles.scoreText}>{team2_score}</Text>
                    ) : null}
                    {team2 ? (
                      <View style={styles.teamNameBox}>
                        <Text numberOfLines={2} style={styles.teamName}>
                          {team2}
                        </Text>
                      </View>
                    ) : null}
                    {team2_label && ["Blue", "White"].includes(team2_label) ? (
                      <View style={styles.teamLblView(team2_label)}>
                        <Text style={styles.teamLblViewText(team2_label)}>
                          {team2_label}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.triangle} />
                  <Text style={styles.vsText(primary1)}>VS</Text>
                </View>
                {period != "" ? (
                  <View style={styles.periodView(primary1)}>
                    <Text style={styles.periodText}>{period}</Text>
                  </View>
                ) : null}
                {/* {
                      sharing ? null : (
                        <Pressable onPress={onSharePress} style={styles.shareButton}>
                          <Ionicons name="share-social-sharp" size={25} color="#fff" />
                        </Pressable>
                      )
                    } */}
                {loader ? (
                  <LoadingView style={styles.loadingContainer} />
                ) : null}
              </FastImage>
            </Animated.View>
          </Animated.View>

          <Animated.View
            style={[
              styles.bar,
              { transform: [{ translateY: titleTranslate }] },
            ]}
          >
            {period != "" ? (
              <Animated.View
                style={[styles.aniPeriodView, { opacity: titleOpacity }]}
              >
                <Text numberOfLines={1} style={styles.aniPeriodText}>
                  {period}
                </Text>
              </Animated.View>
            ) : null}
            <Animated.View
              style={{ flexDirection: "row", opacity: titleOpacity }}
            >
              {team1 ? (
                <View style={styles.aniScoreView}>
                  <Text style={styles.aniScoreText}>{team1_score}</Text>
                  <Text numberOfLines={1} style={styles.aniTeamName}>
                    {team1}
                  </Text>
                </View>
              ) : null}
              <Animated.View
                style={[styles.aniHD, { opacity: titleOpacity }]}
              />
              {team2 ? (
                <View style={styles.aniScoreView}>
                  <Text style={styles.aniScoreText}>{team2_score}</Text>
                  <Text numberOfLines={1} style={styles.aniTeamName}>
                    {team2}
                  </Text>
                </View>
              ) : null}
            </Animated.View>
            <Animated.View style={[styles.aniVD, { opacity: titleOpacity }]} />
            <Animated.View style={{ opacity: titleOpacity }}>
              <View style={styles.tabScrollContainer}>
                {showLeftArrow &&
                (icons["chevron-left"]?.icon_png_light ||
                  icons["chevron-left"]?.icon_png_dark) ? (
                  <Pressable onPress={scrollToLeft}>
                    <FastImage
                      source={{
                        uri:
                          icons["chevron-left"]?.icon_png_light ||
                          icons["chevron-left"]?.icon_png_dark,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                      style={styles.scrollLeftRightIcon}
                    />
                  </Pressable>
                ) : null}
                <ScrollView
                  horizontal
                  ref={tabScrollView2}
                  scrollEventThrottle={100}
                  onScrollEndDrag={({ nativeEvent }) => {
                    const {
                      layoutMeasurement,
                      targetContentOffset,
                      contentOffset,
                      contentSize,
                    } = nativeEvent;
                    const { x, y } = contentOffset;
                    let tcOffset = targetContentOffset;
                    if (isEmpty(targetContentOffset)) {
                      tcOffset = { ...contentOffset };
                    }
                    const { x: fx } = tcOffset;
                    if (tabScrollView1?.current) {
                      tabScrollView1.current.scrollTo({ x, y, animated: true });
                    }
                    const isScrollEnded =
                      layoutMeasurement.width + contentOffset.x >=
                      contentSize.width - 20;
                    if (fx > 0 && !showLeftArrow) {
                      onLeftArrowShow(true);
                    } else if (fx === 0 && showLeftArrow) {
                      onLeftArrowShow(false);
                    }

                    if (!isScrollEnded && fx > 0 && !showRightArrow) {
                      onRightArrowShow(true);
                    } else if (isScrollEnded && showRightArrow) {
                      onRightArrowShow(false);
                    }
                  }}
                  showsHorizontalScrollIndicator={false}
                >
                  {routes
                    .filter((ro) => !ignoreTabs.includes(ro.key))
                    .map((r, ind) => {
                      const focused = ind === index;
                      return (
                        <Pressable
                          key={r.key}
                          style={[
                            styles.tabStyle,
                            focused ? styles.tabIndicator(primary2) : undefined,
                          ]}
                          onPress={onTabPress.bind(this, ind, r.key)}
                        >
                          {renderLabel({ route: r, focused, color: "#fff" })}
                        </Pressable>
                      );
                    })}
                </ScrollView>
                {showRightArrow &&
                (icons["chevron-right"]?.icon_png_light ||
                  icons["chevron-right"]?.icon_png_dark) ? (
                  <Pressable onPress={scrollToRight}>
                    <FastImage
                      source={{
                        uri:
                          icons["chevron-right"]?.icon_png_light ||
                          icons["chevron-right"]?.icon_png_dark,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                      style={styles.scrollLeftRightIcon}
                    />
                  </Pressable>
                ) : null}
              </View>
            </Animated.View>
            <Animated.View
              style={{
                marginTop: 3,
                backgroundColor: "#FFFFFF",
                opacity: titleOpacity,
              }}
            >
              {renderOpecityStatusView(titleOpacity)}
            </Animated.View>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

export default GameDetails;
