import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderComponent from "../../components/HeaderComponent";
import LoadingView from "../../components/LoadingView";
import EmptyView from "../../components/EmptyView";

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import APIs from "../../services/api";
import styles from "./VenuesStyle";

const VenuesScreen = ({ navigation }) => {
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  const [fetching, setFetching] = useState(true);
  const [venues, setVenues] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getAllVenues();
  }, []);

  const getAllVenues = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      const { data = [] } = await APIs.getVenuesTypes({ user_id: userId });
      setVenues(data);
    } catch (error) {
      const { status } = error?.response || {};
      if (status !== 422) {
        const errorMessage = hFunctions.getErrorMessage(error);
        hFunctions.showNotificationMessage("Venues Data Error", errorMessage.trim(), {
          type: "danger",
        });
      }
    } finally {
      setFetching(false);
      setRefreshing(false);
    }
  };

  const navigateToVenues = (venueType) => {
    navigation.navigate("VenueList", { venueType });
  };

  const renderVenueType = ({ item }) => {
    const { type = "", icon_png_light = "", icon_png_dark = "" } = item;
    return (
      <Pressable
        onPress={navigateToVenues.bind(this, item)}
        style={styles.venueTypeCardStyle(primary1)}
      >
        <Text style={styles.venueTypeText}>{type}</Text>
        <FastImage
          style={styles.venueTypeIcon}
          resizeMode={FastImage.resizeMode.contain}
          source={{ uri: icon_png_light || icon_png_dark }}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponent title="Venues" showLeft={false} />
      <FlatList
        data={venues}
        renderItem={renderVenueType}
        keyExtractor={({ name }, i) => `${name}${i}`}
        contentContainerStyle={styles.scrollContainer}
        ListEmptyComponent={() => {
          if (fetching) {
            return <LoadingView />;
          } else {
            return <EmptyView message="Venues not found" />;
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={primary1 || "#062D5B"}
            colors={[primary1 || "#062D5B", primary2 || "#7E7E7E"]}
            onRefresh={() => {
              setRefreshing(true);
              getAllVenues();
            }}
          />
        }
      />
    </View>
  );
};

export default VenuesScreen;
