import AsyncStorage from "@react-native-async-storage/async-storage";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  UIManager,
  View,
  useWindowDimensions,
} from "react-native";
import FastImage from "react-native-fast-image";

import HeaderComponent from "../../components/HeaderComponent";
import LoadingView from "../../components/LoadingView";
import ViewMarquee from "../../components/ViewMarquee";
import EventJudges from "./EventJudges";
import EventPerformers from "./EventPerformers";
import EventPhotos from "./EventPhotos";
import EventProgram from "./EventProgram";
import EventProjectsComponent from "./EventProjects";
import EventResources from "./EventResources";
import EventStreams from "./EventStreams";
import EventWelcome from "./EventWelcome";
// import EventResult from './EventResult';
import EventPools from "./EventPools";
import EventTeams from "./EventTeams";

import { useCustomer } from "../../context/CustomerContext";
import APIs from "../../services/api";
import { animtionValue } from "../../services/data";
import styles from "./EventDetailsStyle";

const EventDetails = ({ route }) => {
  const [fetchingTeamsPlayers, setFetchingTeamsPlayers] = useState(true);
  const [userID, setUserID] = useState("");
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [titleSponsors, setTitleSponsors] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [eventProjects, setEventProjects] = useState([]);
  const [eventJudges, setEventJudges] = useState([]);
  // const [topPerformers, setTopPerformers] = useState([]);
  const [result, setResult] = useState([]);
  const [eventData, setEventData] = useState({});
  const [pools, setPools] = useState({});
  const [documents, setDocuments] = useState([]);
  const [streams, setStreams] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [teams, setTeams] = useState([]);
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [eventStats, setEventStats] = useState([]);
  const [ignoreTabs, setIgnoreTabs] = useState([]);
  const [placings, setPlacings] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [tabWidths, setTabWidths] = useState({
    welcome: 0,
    program: 0,
    streams: 0,
    pools: 0,
    teams: 0,
    photos: 0,
    result: 0,
    resources: 0,
    performers: 0,
    topPerformers: 0,
  });
  const { eventId: event_id = "" } = route?.params ?? {};
  const { icons = {}, currentCustomer = {} } = useCustomer();
  const { primary1 = "#20366B", primary2 = "#196391" } = currentCustomer;
  let scrollY = useRef(new Animated.Value(0)).current;
  const { HEADER_MAX_HEIGHT, HEADER_SCROLL_DISTANCE } = animtionValue(
    titleSponsors.length > 0
  );
  const TITLE_SPONSOR_HEIGHT = titleSponsors.length ? 70 : 0;

  const tabScrollView1 = useRef();
  const tabScrollView2 = useRef();
  const { width, height } = useWindowDimensions();
  const {
    name = "",
    date = "",
    end_date = "",
    image = "",
    extras = {},
    description = "",
    event_sub_type = "",
    icon_png_light = "",
    background_image = "",
  } = eventData;
  useEffect(() => {
    if (
      (Platform.OS === "android",
      UIManager.setLayoutAnimationEnabledExperimental)
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    getEventsData();
  }, []);

  useEffect(() => {
    let tabs = [
      {
        key: "welcome",
        title: "Welcome",
        imgUrl:
          icons?.welcome?.icon_png_light || icons?.welcome?.icon_png_dark || "",
      },
      {
        key: "program",
        title: "Programme",
        imgUrl: icons?.list?.icon_png_light || icons?.list?.icon_png_dark || "",
      },
      {
        key: "projects",
        title: "Projects",
        imgUrl: icons?.art?.icon_png_light || icons?.art?.icon_png_dark || "",
      },
      {
        key: "judges",
        title: "Judges",
        imgUrl:
          icons?.gavel?.icon_png_light || icons?.gavel?.icon_png_dark || "",
      },
      {
        key: "performers",
        title: "Performers",
        imgUrl:
          icons?.players?.icon_png_light || icons?.players?.icon_png_dark || "",
      },
      {
        key: "streams",
        title: "Streams",
        imgUrl:
          icons["live-streaming"]?.icon_png_light ||
          icons["live-streaming"]?.icon_png_dark ||
          "",
      },
      {
        key: "pools",
        title: "Pools",
        imgUrl:
          icons?.tournament?.icon_png_light ||
          icons?.tournament?.icon_png_dark ||
          "",
      },
      {
        key: "teams",
        title: "Teams",
        imgUrl:
          icons?.players?.icon_png_light || icons?.players?.icon_png_dark || "",
      },
      {
        key: "photos",
        title: "Photos",
        imgUrl:
          icons?.photography?.icon_png_light ||
          icons?.photography?.icon_png_dark ||
          "",
      },
      {
        key: "resources",
        title: "Info",
        imgUrl:
          icons?.download?.icon_png_light ||
          icons?.download?.icon_png_dark ||
          "",
      },
      // { key: 'top_performers', title: 'Performers', imgUrl: "" },
    ];
    if (event_sub_type.includes("Reps")) {
      // SPORTS
      tabs = tabs.filter(
        (t) =>
          ![
            "photos",
            "pools",
            "teams",
            "streams",
            "program",
            "performers",
            "projects",
            "judges",
          ].includes(t.key)
      );
    } else if (event_sub_type.includes("Interhouse")) {
      // SPORTS
      tabs = tabs.filter(
        (t) =>
          !["pools", "teams", "performers", "projects", "judges"].includes(
            t.key
          )
      );
    } else if (event_sub_type.includes("Derby Days")) {
      // SPORTS
      tabs = tabs.filter(
        (t) =>
          !["pools", "teams", "performers", "projects", "judges"].includes(
            t.key
          )
      );
    } else if (event_sub_type === "Social Responsibility") {
      // SPECIAL
      tabs = tabs.filter(
        (t) =>
          ![
            "pools",
            "streams",
            "program",
            "performers",
            "teams",
            "projects",
            "judges",
          ].includes(t.key)
      );
    } else if (
      // CULTURAL
      [
        "Debating",
        "Choir",
        "Competition",
        "Theatre",
        "Soiree",
        "Exhibition",
        "Drama",
        "Music",
        "Art",
      ].some((et) => event_sub_type.includes(et))
    ) {
      tabs = tabs.filter((t) => !["pools"].includes(t.key));
    } else if (
      // CULTURAL
      ["Debating", "Choir", "Competition"].some((et) =>
        event_sub_type.includes(et)
      )
    ) {
      tabs = tabs.filter(
        (t) => !["performers", "projects", "judges"].includes(t.key)
      );
    } else if (event_sub_type === "Expo") {
      // ACADEMICS
      tabs = tabs.filter(
        (t) => !["pools", "streams", "performers", "teams"].includes(t.key)
      );
    } else if (event_sub_type === "Initiatives") {
      // ACADEMICS
      tabs = tabs.filter(
        (t) =>
          ![
            "photos",
            "pools",
            "streams",
            "program",
            "performers",
            "teams",
            "projects",
            "judges",
          ].includes(t.key)
      );
    } else if (event_sub_type === "Prize Giving") {
      // ACADEMICS
      tabs = tabs.filter(
        (t) =>
          !["pools", "performers", "teams", "projects", "judges"].includes(
            t.key
          )
      );
    } else if (event_sub_type === "Matric Results") {
      // ACADEMICS
      tabs = tabs.filter(
        (t) =>
          ![
            "photos",
            "streams",
            "pools",
            "program",
            "teams",
            "projects",
            "judges",
          ].includes(t.key)
      );
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRoutes(tabs);
  }, [eventData]);

  const canApiCall = (type) => {
    if (
      (type === "sponsors" &&
        ["Reps", "Matric Results"].some((est) =>
          event_sub_type.includes(est)
        )) ||
      (type === "title_sponsors" &&
        ["Reps", "Matric Results"].some((est) =>
          event_sub_type.includes(est)
        )) ||
      (type === "programs" &&
        ["Reps", "Matric Results", "Social Responsibility", "Initiatives"].some(
          (est) => event_sub_type.includes(est)
        )) ||
      (type === "pools" &&
        [
          "Reps",
          "Expo",
          "Initiatives",
          "Prize Giving",
          "Matric Results",
          "Social Responsibility",
          "Interhouse",
          "Derby Days",
          "Debating",
          "Choir",
          "Competition",
          "Theatre",
          "Soiree",
          "Exhibition",
        ].some((est) => event_sub_type.includes(est))) ||
      (type === "streams" &&
        [
          "Reps",
          "Social Responsibility",
          "Expo",
          "Initiatives",
          "Matric Results",
        ].some((est) => event_sub_type.includes(est))) ||
      (type === "photos" &&
        ["Reps", "Initiatives", "Matric Results"].some((est) =>
          event_sub_type.includes(est)
        )) ||
      (type === "teams" &&
        [
          "Reps",
          "Interhouse",
          "Derby Days",
          "Theatre",
          "Soiree",
          "Exhibition",
          "Expo",
          "Initiatives",
          "Prize Giving",
          "Matric Results",
          "Social Responsibility",
        ].some((est) => event_sub_type.includes(est))) ||
      (type === "performers" &&
        [
          "Derby Days",
          "Interhouse",
          "Reps",
          "Debating",
          "Choir",
          "Competition",
          "Expo",
          "Initiatives",
          "Prize Giving",
          "Social Responsibility",
        ].some((est) => event_sub_type.includes(est))) ||
      (type === "projects" &&
        [
          "Derby Days",
          "Interhouse",
          "Reps",
          "Debating",
          "Choir",
          "Competition",
          "Expo",
          "Initiatives",
          "Prize Giving",
          "Social Responsibility",
        ].some((est) => event_sub_type.includes(est))) ||
      (type === "judges" &&
        [
          "Derby Days",
          "Interhouse",
          "Reps",
          "Debating",
          "Choir",
          "Competition",
          "Expo",
          "Initiatives",
          "Prize Giving",
          "Social Responsibility",
        ].some((est) => event_sub_type.includes(est)))
    ) {
      return false;
    } else {
      return true;
    }
  };

  const getEventsData = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      setUserID(userId);
      const res = await new Promise.all([
        apiCall(
          canApiCall("sponsors")
            ? APIs.getEvetSponsors({ event_id }, { user_id: userId })
            : null
        ),
        apiCall(
          canApiCall("title_sponsors")
            ? APIs.getEvetTitleSponsors({ event_id }, { user_id: userId })
            : null
        ),
        apiCall(
          canApiCall("programs")
            ? APIs.getEvetsPrograms({ event_id }, { user_id: userId })
            : null
        ),
        apiCall(
          canApiCall("pools")
            ? APIs.getEventPools({ event_id }, { user_id: userId })
            : null
        ),
        apiCall(APIs.getEventDocuments({ event_id }, { user_id: userId })),
        apiCall(
          canApiCall("streams")
            ? APIs.getEvetStreams({ event_id }, { user_id: userId })
            : null
        ),
        apiCall(
          canApiCall("photos")
            ? APIs.getEventPhotos({ event_id }, { user_id: userId })
            : null
        ),
        apiCall(
          canApiCall("teams")
            ? APIs.getEventTeams({ event_id }, { user_id: userId })
            : null
        ),
        apiCall(APIs.getEventDetails({ event_id }, { user_id: userId })),
        apiCall(APIs.getEventStat({ event_id }, { user_id: userId })),
        apiCall(APIs.getEventPlacing({ event_id }, { user_id: userId })),
        apiCall(
          canApiCall("performers")
            ? APIs.getEvetsPerformers({ event_id }, { user_id: userId })
            : null
        ),
        apiCall(
          canApiCall("projects")
            ? APIs.getEventsProjects({ event_id }, { user_id: userId })
            : null
        ),
        apiCall(
          canApiCall("judges")
            ? APIs.getEventsJudges({ event_id }, { user_id: userId })
            : null
        ),
        // apiCall(canApiCall("top_performers") ? APIs.getEvetsTopPerformers({ event_id }, { user_id: userId }) : null),
      ]);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      const allSponsors = res[0].data || [];
      const allTitleSponsors = res[1].data || [];
      const allPrograms = res[2].data?.programs || [];
      const allPoolsData = res[3].data || {};
      const allDocuments = res[4].data || [];
      const allStreams = res[5].data || [];
      const teamsData = res[7].data || [];
      const currentEventData = res[8].data || {};
      const eventStatData = res[9].data || [];
      const eventPlacings = res[10].data || {};
      const allPerformers = res[11].data || [];
      const allEventProjects = res[12].data || [];
      const allEventJudges = res[13].data || [];
      // const allTopPerformers = res[12].data || [];
      const allEntries = Object.entries(eventPlacings);
      let ePlacings = [];
      if (!isEmpty(eventPlacings) && allEntries.length > 1) {
        for (const [key, value] of allEntries) {
          ePlacings.push({
            id: key.match(/\d+/)[0],
            title: key,
            value,
          });
        }
      }
      const { event_sub_type: eventSubType = "" } = res[8].data || {};
      let ignrTbs = [];
      if (teamsData.length === 0) {
        ignrTbs.push("teams");
      }
      if (isEmpty(allPoolsData?.data) || allPoolsData?.data.length === 0) {
        ignrTbs.push("pools");
      }
      if (allPrograms.length === 0) {
        ignrTbs.push("program");
      }
      if (allPerformers.length === 0) {
        ignrTbs.push("performers");
      }
      if (allEventProjects.length === 0) {
        ignrTbs.push("projects");
      }
      if (allEventJudges.length === 0) {
        ignrTbs.push("judges");
      }
      // if (allTopPerformers.length === 0) {
      //   ignrTbs.push("top_performers");
      // }
      if (!currentEventData?.description && isEmpty(currentEventData?.extras)) {
        ignrTbs.push("welcome");
      }
      if (allStreams.length === 0) {
        ignrTbs.push("streams");
      }
      if (allDocuments.length === 0 && ePlacings.length === 0) {
        ignrTbs.push("resources");
      }
      if (ePlacings.length > 0) {
        setPlacings(ePlacings);
      }
      setIgnoreTabs(ignrTbs);
      getTeamPlayers(teamsData, eventSubType);
      setTitleSponsors(allTitleSponsors);
      setSponsors(allSponsors);
      setPrograms(allPrograms);
      setPools(allPoolsData);
      setDocuments(allDocuments);
      setStreams(allStreams);
      setPhotos(res[6].data || []);
      setEventData(currentEventData);
      setEventStats(eventStatData);
      setPerformers(allPerformers);
      setEventProjects(allEventProjects);
      setEventJudges(allEventJudges);
      // setTopPerformers(allTopPerformers);
      setResult(allResults);
    } catch (error) {
    } finally {
      setFetching(false);
      setRefreshing(false);
    }
  };

  const getTeamPlayers = async (tms = [], eventSubType = "") => {
    if (
      tms &&
      tms.length > 0 &&
      ["Festivals", "League", "Debating", "Choir", "Competition"].some((est) =>
        eventSubType.includes(est)
      )
    ) {
      let allTeamsData = [...tms];
      const userId = await AsyncStorage.getItem("@userId");
      for (let i = 0; i < tms.length; i++) {
        const { team_id } = tms[i];
        try {
          const { data: teamData = {} } = await APIs.getEventTeamPlayers(
            {
              team_id,
              stats: false,
              event_id: event_id,
            },
            { user_id: userId }
          );
          const { players = [], staff = [] } = teamData;
          allTeamsData[i]["players"] = players;
          allTeamsData[i]["staff"] = staff;
        } catch (error) {
          allTeamsData[i]["players"] = [];
          allTeamsData[i]["staff"] = [];
        } finally {
          if (tms.length - 1 === i) {
            setTeams(allTeamsData);
            setFetchingTeamsPlayers(false);
          }
        }
      }
    } else {
      setFetchingTeamsPlayers(false);
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

  const onSponsorPress = async (sponsor) => {
    const { website = "" } = sponsor;
    try {
      if (website) {
        let url = website;
        if (!url.includes("http")) {
          url = `https://${url}`;
        }
        await Linking.openURL(url);
      }
    } catch (error) {}
  };

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

  const getScrollAmount = (index, key) => {
    const centerDistance = Array.from({ length: index + 1 }).reduce(
      (total, _, i) => {
        const tabWidth = tabWidths[key];
        return total + (index === i ? tabWidth / 2 : tabWidth);
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

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "welcome":
        return (
          <EventWelcome
            extraInfo={extras}
            infoText={description}
            eventSubType={event_sub_type}
          />
        );
      case "photos":
        return <EventPhotos eventId={event_id} eventPhotos={photos} />;
      case "pools":
        return <EventPools pools={pools} />;
      case "teams":
        return (
          <EventTeams
            data={teams}
            stats={eventStats}
            fetchingTeamsPlayers={fetchingTeamsPlayers}
            eventSubType={event_sub_type}
          />
        );
      case "streams":
        return <EventStreams streams={streams} />;
      case "program":
        return (
          <EventProgram
            programs={programs}
            eventSubType={event_sub_type}
            showFilter={!isEmpty(extras) && !!extras?.sport}
            eventData={{
              event_id,
              name,
              background_image: background_image || image,
            }}
          />
        );
      case "resources":
        return (
          <EventResources
            documents={documents}
            eventId={event_id}
            placings={placings}
          />
        );
      case "performers":
        return <EventPerformers userId={userID} performers={performers} />;
      case "projects":
        return (
          <EventProjectsComponent
            userId={userID}
            eventProjectData={eventProjects}
          />
        );
      case "judges":
        return <EventJudges userId={userID} judges={eventJudges} />;
      // case 'top_performers':
      //   return <EventTopPerformers userId={userID} topPerformers={topPerformers} />;
      default:
        return null;
    }
  };

  const renderSponsors = (item, ind) => {
    const { logo = "", name = "" } = item;
    if (logo) {
      return (
        <Pressable key={`${ind}-${name}`} onPress={() => onSponsorPress(item)}>
          <FastImage
            source={{ uri: logo }}
            resizeMode={FastImage.resizeMode.contain}
            style={[styles.sponsorLogo, { height: TITLE_SPONSOR_HEIGHT || 70 }]}
          />
        </Pressable>
      );
    } else {
      return null;
    }
  };

  const renderTitleSponsors = (item, ind) => {
    const { logo = "", name = "" } = item;
    if (logo) {
      return (
        <Pressable key={`${ind}-${name}`} onPress={() => onSponsorPress(item)}>
          <FastImage
            source={{ uri: logo }}
            resizeMode={FastImage.resizeMode.contain}
            style={[styles.titleSponsorLogo, { height: TITLE_SPONSOR_HEIGHT }]}
          />
        </Pressable>
      );
    } else {
      return null;
    }
  };

  const renderLabel = ({ route, focused, color }) => (
    <Fragment>
      {route?.imgUrl ? (
        // <FastImage
        //   style={styles.tabIconStyle}
        //   source={{ uri: route.imgUrl }}
        //   resizeMode={FastImage.resizeMode.cover}
        //   tintColor={focused ? primary2 : (color || primary1)}
        // />
        <Image
          source={{ uri: route.imgUrl }}
          style={[
            styles.tabIconStyle,
            { tintColor: focused ? primary2 : color || primary1 },
          ]}
          resizeMode="cover"
        />
      ) : null}
      <Text
        style={[
          styles.tabText(color || primary1),
          focused ? styles.activeTabText(primary2) : undefined,
        ]}
      >
        {route.title}
      </Text>
    </Fragment>
  );

  const renderView = () => {
    if (fetching) {
      return <LoadingView style={styles.loadingContainer} />;
    } else {
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
        <>
          <View style={{ flex: 1, zIndex: 10 }}>
            <Animated.ScrollView
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  tintColor={primary1}
                  refreshing={refreshing}
                  colors={[primary1, primary2]}
                  progressViewOffset={HEADER_MAX_HEIGHT}
                  onRefresh={() => {
                    setRefreshing(true);
                    getEventsData();
                  }}
                />
              }
            >
              <View style={{ flex: 1, marginTop: HEADER_MAX_HEIGHT }}>
                <Animated.View
                  style={{ transform: [{ translateY: headerTranslate }] }}
                >
                  {sponsors.length > 0 ? (
                    <ViewMarquee
                      loop
                      duration={20000}
                      marqueeDelay={200}
                      style={styles.headlineContainer}
                    >
                      {sponsors.map(renderSponsors)}
                    </ViewMarquee>
                  ) : null}
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
                          tabScrollView2.current.scrollTo({
                            x,
                            animated: true,
                          });
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
                                const { width } = nativeEvent.layout;
                                if (r.key !== width) {
                                  setTabWidths({
                                    ...tabWidths,
                                    [`${r.key}`]: width,
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
                  height: HEADER_MAX_HEIGHT,
                  zIndex: refreshing ? 10 : 0,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.imageContainer,
                  {
                    height: HEADER_MAX_HEIGHT,
                    opacity: imageOpacity,
                    transform: [{ translateY: imageTranslate }],
                  },
                ]}
              >
                {titleSponsors.length > 0 ? (
                  <View
                    style={[
                      styles.titleSponsorsContainer,
                      titleSponsors.length < 3
                        ? { alignItems: "center" }
                        : undefined,
                    ]}
                  >
                    <ViewMarquee
                      loop
                      duration={20000}
                      marqueeDelay={200}
                      style={[styles.headlineContainer, { paddingTop: 0 }]}
                    >
                      {titleSponsors.map(renderTitleSponsors)}
                    </ViewMarquee>
                  </View>
                ) : null}
                <FastImage
                  resizeMode={FastImage.resizeMode.stretch}
                  source={{ uri: background_image || image }}
                  style={[
                    styles.eventImage,
                    { height: HEADER_MAX_HEIGHT - TITLE_SPONSOR_HEIGHT },
                  ]}
                >
                  <View style={styles.eventImageContainer}>
                    <View style={styles.eventNameContainer}>
                      <View style={{ flex: 1 }}>
                        {name ? (
                          <Text style={styles.eventName}>{name}</Text>
                        ) : null}
                        {date ? (
                          <Text style={styles.eventDate}>{`${moment(
                            date
                          ).format("DD MMM YYYY")} - ${moment(end_date).format(
                            "DD MMM YYYY"
                          )}`}</Text>
                        ) : null}
                      </View>
                      {icon_png_light ? (
                        <FastImage
                          style={styles.eventType}
                          source={{ uri: icon_png_light }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      ) : null}
                    </View>
                  </View>
                </FastImage>
              </Animated.View>
            </Animated.View>

            <Animated.View
              style={[
                styles.bar,
                { transform: [{ translateY: titleTranslate }] },
              ]}
            >
              <Animated.Text
                numberOfLines={1}
                style={[styles.barTitle, { opacity: titleOpacity }]}
              >
                {name}
              </Animated.Text>
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
                        tabScrollView1.current.scrollTo({
                          x,
                          y,
                          animated: true,
                        });
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
                              focused
                                ? styles.tabIndicator(primary2)
                                : undefined,
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
            </Animated.View>
          </View>
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponent title="Event Details" isAdBanner />
      {renderView()}
    </View>
  );
};

export default EventDetails;
