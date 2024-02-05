import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderComponent from "../../components/HeaderComponent";
import LoadingView from "../../components/LoadingView";
import NewsCard from "../../components/Cards/NewsCard";
import EmptyView from "../../components/EmptyView";

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import APIs from '../../services/api';
import styles from "./NewsStyles";

const NewsScreen = ({ navigation }) => {
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  const [news, setNews] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getNews();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getNews();
    }, [])
  );

  const getNews = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      const { data = [] } = await APIs.getNews({ user_id: userId });

      setNews(data);
    } catch (error) {
      const { status } = error?.response || {};
      if (status !== 422) {
        const errorMessage = hFunctions.getErrorMessage(error);
        hFunctions.showNotificationMessage("News Data Error", errorMessage.trim(), {
          type: "danger",
        });
      }
    } finally {
      setFetching(false);
      setRefreshing(false);
    }
  };

  const navigateTo = async (NEWS = {}) => {
    const { type = "", event_id, read = false, news_id } = NEWS;
    if (type === "Post") {
      navigation.navigate("NewsDetails", { newsData: NEWS });
    } else if (type === "Pre" && event_id) {
      if (!read) {
        try {
          const userId = await AsyncStorage.getItem("@userId");
          await APIs.getNewsDetails({ news_id }, { user_id: userId });
        } catch (error) { }
      }
      navigation.navigate('EventDetails', { eventId: event_id });
    }
  };

  const renderNewsCard = ({ item }) => {
    return (
      <NewsCard
        item={item}
        onReadMorePress={() => navigateTo(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponent title="News" showLeft={false} />
      <FlatList
        data={news}
        renderItem={renderNewsCard}
        keyExtractor={({ name }, i) => `${name}${i}`}
        contentContainerStyle={styles.scrollContainer}
        ListEmptyComponent={() => {
          if (fetching) {
            return <LoadingView />;
          } else {
            return <EmptyView message="News not found" />;
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={primary1 || "#062D5B"}
            colors={[primary1 || "#062D5B", primary2 || "#7E7E7E"]}
            onRefresh={() => {
              setRefreshing(true);
              getNews();
            }}
          />
        }
      />
    </View>
  );
};

export default NewsScreen;
