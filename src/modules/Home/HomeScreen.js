import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Fragment,
} from "react";
import {
  Text,
  View,
  Platform,
  Pressable,
  StatusBar,
  ScrollView,
  RefreshControl,
  DeviceEventEmitter,
  useWindowDimensions,
  Alert,
} from "react-native";
import moment from "moment";
import FastImage from "react-native-fast-image";
import Carousel from "react-native-snap-carousel";
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

import HeaderComponent from "../../components/HeaderComponent";
import LoadingView from "../../components/LoadingView";
import EmptyView from "../../components/EmptyView";

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import API from "../../services/api";
import styles from "./HomeStyle";
import { useFocusEffect } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import { images } from "../../assets";

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();

  const channelId = useRef(null);
  const { currentCustomer = {} } = useCustomer();
  const {
    primary1 = "#20366B",
    primary2 = "#196391",
    hosts = false,
  } = currentCustomer;

  const [search, setSearch] = useState("");
  const [eventIndex, setEventIndex] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hostsSearchList, setHostsSearchList] = useState([]);
  const [allEventsHosts, setAllEventsHosts] = useState([]);
  const [allEventsTypes, setAllEventsTypes] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  useEffect(() => {
    if (Platform.OS === "android" && primary1) {
      StatusBar.setBackgroundColor(primary1);
      StatusBar.setBarStyle("light-content");
    }
    setFetching(true);
    getHomePageData();
    requestUserPermission();
    callInitialNotification();
    updateUserPushToken();
    const subscribeForToken = messaging().onTokenRefresh(async (token) => {
      updateUserPushToken();
    });
    const subscribeForForgroundEvent = notifee.onForegroundEvent(
      ({ type, detail }) => {
        if (type == EventType.PRESS) {
          handleNotification(detail?.notification?.data ?? {});
        }
      }
    );
    messaging().onNotificationOpenedApp((remoteMessage) => {
      handleNotification(remoteMessage?.data ?? {});
    });
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const notifData = {
        data: remoteMessage?.data ?? {},
        body: remoteMessage?.notification?.body ?? "",
        title: remoteMessage?.notification?.title ?? "",
        android: {
          color: "#1F376A",
          smallIcon: "ic_stat_notification_icon",
          channelId: channelId?.current ?? "default",
          pressAction: { id: remoteMessage.messageId },
        },
      };
      await notifee.displayNotification(notifData);
    });
    DeviceEventEmitter.addListener("showNotificationBadge", (flag) => {
      setShowBadge(flag);
    });
    return () => {
      unsubscribe();
      subscribeForToken();
      subscribeForForgroundEvent();
      DeviceEventEmitter.removeAllListeners("showNotificationBadge");
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      getAllNotification();
    }, [])
  );

  const getAllNotification = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      let notifsData = [];
      if (userId || userId != -1) {
        const res = await API.getAllNotification({ user_id: userId });
        notifsData = res?.data || [];
      }
      if (notifsData.length) {
        const sBadge = notifsData.some((d) => !d.read);
        DeviceEventEmitter.emit("showNotificationBadge", sBadge);
      }
    } catch (error) {}
  };

  const callInitialNotification = async () => {
    try {
      const remoteMessage = await messaging().getInitialNotification();
      handleNotification(remoteMessage?.data ?? {});
    } catch (error) {}
  };

  const handleNotification = (data) => {
    const { notification_id } = data;
    if (notification_id) {
      navigation.navigate("Notifications", { notification_id });
    }
  };

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled && Platform.OS === "android") {
        Alert.alert(
          "Notification Permission",
          "Please enable notification permission for receive all the app notifications.",
          [
            { text: "No", style: "cancel" },
            {
              text: "Yes",
              style: "default",
              onPress: () => notifee.openNotificationSettings(),
            },
          ],
          { cancelable: false }
        );
      }

      if (enabled && Platform.OS === "android") {
        channelId.current = await notifee.createChannel({
          id: "default",
          name: "All Notifications",
        });
      }
    } catch (error) {}
  };

  const getHomePageData = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      let apiName = "";
      if (hosts) {
        apiName = "getAllEventsHosts";
      } else {
        apiName = "getAllEventsTypes";
      }
      const res = await new Promise.all([
        API[apiName]({ user_id: userId }),
        API.getFeaturedEvents({}, { user_id: userId }),
      ]);
      // console.log(`featured events....`, userId, res[1]?.data.events);
      if (hosts) {
        const event_hosts = res[0]?.data || [];
        if (event_hosts.length == 0) {
          getAllEvents();
        }
        setAllEventsHosts(event_hosts);
        setHostsSearchList(event_hosts);
      } else {
        const { event_types = [] } = res[0]?.data || {};
        console.log({ event_types });
        setAllEventsTypes(event_types);
        if (event_types.length === 1) {
          getAllEvents();
        }
      }
      const { events: fEvents = [] } = res[1]?.data || {};
      setFeaturedEvents(fEvents);
    } catch (error) {
      const { status } = error?.response || {};
      if (status !== 422) {
        const errorMessage = hFunctions.getErrorMessage(error);
        hFunctions.showNotificationMessage("Data Error", errorMessage.trim(), {
          type: "danger",
        });
      }
    } finally {
      setFetching(false);
      setRefreshing(false);
    }
  };

  const getAllEvents = async () => {
    try {
      const uid = await AsyncStorage.getItem("@userId");
      const res = await API.getAllEvents({}, { user_id: uid });
      const { data = {} } = res;
      const { events = [] } = data;
      console.log({ getAllEvents: events });
      setAllEvents(events);
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Data Error", errorMessage.trim(), {
        type: "danger",
      });
    } finally {
      setFetching(false);
      setRefreshing(false);
    }
  };

  const updateUserPushToken = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      const pushToken = await messaging().getToken();
      const uData = {
        user_id: userId,
        device_id: pushToken,
      };

      await API.updateUser([uData]);
    } catch (error) {}
  };

  const navigateToEventList = (eventData = {}) => {
    navigation.navigate("EventList", { eventData });
  };

  const onFavouriteHostPress = async (eData, eIndex) => {
    const { host_id, my_favourite } = eData;
    const userId = await AsyncStorage.getItem("@userId");
    if (!userId || userId == -1) {
      hFunctions.showNotificationMessage(
        "Favourite Warning",
        "You need to register/login if you want to favourite this event",
        {
          type: "warning",
        }
      );
      return null;
    }

    try {
      const eventUpdateData = {
        host_id: host_id,
        favourite: !my_favourite,
      };
      const res = await API.setHostFavourite(eventUpdateData, {
        user_id: userId,
      });
      const { message, status } = res.data;
      hFunctions.showNotificationMessage("Host Update", message, {
        type: "success",
      });
      if (status.toLowerCase() === "success") {
        let events = [...allEventsHosts];
        events[eIndex]["my_favourite"] = !my_favourite;
        setAllEventsHosts(events);
      }
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Host Error", errorMessage.trim(), {
        type: "danger",
      });
    }
  };

  const onFavouritePress = async (eData, eIndex) => {
    const { id, my_favourite } = eData;
    const userId = await AsyncStorage.getItem("@userId");
    if (!userId || userId == -1) {
      hFunctions.showNotificationMessage(
        "Favourite Warning",
        "You need to register/login if you want to favourite this event",
        {
          type: "warning",
        }
      );
      return null;
    }
    try {
      const eventUpdateData = {
        event_id: id,
        favourite: !my_favourite,
      };
      const res = await API.setEventFavourite(eventUpdateData, {
        user_id: userId,
      });
      const { message, status } = res.data;
      hFunctions.showNotificationMessage("Event Update", message, {
        type: "success",
      });
      if (status.toLowerCase() === "success") {
        let events = [...allEvents];
        events[eIndex]["my_favourite"] = !my_favourite;
        events[eIndex]["favourites"] = !my_favourite === true ? 1 : 0;
        setAllEvents(events);
      }
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage(
        "Event Update Error",
        errorMessage.trim(),
        {
          type: "danger",
        }
      );
    }
  };

  const navigateToEventDetails = (eventData = {}) => {
    navigation.navigate("EventList", { eventData });
  };

  const onSearch = (val = "") => {
    setSearch(val);
    let newList = hostsSearchList.filter((c) =>
      `${c?.name ?? ""}`.toLowerCase().includes(val.toLowerCase())
    );
    setAllEventsHosts(newList);
  };

  const renderFeaturedEvents = ({ item }) => {
    const {
      id,
      name = "",
      date = "",
      image = "",
      extras = {},
      end_date = "",
      icon_png_dark = "",
      icon_png_light = "",
      background_image = "",
    } = item;
    const { sport = "" } = extras;
    let displayDate = "";
    if (date) {
      displayDate = moment(date).format("DD MMM");
    }
    if (end_date) {
      displayDate += ` - ${moment(end_date).format("DD MMM")}`;
    }
    return (
      <FastImage
        style={styles.featuredEventImage}
        resizeMode={FastImage.resizeMode.cover}
        source={{ uri: image || background_image }}
      >
        <Pressable
          style={styles.featuredEventContainer}
          onPress={() => navigation.navigate("EventDetails", { eventId: id })}
        >
          <View>
            <Text style={styles.leagueName}>{name}</Text>
            {displayDate ? (
              <Text style={styles.leagueDate}>{displayDate}</Text>
            ) : null}
            {sport ? (
              <View style={styles.gameBadge}>
                <Text style={styles.gameName}>{sport}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.featuredEventBottomContainer}>
            <Pressable
              onPress={() =>
                navigation.navigate("EventDetails", { eventId: id })
              }
              style={styles.readMoreBtn(primary1)}
            >
              <Text style={styles.readMoreBtnTxt}>Read More</Text>
            </Pressable>
            {icon_png_light || icon_png_dark ? (
              <FastImage
                style={styles.sportImg}
                resizeMode={FastImage.resizeMode.contain}
                source={{ uri: icon_png_light || icon_png_dark }}
              />
            ) : null}
          </View>
        </Pressable>
      </FastImage>
    );
  };

  const renderEventHosts = () => (
    <View style={{ flex: 1, marginTop: 0 }}>
      <Text style={styles.titleStyle(primary1)}>Event Hosts</Text>
      <View style={styles.hostView}>
        {allEventsHosts.length > 0 ? (
          allEventsHosts.map(renderHosts)
        ) : (
          <EmptyView message={"No Data Found!"} />
        )}
      </View>
    </View>
  );

  const renderEventTypes = () => {
    if (allEventsTypes.length < 4) {
      return (
        <View style={{ marginTop: 10 }}>
          {allEventsTypes.map((event) => {
            const cardColor = event.background_color || primary1 || "#062D5B";
            const cardBGColor = `rgba(${hFunctions
              .hexToRgb(cardColor)
              .join(", ")}, 0.93)`;
            return (
              <View
                style={styles.eventRectangleButtonContainer}
                key={event.event_type}
              >
                <Pressable
                  style={[
                    styles.eventRectangleButton,
                    { backgroundColor: cardBGColor },
                  ]}
                  onPress={() => navigateToEventDetails(event)}
                >
                  <Text style={styles.eventRectangleButtonText}>
                    {event.event_type}
                  </Text>
                  <FastImage
                    style={styles.eventImg}
                    source={{ uri: event.icon_png_light }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </Pressable>
                <FastImage
                  source={images.eventCardBackground}
                  resizeMode={FastImage.resizeMode.stretch}
                  style={[styles.eventBGImage, styles.eventRectangleBGImage]}
                />
              </View>
            );
          })}
        </View>
      );
    } else if (allEventsTypes.length >= 4) {
      return (
        <View style={styles.eventsWrapper}>
          {allEventsTypes.map((event) => {
            const cardColor = event.background_color || primary1 || "#062D5B";
            const cardBGColor = `rgba(${hFunctions
              .hexToRgb(cardColor)
              .join(", ")}, 0.93)`;
            return (
              <View
                style={styles.eventSquareButtonContainer}
                key={event.event_type}
              >
                <Pressable
                  style={[
                    styles.eventSquareButton,
                    { backgroundColor: cardBGColor },
                  ]}
                  onPress={() => navigateToEventDetails(event)}
                >
                  <Text style={styles.eventSquareButtonText}>
                    {event.event_type}
                  </Text>
                  <FastImage
                    style={styles.eventImg}
                    source={{ uri: event.icon_png_light }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </Pressable>
                <FastImage
                  source={images.eventCardBackground}
                  style={styles.eventBGImage}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
            );
          })}
        </View>
      );
    } else {
      return null;
    }
  };

  const renderSeprator = () => <View style={styles.listSeprator} />;

  const renderHosts = (item, index) => {
    const { logo = "", name = "", colour = "", my_favourite = false } = item;
    return (
      <View key={`${index}-${name}`}>
        <Pressable
          style={styles.buttons}
          onPress={() => navigateToEventList(item)}
        >
          <View style={styles.listEventImageContainer}>
            <View style={styles.listEventImageSubContainer}>
              <FastImage
                source={{ uri: logo }}
                style={styles.listEventImage}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </View>
          <View style={styles.eventDetailsContainer}>
            <Text numberOfLines={1} style={styles.buttonText(primary1)}>
              {name}
            </Text>
          </View>
          <Pressable
            onPress={() => onFavouriteHostPress(item, index)}
            style={styles.bookmarkBtn}
          >
            <AntDesign
              name={my_favourite ? "heart" : "hearto"}
              size={25}
              color={primary1 || "#2E3A59"}
            />
          </Pressable>
        </Pressable>
        {index !== allEventsHosts.length - 1 ? renderSeprator() : null}
      </View>
    );
  };

  const renderEvent = (item, index) => {
    const {
      id,
      image = "",
      name = "",
      extras = {},
      my_favourite = false,
    } = item;
    const { sport = "" } = extras;
    return (
      <View key={`${id}-${name}`}>
        <Pressable
          style={styles.buttons}
          onPress={() => navigation.navigate("EventDetails", { eventId: id })}
        >
          <View style={styles.listEventImageContainer}>
            <View style={styles.listEventImageSubContainer}>
              <FastImage
                source={{ uri: image }}
                style={styles.listEventImage}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </View>
          <View style={styles.eventDetailsContainer}>
            <Text numberOfLines={1} style={styles.buttonText(primary1)}>
              {name}
            </Text>
            {sport ? (
              <View style={styles.sportBadge(primary2)}>
                <Text style={styles.sportName}>{sport}</Text>
              </View>
            ) : null}
          </View>
          <Pressable
            onPress={() => onFavouritePress(item, index)}
            style={styles.bookmarkBtn}
          >
            <AntDesign
              name={my_favourite ? "heart" : "hearto"}
              size={25}
              color={primary1 || "#2E3A59"}
            />
          </Pressable>
        </Pressable>
        {index !== allEvents.length - 1 ? renderSeprator() : null}
      </View>
    );
  };

  const renderView = () => {
    // console.log({ allEventsTypes: allEventsTypes.length });
    // console.log({ featuredEvents });
    // console.log({ hosts });
    if (fetching) {
      return <LoadingView />;
    } else {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={primary1 || "#062D5B"}
              colors={[primary1 || "#062D5B", primary2 || "#7E7E7E"]}
              onRefresh={() => {
                setRefreshing(true);
                getHomePageData();
              }}
            />
          }
        >
          <View style={styles.searchContainer}>
            <SearchBar onChangeText={onSearch} />
          </View>
          
          {featuredEvents.length > 0 && (
            <>
              <Text style={styles.title1(primary1)}>FEATURED EVENTS</Text>
              <View>
                <Carousel
                  sliderWidth={width}
                  data={featuredEvents}
                  activeSlideOffset={1}
                  itemWidth={
                    featuredEvents.length === 1 ? width - 30 : width - 50
                  }
                  renderItem={renderFeaturedEvents}
                  keyExtractor={(i) => `${i.id}-${i.name}`}
                  onSnapToItem={(ind) => setEventIndex(ind)}
                  activeSlideAlignment={eventIndex === 0 ? "start" : "center"}
                  containerCustomStyle={{
                    paddingLeft:
                      featuredEvents.length === 1
                        ? 15
                        : eventIndex === 0
                        ? 10
                        : 0,
                  }}
                />
              </View>
            </>
          )}
          {hosts ? (
            allEventsHosts.length > 0 ? (
              renderEventHosts()
            ) : (
              <Fragment>
                {allEvents.length > 0 ? (
                  <Text style={styles.title2(primary1)}>ALL EVENTS</Text>
                ) : null}
                {allEvents.length > 0 ? (
                  <View style={styles.eventListContainer}>
                    {allEvents.map(renderEvent)}
                  </View>
                ) : null}
              </Fragment>
            )
          ) : (
            allEventsTypes.map(renderEventTypes)
          )}
        </ScrollView>
      );
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="Events"
        showLeft={false}
        headerRight={() => (
          <Pressable
            onPress={() => navigation.navigate("Notifications")}
            style={{ marginRight: 20 }}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color={primary1 || "#062D5B"}
            />
            {showBadge ? <View style={styles.notificationBadge} /> : null}
          </Pressable>
        )}
      />
      {renderView()}
    </View>
  );
};

export default HomeScreen;
