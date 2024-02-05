import React, { useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import RBSheet from "react-native-raw-bottom-sheet";

import EventProjectDetailsSheetData from './EventProjectDetailsSheetData';

import { useCustomer } from "../../context/CustomerContext";
import { moderateScale } from '../../styles/utils/utils';
import styles from "./EventDetailsStyle";


const EventProjectsComponent = (props) => {
  const { height } = useWindowDimensions();
  const bottomSheetRef = useRef(null);


  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;
  const { eventProjectData = [] } = props;

  const renderSeprator = () => (
    <View style={styles.listSeprator} />
  );

  const renderEvent = (item) => {
    const { name = '', image = '' } = item;
    return (
      <View key={name}>
        <View
          style={styles.buttons}
        >
          <View style={styles.listEventImageContainer}>
            <View style={styles.listEventImageSubContainer}>
              <FastImage
                source={{ uri: image }}
                style={styles.listEventImage}
                resizeMode={FastImage.resizeMode.stretch}
              />
            </View>
          </View>
          <View style={styles.eventDetailsContainer}>
            <Text numberOfLines={1} style={styles.buttonText(primary1)}>{name}</Text>
            <Pressable style={styles.readMoreButtonStyle(primary1)} onPress={() => { bottomSheetRef?.current?.open(); }}>
              <Text style={styles.readMoreButtonTextStyle}>READ MORE</Text>
            </Pressable>
          </View>
          <RBSheet
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
            <EventProjectDetailsSheetData currentProjectData={item} tab="projects" bottomSheetRef={bottomSheetRef} />
          </RBSheet>
        </View>
        {renderSeprator()}
      </View>
    );

  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.eventListScrollContainer}
      // refreshControl={
      //   <RefreshControl
      //     refreshing={refreshing}
      //     tintColor={primary1 || "#062D5B"}
      //     colors={[primary1 || "#062D5B", primary2 || "#7E7E7E"]}
      //     onRefresh={() => {
      //       setRefreshing(true);
      //       if (search.length > 0) {

      //       } else {

      //       }
      //     }}
      //   />
      // }
      >
        {eventProjectData.map(renderEvent)}
      </ScrollView>
    </View>
  );



};
export default EventProjectsComponent;
