import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderComponent from '../../components/HeaderComponent';
import VenueCard from '../../components/Cards/VenueCard';
import LoadingView from "../../components/LoadingView";
import EmptyView from "../../components/EmptyView";

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import APIs from "../../services/api";
import styles from "./VenuesStyle";

const VenueList = ({ navigation, route }) => {
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;
  const { venueType = {} } = route?.params ?? {};
  const { type_id, type = "" } = venueType;

  const [venues, setVenues] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getVenues();
  }, []);

  const getVenues = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      const { data = [] } = await APIs.getVenues({ type_id }, { user_id: userId });
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

  const navigateToDetails = (venue) => {
    navigation.navigate("VenueDetails", { venueData: venue, title: type });
  };

  const renderVenueCard = ({ item }) => (
    <VenueCard
      item={item}
      onPress={navigateToDetails.bind(this, item)}
    />
  );

  return (
    <View style={styles.container}>
      <HeaderComponent title={type} />
      <FlatList
        data={venues}
        renderItem={renderVenueCard}
        keyExtractor={({ name }, i) => `${name}${i}`}
        contentContainerStyle={styles.scrollContainer}
        ListEmptyComponent={() => {
          if (fetching) {
            return <LoadingView />;
          } else {
            return <EmptyView message={`${type} not found`} />;
          }
        }}
        ItemSeparatorComponent={() => <View style={styles.seprator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={primary1 || "#062D5B"}
            colors={[primary1 || "#062D5B", primary2 || "#7E7E7E"]}
            onRefresh={() => {
              setRefreshing(true);
              getVenues();
            }}
          />
        }
      />
    </View>
  );
};

export default VenueList;
