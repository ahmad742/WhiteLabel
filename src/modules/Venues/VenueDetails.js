import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DescriptionComponent from "../../components/DescriptionComponent";
import HeaderComponent from '../../components/HeaderComponent';
import LoadingView from '../../components/LoadingView';

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import APIs from '../../services/api';
import styles from "./VenuesStyle";

const VenueDetails = ({ route }) => {
  const [fetching, setFetching] = useState(true);
  const [venueData, setVenueData] = useState({});
  const [downloading, setDownloading] = useState(false);

  const { title = "", venueData: vData = {} } = route?.params ?? {};
  const { venue_id } = vData;
  const { currentCustomer = {}, icons = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;
  const {
    image = "",
    venue = "",
    contact = "",
    latitude = "",
    longitude = "",
    contact_no = "",
    description = "",
    instructions = "",
  } = venueData;

  useEffect(() => {
    getVenueDetails();
  }, []);

  const getVenueDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      const { data = {} } = await APIs.getVenueDetails({ venue_id }, { user_id: userId });
      setVenueData(data);
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Venue Data Error", errorMessage.trim(), {
        type: "danger",
      });
    } finally {
      setFetching(false);
    }
  };

  const onMapPress = () => {
    const label = venue;
    const latLng = `${latitude},${longitude}`;
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };

  const onDownloadPress = () => {
    setDownloading(true);
    hFunctions.fileDownload(
      instructions,
      null,
      async ({ fileContentUrl }) => {
        setDownloading(false);
        hFunctions.openFile({ fileUrl: fileContentUrl, link: instructions });
      },
      (error) => {
        setDownloading(false);
        const errorMessage = hFunctions.getErrorMessage(error);
        hFunctions.showNotificationMessage("File Download Error", errorMessage.trim(), {
          type: "danger",
        });
      }
    );
  };

  const onNumberPress = () => {
    Linking.openURL(`tel:${contact_no}`);
  };

  const renderView = () => {
    if (fetching) {
      return <LoadingView />;
    } else {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.venueDetailScrollContainer}
        >
          <FastImage
            source={{ uri: image }}
            style={styles.venueDetailImage}
            resizeMode={FastImage.resizeMode.stretch}
          >
            <View style={styles.venueDetailImageContainer}>
              {venue ? <Text style={styles.venueDetailName}>{venue}</Text> : null}
            </View>
          </FastImage>
          <View style={{ paddingHorizontal: 15 }}>
            <DescriptionComponent
              description={description}
              baseStyle={styles.venueDetailDescription}
            />
          </View>
          <View style={styles.seprator} />
          <View style={styles.contactContainer}>
            {
              contact && contact_no ? (
                <View style={{ marginBottom: 18 }}>
                  <Text style={styles.lblStyle(primary1)}>Contact Person</Text>
                  <Text style={styles.contactPerson}>{contact}</Text>
                  <Text onPress={onNumberPress} style={styles.contactPersonNo}>
                    <Text style={styles.contactPersonNo2(primary2)}>Phone: </Text>{contact_no}
                  </Text>
                </View>
              ) : null
            }
            {
              latitude && longitude ? (
                <View style={{ marginBottom: 18 }}>
                  <Text style={styles.lblStyle(primary1)}>Location</Text>
                  <Pressable onPress={onMapPress} style={styles.openMapBtn(primary1)}>
                    <Text style={styles.openMapBtnTxt}>Directions</Text>
                  </Pressable>
                </View>
              ) : null
            }
            {
              instructions ? (
                <View>
                  <Text style={styles.lblStyle(primary1)}>Venue Instructions</Text>
                  <Pressable style={styles.downloadBtn(primary1)} onPress={onDownloadPress}>
                    <Text style={[styles.openMapBtnTxt, { marginRight: 8 }]}>Download</Text>
                    {
                      downloading ? (
                        <ActivityIndicator size="small" color={"#fff"} />
                      ) : (
                        <FastImage
                          tintColor={"#fff"}
                          style={styles.iconStyle("#fff")}
                          resizeMode={FastImage.resizeMode.contain}
                          source={{ uri: icons?.download?.icon_png_light || icons?.download?.icon_png_dark || icons?.download?.icon || "" }}
                        />
                      )
                    }
                  </Pressable>
                </View>
              ) : null
            }
          </View>
        </ScrollView>
      );
    }
  };


  return (
    <View style={styles.container}>
      <HeaderComponent title={title} />
      {renderView()}
    </View>
  );
};

export default VenueDetails;
