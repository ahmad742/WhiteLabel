import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderComponent from '../../components/HeaderComponent';
import LoadingView from "../../components/LoadingView";
import EmptyView from "../../components/EmptyView";

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import APIs from "../../services/api";
import styles from "./MoreStyle";

export const DownloadButton = (props) => {
  const { item = {}, index } = props;
  const { link: downloadLink = "", icon_png_dark = "", icon_png_light = "", name = "" } = item;
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  const [downloading, setDownloading] = useState(false);

  const onDownloadPress = async (link = "") => {
    if (!link) { return null; }

    if (Platform.OS === 'android') {
      // Calling the permission function
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'SWPSA App Storage Permission',
          message: 'SWPSA App needs access to your storage',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission Granted
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
      } else {
        // Permission Denied
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
      }
    } else {
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
    }


  };

  return (
    <Pressable
      onPress={() => onDownloadPress(downloadLink)}
      style={[styles.logoutBtn, index === 0 ? { marginTop: 10 } : undefined]}
    >
      <Text style={[styles.logoutBtnTxt(primary1), { marginLeft: 0 }]}>{name}</Text>
      {
        downloading ? (
          <ActivityIndicator size="large" color={primary1 || "#062D5B"} />
        ) : (
          // <FastImage
          //   tintColor={primary1}
          //   style={styles.iconStyle(primary1)}
          //   resizeMode={FastImage.resizeMode.contain}
          //   source={{ uri: icon_png_dark || icon_png_light }}
          // />
          <Image
            style={[styles.iconStyle(primary1), { tintColor: primary1 }]}
            resizeMode={'contain'}
            source={{ uri: icon_png_dark || icon_png_light }}
          />
        )
      }
    </Pressable>
  );
};

const DownloadsScreen = () => {
  const [links, setLinks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingLinks, setFetchingLinks] = useState(true);

  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  useEffect(() => {
    getLinks();
  }, []);

  const getLinks = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      const { data = [] } = await APIs.getDownloads({ categories: false }, { user_id: userId });
      setLinks(data);
    } catch (error) {
      const { status } = error?.response || {};
      if (status !== 422) {
        const errorMessage = hFunctions.getErrorMessage(error);
        hFunctions.showNotificationMessage("Data Error", errorMessage.trim(), {
          type: "danger",
        });
      }
    } finally {
      setFetchingLinks(false);
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponent title="Downloads" />
      <FlatList
        data={links}
        contentContainerStyle={styles.scrollContainer}
        keyExtractor={({ name }, i) => `${name}${i}`}
        renderItem={({ item, index }) => (
          <DownloadButton item={item} index={index} />
        )}
        ListEmptyComponent={() => {
          if (fetchingLinks) {
            return <LoadingView />;
          } else {
            return <EmptyView message="No downloads found" />;
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={primary1 || "#062D5B"}
            colors={[primary1 || "#062D5B", primary2 || "#7E7E7E"]}
            onRefresh={() => {
              setRefreshing(true);
              getLinks();
            }}
          />
        }
      />
    </View>
  );
};

export default DownloadsScreen;
