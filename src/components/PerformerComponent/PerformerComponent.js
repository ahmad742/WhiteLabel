import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FastImage from "react-native-fast-image";
import { moderateScale } from "../../styles/utils/utils";
import DescriptionComponent from "../DescriptionComponent";
import styles from "./PerformerComponentStyle";
import EmptyView from "../../components/EmptyView";
import { useCustomer } from "../../context/CustomerContext";
import RBSheet from "react-native-raw-bottom-sheet";
import EventProjectDetailsSheetData from "../../modules/Events/EventProjectDetailsSheetData";


export default (props) => {
  const isCarousel = useRef(null);
  const bottomSheetRef = useRef(null);

  const { data = [], iconIndex = 0, tab = "" } = props;
  const { width, height } = useWindowDimensions();
  const [performers] = useState(data);
  const [performersIndex, setPerformersIndex] = useState(0);
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;
  const [currentItem, setCurrentItem] = useState({});

  useEffect(() => {
  }, [currentItem]);
  const renderPerformer = ({ item, index }) => {
    const {
      description = '',
      image = '',
      name = '',
      top_performer = false,
    } = item;
    return (
      tab == 'performers' ?
        <View key={name} style={styles.performersDataContainer(width)}>
          {top_performer ? <Ionicons name="ios-star-sharp" color={'#FFDE00'} size={40} style={styles.performersStar} /> : null}
          <View style={styles.performersImage(moderateScale(105), moderateScale(105), moderateScale(10))}>
            <FastImage source={{ uri: image !== '' ? image : '' }} style={{ width: moderateScale(105), height: moderateScale(105) }} resizeMode={FastImage.resizeMode.contain} />
          </View>
          <Text style={styles.performersName("#000000")} >{name}</Text>
          <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 110 }} showsVerticalScrollIndicator={false} >
            <DescriptionComponent description={description} baseStyle={styles.performersDes} />
          </ScrollView>
        </View>
        :
        <View key={name} style={styles.performersDataContainer(width)}>
          <View style={styles.performersImage(moderateScale(105), moderateScale(105), moderateScale(10))}>
            <FastImage source={{ uri: image !== '' ? image : '' }} style={{ width: moderateScale(105), height: moderateScale(105) }} resizeMode={FastImage.resizeMode.contain} />
          </View>
          <Text style={styles.performersName('#000000')} >{name}</Text>
          <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false} scrollEnabled={false} >
            <DescriptionComponent description={description} baseStyle={styles.performersDes} />
          </ScrollView>
          <Pressable style={styles.readMoreButtonStyle(primary1)} onPress={() => {
            setCurrentItem(item);
            bottomSheetRef?.current?.open();
          }}>
            <Text style={styles.readMoreButtonTextStyle}>Read More</Text>
          </Pressable>
          <RBSheet
            key={name}
            ref={bottomSheetRef}
            height={height / 2}
            minClosingHeight={height / 2}
            openDuration={250}
            wrapper={{ flexGrow: 1 }}
            keyboardAvoidingViewEnabled={true}
            customStyles={{
              container: {
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
                borderTopLeftRadius: moderateScale(20),
                borderTopRightRadius: moderateScale(20),
              },
            }}
          >
            <EventProjectDetailsSheetData currentProjectData={currentItem} tab="judges" bottomSheetRef={bottomSheetRef} />
          </RBSheet>
        </View>
    );
  };

  const renderPerformerFlatList = (item, index) => {
    const {
      image = '',
      name = '',
      top_performer = false,
    } = item;

    return tab === 'performers' ?
      <View key={index} style={styles.performersListDataContainer}>
        <View style={styles.performersImage(moderateScale(60), moderateScale(60), moderateScale(0))}>
          <FastImage source={{ uri: image !== '' ? image : '' }} style={{ width: moderateScale(60), height: moderateScale(60) }} resizeMode={FastImage.resizeMode.contain} />
        </View>
        <Text style={[styles.performersName(primary1), { flex: 1, textAlign: 'left', marginLeft: 10 }]}>{name}</Text>
        {top_performer ? <Ionicons name="ios-star-sharp" color={'#FFDE00'} size={40} style={{ alignSelf: 'center', margin: 10 }} /> : null}
      </View>
      :
      <View key={index} style={styles.performersListDataContainer}>
        <View style={styles.performersImage(moderateScale(60), moderateScale(60), moderateScale(0))}>
          <FastImage source={{ uri: image !== '' ? image : '' }} style={{ width: moderateScale(60), height: moderateScale(60), margin: 0 }} resizeMode={FastImage.resizeMode.contain} />
        </View>
        <View style={styles.eventDetailsContainer}>
          <Text numberOfLines={1} style={styles.buttonText(primary1)}>{name}</Text>
          <Pressable style={styles.readMoreButtonListStyle(primary1)} onPress={() => {
            setCurrentItem(item);
            bottomSheetRef?.current?.open();
          }}>
            <Text style={styles.readMoreButtonTextStyle}>READ MORE</Text>
          </Pressable>
        </View>
        <RBSheet
          key={name}
          ref={bottomSheetRef}
          height={height / 2}
          minClosingHeight={height / 2}
          openDuration={250}
          wrapper={{ flexGrow: 1 }}
          keyboardAvoidingViewEnabled={true}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              borderTopLeftRadius: moderateScale(20),
              borderTopRightRadius: moderateScale(20),
            },
          }}
        >
          <EventProjectDetailsSheetData currentProjectData={currentItem} tab="judges" bottomSheetRef={bottomSheetRef} />
        </RBSheet>
      </View>;
  };

  return (
    <View
      style={iconIndex === 0 ? styles.performersContainer : styles.performersListContainer}
    >
      {iconIndex === 0 ?
        performers.length > 0 ?
          <View style={{ flex: 1 }}>
            <Carousel
              ref={isCarousel}
              data={performers}
              sliderWidth={width + 30}
              renderItem={renderPerformer}
              activeSlideOffset={1}
              itemWidth={width - 100}
              inactiveSlideScale={0.9}
              inactiveSlideOpacity={1}
              enableMomentum={true}
              removeClippedSubviews={false}
              keyExtractor={(i) => i.name}
              onSnapToItem={(ind) => setPerformersIndex(ind)}
              activeSlideAlignment={'center'}
              containerCustomStyle={{ flexGrow: 1 }}
            />
            <Pagination
              dotsLength={performers.length}
              activeDotIndex={performersIndex}
              carouselRef={isCarousel}
              dotStyle={{
                width: 15,
                height: 15,
                borderRadius: 50,
                backgroundColor: '#7E7E7E',
              }}
              containerStyle={{ backgroundColor: 'transparent' }}
              tappableDots={true}
              inactiveDotStyle={{
                width: 15,
                height: 15,
                borderRadius: 50,
                backgroundColor: 'rgba(126, 126, 126, 0.7)',
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          </View> : null :
        performers.length > 0 ? performers.map((item, index) => renderPerformerFlatList(item, index)) : <EmptyView message="No Data found" />
      }
    </View>
  );
};
