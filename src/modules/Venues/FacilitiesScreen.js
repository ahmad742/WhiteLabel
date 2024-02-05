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

import DescriptionComponent from '../../components/DescriptionComponent';
import HeaderComponent from '../../components/HeaderComponent';
import LoadingView from "../../components/LoadingView";
import EmptyView from "../../components/EmptyView";

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import APIs from "../../services/api";
import styles from "./VenuesStyle";

const FacilitiesScreen = ({ navigation }) => {
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  const [fetching, setFetching] = useState(true);
  const [facilities, setFacilities] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    getFacilities();
  }, []);

  const getFacilities = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      const { data = [] } = await APIs.getFacilities({ user_id: userId });
      setFacilities(data.flat());
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Facilities Data Error", errorMessage.trim(), {
        type: "danger",
      });
    } finally {
      setFetching(false);
      setRefreshing(false);
    }
  };

  const navigateToDetails = (facility) => {
    const { id } = facility;
    const venueData = { id };
    navigation.navigate("VenueDetails", { venueData });
  };

  const renderFacilityCard = ({ item }) => {
    const { image = "", name = "", published = "", description = "" } = item;
    return (
      <View style={styles.cardStyle}>
        <FastImage
          source={{ uri: image }}
          style={styles.facilityImage}
          resizeMode={FastImage.resizeMode.stretch}
        >
          <View style={styles.facilityImageOverlay}>
            <View>
              <Text style={styles.facilityTitle}>{name}</Text>
              <Text style={styles.facilityPublished}>{published}</Text>
            </View>
            <Pressable
              style={styles.readMoreBtn(primary1)}
              onPress={navigateToDetails.bind(this, item)}
            >
              <Text style={styles.readMoreBtnTxt}>Read More</Text>
            </Pressable>
          </View>
        </FastImage>
        {description ? (
          <DescriptionComponent
            description={description}
            baseStyle={styles.mediaDescription}
          />
        ) : null}
      </View>
    );
  };

  if (fetching) {
    return <LoadingView />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={facilities}
        renderItem={renderFacilityCard}
        keyExtractor={({ name }, i) => `${name}${i}`}
        contentContainerStyle={styles.scrollContainer}
        ListEmptyComponent={() => <EmptyView message="Facilities not found" />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={primary1 || "#062D5B"}
            colors={[primary1 || "#062D5B", primary2 || "#7E7E7E"]}
            onRefresh={() => {
              setRefreshing(true);
              getFacilities();
            }}
          />
        }
      />
    </View>
  );
};

FacilitiesScreen.navigationOptions = () => {
  return {
    headerShown: true,
    header: () => <HeaderComponent title="Facilities" />,
  };
};

export default FacilitiesScreen;
