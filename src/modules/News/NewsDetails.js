import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import isEmpty from "lodash/isEmpty";
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DescriptionComponent from "../../components/DescriptionComponent";
import HeaderComponent from '../../components/HeaderComponent';
import LoadingView from '../../components/LoadingView';
import EmptyView from '../../components/EmptyView';

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import APIs from '../../services/api';
import styles from "./NewsStyles";

const NewsDetails = ({ navigation, route }) => {
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  const [fetching, setFetching] = useState(true);
  const [newsData, setNewsData] = useState({});

  const { newsData: newsParams = {} } = route?.params ?? {};
  const { news_id } = newsParams;
  const {
    event_id,
    name = "",
    media = "",
    published = "",
    description = "",
    media_caption = "",
    full_description = "",
  } = newsData;

  useEffect(() => {
    getNewsDetails();
  }, []);

  const getNewsDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      const { data = {} } = await APIs.getNewsDetails({ news_id }, { user_id: userId });
      setNewsData(data);
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("News Data Error", errorMessage.trim(), {
        type: "danger",
      });
    } finally {
      setFetching(false);
    }
  };

  const onReadMorePress = () => {
    if (event_id) {
      navigation.navigate('EventDetails', { eventId: event_id });
    }
  };

  const renderView = () => {
    if (fetching) {
      return <LoadingView />;
    } else if (isEmpty(newsData)) {
      return <EmptyView message="No news data found!" />;
    } else {
      return (

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.newsDetailScrollContainer}
        >
          <FastImage
            source={{ uri: media }}
            style={styles.newsDetailImage}
            resizeMode={FastImage.resizeMode.stretch}
          >
            <View style={styles.newsDetailImageContainer}>
              <View style={{ flex: 1 }}>
                {name ? <Text style={styles.newsDetailName}>{name}</Text> : null}
                {published ? (
                  <Text style={styles.newsDetailsPublishedDate}>{published}</Text>
                ) : null}
              </View>
              {event_id ? (
                <Pressable onPress={onReadMorePress} style={styles.readMoreBtn(primary1)}>
                  <Text style={styles.readMoreBtnTxt}>Read More</Text>
                </Pressable>
              ) : null}
            </View>
          </FastImage>
          <View style={{ paddingHorizontal: 15 }}>
            {media_caption ? <Text style={styles.mediaCaption(primary2)}>{media_caption}</Text> : null}
            {
              description ? (
                <DescriptionComponent
                  description={description}
                  baseStyle={styles.newsDetailDescription}
                />
              ) : null
            }
            {
              full_description ? (
                <DescriptionComponent
                  description={full_description}
                  baseStyle={styles.newsDetailDescription}
                />
              ) : null
            }
          </View>
        </ScrollView>
      );
    }
  };


  return (
    <View style={styles.container}>
      <HeaderComponent title="News" />
      {renderView()}
    </View>
  );
};

export default NewsDetails;
