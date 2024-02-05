import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  RefreshControl,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProgramComponent from '../../components/ProgramComponent/ProgramComponent';
import HeaderComponent from '../../components/HeaderComponent';
import VenueCard from '../../components/Cards/VenueCard';
import LoadingView from "../../components/LoadingView";
import NewsCard from '../../components/Cards/NewsCard';
import SearchBar from '../../components/SearchBar';
import EmptyView from "../../components/EmptyView";

import * as hFunctions from "../../services/helperFunctions";
import { programNavIgnoreTypes } from '../../services/data';
import { useCustomer } from "../../context/CustomerContext";
import styles from "./EventDetailsStyle";
import API from "../../services/api";

const EventList = ({ navigation, route }) => {
  let searchTimeout = useRef(0);
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7", hosts = false } = currentCustomer;

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [allEvents, setAllEvents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [news, setNews] = useState([]);
  const [venues, setVenues] = useState([]);
  const [userId, setUserId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { eventData = {} } = route?.params ?? {};
  const {
    name: host_name = "",
    event_type = "",
    id: event_type_id = "",
    host_id = "",
  } = eventData;

  useEffect(() => {
    getAllEvents();
  }, []);

  // const getAllEvents = async () => {
  //   try {
  //     const uid = await AsyncStorage.getItem("@userId");
  //     if (!userId) { setUserId(uid); }
  //     const res = await API.getAllEvents({ event_type_id }, { user_id: uid });
  //     const { data = {} } = res;
  //     const { events = [] } = data;
  //     setAllEvents(events);
  //   } catch (error) {
  //     const errorMessage = hFunctions.getErrorMessage(error);
  //     hFunctions.showNotificationMessage("Data Error", errorMessage.trim(), {
  //       type: "danger",
  //     });
  //   } finally {
  //     setFetching(false);
  //     setRefreshing(false);
  //     setSearching(false);
  //   }
  // };

  const getAllEvents = async () => {
    try {
      const uid = await AsyncStorage.getItem("@userId");
      if (!userId) setUserId(uid);
      const cData = {};
      if (hosts && host_id) {
        cData['host_id'] = host_id;
      } else {
        cData['event_type_id'] = event_type_id;
      }
      const res = await API.getAllEvents(cData, { user_id: uid });
      const { data = {} } = res;
      const { events = [] } = data;
      setAllEvents(events);
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Data Error", errorMessage.trim(), {
        type: "danger",
      });
    } finally {
      setFetching(false);
      setRefreshing(false);
      setSearching(false);
    }
  };

  const onSearch = (text = "") => {
    setSearch(text);
    if (searchTimeout.current) { clearTimeout(searchTimeout); }
    searchTimeout.current = setTimeout(async () => {
      try {
        if (!refreshing) { setSearching(true); }
        const res = await API.search({ keywords: text }, { user_id: userId });
        const {
          events = [],
          news: eNews = [],
          venues: eVenues = [],
          programs: ePrograms = [],
        } = res?.data;
        setAllEvents(events);
        setPrograms(ePrograms);
        setVenues(eVenues);
        setNews(eNews);
      } catch (error) {
        const { status } = error.response;
        setAllEvents([]);
        if (status !== 422) {
          const errorMessage = hFunctions.getErrorMessage(error);
          hFunctions.showNotificationMessage("Data Error", errorMessage.trim(), {
            type: "danger",
          });
        } else if (status === 422 && text.length === 0) {
          getAllEvents();
          setNews([]);
          setPrograms([]);
          setVenues([]);
        }
      } finally {
        if (text.length !== 0) { setSearching(false); }
        setRefreshing(false);
      }
    }, 400);
  };

  const onFavouritePress = async (eData, eIndex) => {
    const { id, my_favourite } = eData;
    const uId = await AsyncStorage.getItem("@userId");
    if (!uId || uId == -1) {
      hFunctions.showNotificationMessage("Favourite Warning", "You need to register/login if you want to favourite this event", {
        type: "warning",
      });
      return null;
    }
    try {
      const eventUpdateData = {
        event_id: id,
        favourite: !my_favourite,
      };
      const res = await API.setEventFavourite(eventUpdateData, { user_id: uId });
      const { message, status } = res.data;
      hFunctions.showNotificationMessage("Event Update", message, {
        type: "success",
      });
      if (status.toLowerCase() === "success") {
        let events = [...allEvents];
        events[eIndex].my_favourite = !my_favourite;
        events[eIndex].favourites = !my_favourite === true ? 1 : 0;
        setAllEvents(events);
      }
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Event Update Error", errorMessage.trim(), {
        type: "danger",
      });
    }
  };

  const navigateToNews = (n = {}) => {
    const { type = "", event_id } = n;
    if (type === "Post") {
      navigation.navigate("NewsDetails", { newsData: n });
    } else if (type === "Pre" && event_id) {
      navigation.navigate('EventDetails', { eventId: event_id });
    }
  };

  const goToGameDetails = async (program) => {
    const { id, event = {} } = program;
    const {
      event_id: pEventId,
      event_sub_type: eventSubType = "",
      background_image: pBackgroundImage = "",
    } = event;
    if (programNavIgnoreTypes.some(et => eventSubType.includes(et))) {
      return null;
    }
    const programParams = {
      program_id: id,
      event_id: pEventId,
      background_image: pBackgroundImage,
    };
    navigation.navigate("GameDetails", { programParams });
  };

  const navigateToVenue = (venue) => {
    const { type = "" } = venue;
    navigation.navigate("VenueDetails", { venueData: venue, title: type });
  };

  const renderSeprator = () => (
    <View style={styles.listSeprator} />
  );

  const renderEvent = (item, index) => {
    const { id, image = "", name = "", extras = {}, my_favourite = false } = item;
    const { sport = "" } = extras;
    return (
      <View key={`${id}-${name}`}>
        <Pressable
          style={styles.buttons}
          onPress={() => navigation.navigate('EventDetails', { eventId: id })}
        >
          <View style={styles.listEventImageContainer}>
            <View style={styles.listEventImageSubContainer}>
              <FastImage
                source={{ uri: image }}
                style={styles.listEventImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
          </View>
          <View style={styles.eventDetailsContainer}>
            <Text numberOfLines={1} style={styles.buttonText(primary1)}>{name}</Text>
            {
              sport ? (
                <View style={styles.sportBadge(primary2)}>
                  <Text style={styles.sportName}>{sport}</Text>
                </View>
              ) : null
            }
          </View>
          <Pressable onPress={() => onFavouritePress(item, index)} style={styles.bookmarkBtn}>
            <AntDesign name={my_favourite ? "heart" : "hearto"} size={25} color={primary1 || "#2E3A59"} />
          </Pressable>
        </Pressable>
        {index !== allEvents.length - 1 ? renderSeprator() : null}
      </View>
    );
  };

  const renderNews = (item) => {
    const { news_id } = item;
    return (
      <NewsCard
        item={item}
        key={`${news_id}`}
        onReadMorePress={() => navigateToNews(item)}
      />
    );
  };

  const renderPrograms = (item, index) => {
    const isLastItem = index === programs.length - 1;
    return (
      <ProgramComponent
        data={item}
        index={index}
        key={index.toString()}
        isLastProgram={isLastItem}
        onPress={() => goToGameDetails(item)}
      />
    );
  };

  const renderVenues = (item) => (
    <VenueCard
      key={`${item.venue_id}`}
      item={item}
      onPress={navigateToVenue.bind(this, item)}
    />
  );

  return (
    <View style={styles.container}>
      <HeaderComponent title={event_type || host_name} />
      <View style={styles.searchContainer}>
        <SearchBar onChangeText={onSearch} />
      </View>
      <ScrollView
        contentContainerStyle={styles.eventListScrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={primary1 || "#062D5B"}
            colors={[primary1 || "#062D5B", primary2 || "#7E7E7E"]}
            onRefresh={() => {
              setRefreshing(true);
              if (search.length > 0) {
                onSearch(search);
              } else {
                getAllEvents();
              }
            }}
          />
        }
      >
        {
          !(fetching || searching) && allEvents.length > 0 ? (
            <>
              <Text style={styles.titleStyle(primary1)}>
                Upcoming Events
              </Text>
              {allEvents.map(renderEvent)}
            </>
          ) : null
        }
        {
          !(fetching || searching) && programs.length > 0 ? (
            <>
              <Text style={styles.titleStyle(primary1)}>
                Programs
              </Text>
              {programs.map(renderPrograms)}
            </>
          ) : null
        }
        {
          !(fetching || searching) && venues.length > 0 ? (
            <>
              <Text style={styles.titleStyle(primary1)}>
                Venues
              </Text>
              {venues.map(renderVenues)}
            </>
          ) : null
        }
        {
          !(fetching || searching) && news.length > 0 ? (
            <>
              <Text style={styles.titleStyle(primary1)}>
                News
              </Text>
              {news.map(renderNews)}
            </>
          ) : null
        }
        {
          fetching || searching ? <LoadingView /> : null
        }
        {
          !(fetching || searching) && allEvents.length === 0 && news.length === 0 && programs.length === 0 && venues.length === 0 ? (
            <EmptyView message={"No Data Found!"} />
          ) : null
        }
      </ScrollView>
    </View>
  );
};

export default EventList;
