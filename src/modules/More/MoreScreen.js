import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import HeaderComponent from '../../components/HeaderComponent';

import * as NavActions from "../../context/NavigationContext";
import { useCustomer } from "../../context/CustomerContext";
import styles from "./MoreStyle";

const MoreScreen = () => {
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;
  const [isGuest, setIsGuest] = useState(false);
  useEffect(() => {
    (async () => {
      const userId = await AsyncStorage.getItem("@userId");
      setIsGuest(!userId || userId == -1);
    })();
  }, []);

  const onLogoutPress = async () => {
    await AsyncStorage.removeItem("@userId");
    navigateTo("LoginFlow");
  };

  const navigateTo = (routeName = "") => {
    NavActions.navigateTo(routeName);
  };

  return (
    <View style={styles.container}>
      <HeaderComponent title="More" showLeft={false} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {
          !isGuest ? (
            <Pressable onPress={() => navigateTo("MyProfile")} style={{ ...styles.logoutBtn, marginTop: 10 }}>
              <AntDesign name="user" size={24} color={primary1 || "#062D5B"} />
              <View style={{ flex: 1 }}>
                <Text style={styles.logoutBtnTxt(primary1)}>My Profile</Text>
              </View>
            </Pressable>
          ) : null
        }
        <Pressable onPress={() => navigateTo("Downloads")} style={styles.logoutBtn}>
          <AntDesign name="download" size={24} color={primary1 || "#062D5B"} />
          <View style={{ flex: 1 }}>
            <Text style={styles.logoutBtnTxt(primary1)}>Downloads</Text>
          </View>
        </Pressable>
        {!isGuest ? <Pressable onPress={onLogoutPress} style={styles.logoutBtn}>
          <SimpleLineIcons name="logout" size={24} color={primary1 || "#062D5B"} />
          <View style={{ flex: 1 }}>
            <Text style={styles.logoutBtnTxt(primary1)}>Logout</Text>
          </View>
        </Pressable> : null}
      </ScrollView>
    </View>
  );
};

export default MoreScreen;
