import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Modal,
  FlatList,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import isEmpty from "lodash/isEmpty";
import { BlurView } from "@react-native-community/blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import DescriptionComponent from "../../components/DescriptionComponent";
import HeaderComponent from "../../components/HeaderComponent";
import LoadingView from "../../components/LoadingView";
import EmptyView from "../../components/EmptyView";

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import styles from "./NotificationStyle";
import APIs from "../../services/api";
import FastImage from "react-native-fast-image";

const NotificationScreen = ({ navigation, route }) => {
  const { notification_id: paramNotifId } = route?.params || {};
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState({});

  useEffect(() => {
    getAllNotification();
  }, []);

  const getAllNotification = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      const res = await APIs.getAllNotification({ user_id: userId });
      const notifsData = res?.data || [];
      setNotifications(res?.data || []);
      if (notifsData.length > 0) {
        if (paramNotifId) {
          const ind = notifsData.findIndex(n => n.notification_id == paramNotifId);
          onNotificationSelect(notifsData[ind], ind, notifsData);
        }
      }
    } catch (error) {
      // const errorMessage = hFunctions.getErrorMessage(error);
      // hFunctions.showNotificationMessage("Notification Error", errorMessage.trim(), {
      //   type: "danger",
      // });
    } finally {
      setFetching(false);
      setRefreshing(false);
    }
  };

  const onNotificationSelect = async (notif, index, notifsData = []) => {
    try {
      setFetchingDetails(true);
      const { notification_id } = notif;
      const allNotification = notifications.length > 0 ? notifications : notifsData;
      const userId = await AsyncStorage.getItem("@userId");
      const res = await APIs.getNotificationDetails({ notification_id }, { user_id: userId });
      const notifData = res?.data || {};
      if (!isEmpty(notifData)) {
        let newNotifs = [...allNotification];
        newNotifs[index] = { ...notifData };
        setNotifications(newNotifs);
        setSelectedNotification(notifData);
      }
      if (paramNotifId) {
        navigation.setParams({ notification_id: undefined });
      }
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Notification Error", errorMessage.trim(), {
        type: "danger",
      });
    } finally {
      setFetchingDetails(false);
    }
  };

  const hideNotifiationModal = () => {
    setSelectedNotification({});
  };

  const renderNotification = ({ item, index }) => {
    const { title = "", description = "", read = false } = item;
    return (
      <Pressable
        style={[styles.notificationContainer, { opacity: read ? 0.5 : 1 }]}
        onPress={() => onNotificationSelect(item, index)}
      >
        <View style={styles.notificationIconContainer(primary1 || "#062D5B")}>
          <MaterialCommunityIcons name="bell-outline" size={30} color={"#ffffff"} />
        </View>
        <View style={styles.notificationTextContainer}>
          <Text style={styles.notificationTitle(primary1 || "#062D5B")}>{title}</Text>
          <Text style={styles.notificationDescription} numberOfLines={1}>{description}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={50} color={primary1 || "#062D5B"} />
      </Pressable>
    );
  };

  const { title = "", description = "", image = "" } = selectedNotification;
  return (
    <View style={styles.container}>
      <HeaderComponent title="Notifications" />
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(i) => `${i.notification_id}`}
        contentContainerStyle={styles.scrollContainer}
        ItemSeparatorComponent={() => <View style={styles.listSeprator} />}
        ListEmptyComponent={() => {
          if (fetching) {
            return <LoadingView />;
          } else {
            return <EmptyView message={"No Notification found"} />;
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={primary1 || "#062D5B"}
            colors={[primary1 || "#062D5B", primary2 || "#7E7E7E"]}
            onRefresh={() => {
              setRefreshing(true);
              getAllNotification();
            }}
          />
        }
      />
      {
        fetchingDetails ? (
          <LoadingView style={styles.overlayLoading} />
        ) : null
      }
      <Modal
        transparent
        animationType="fade"
        onRequestClose={hideNotifiationModal}
        visible={!isEmpty(selectedNotification)}
      >
        <View style={styles.modalContainer}>
          <BlurView
            blurAmount={1.5}
            blurType="light"
            style={styles.modalBlurContainer}
            reducedTransparencyFallbackColor="white"
          />
          <View style={styles.modalDataContainer}>
            {
              !!image &&
              <FastImage
                source={{ uri: image }}
                style={[styles.notificationModalImage, { height: 150 }]}
                resizeMode={FastImage.resizeMode.contain}
              />
            }
            <Text style={styles.notificationModalTitle(primary1 || "#062D5B")}>{title}</Text>
            <ScrollView>
              <DescriptionComponent
                description={description}
                baseStyle={styles.notificationModalDescription}
              />
            </ScrollView>
            <View style={styles.listSeprator} />
            <Pressable onPress={hideNotifiationModal} style={styles.notificationModalBtn(primary1 || "#062D5B")}>
              <Text style={styles.notificationModalBtnTxt}>Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NotificationScreen;
