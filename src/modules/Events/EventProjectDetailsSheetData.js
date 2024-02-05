import React from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import FastImage from "react-native-fast-image";
import Ionicons from 'react-native-vector-icons/Ionicons';

import DescriptionComponent from "../../components/DescriptionComponent";

import { useCustomer } from "../../context/CustomerContext";
import { moderateScale } from "../../styles/utils/utils";
import styles from "./EventDetailsStyle";
import fonts from "../../theme/fonts";

const EventProjectDetailsSheetData = (props) => {
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;
  const { currentProjectData = {}, projectData = [], tab = '', bottomSheetRef } = props;

  const renderSeprator = () => (
    <View style={styles.listSeprator} />
  );

  const renderProject = (item) => {
    const { name = '', image = '' } = item;
    return (
      <View key={name}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center' }}
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
            <Text numberOfLines={1} style={{
              fontSize: 18,
              color: primary1,
              fontFamily: fonts.Bold_Font,
            }}>{name}</Text>
          </View>
        </View>
        {renderSeprator()}
      </View>
    );
  };

  const renderCurrentProjectDecscription = () => {
    const { name = '', description = '', image = '' } = currentProjectData;
    return (
      <View style={{ margin: moderateScale(5) }}>
        <Pressable onPress={() => { bottomSheetRef?.current?.close(); }} style={{ position: 'absolute', right: 0, zIndex: 10 }} >
          <Ionicons name="close" size={30} color={'#000000'} style={{ alignSelf: 'flex-end', margin: moderateScale(10) }} />
        </Pressable>
        <View
          style={[styles.buttons, { padding: moderateScale(5), marginTop: moderateScale(25), marginLeft: 10 }]}
        >
          {tab === 'judges' ?
            <View style={{ width: moderateScale(60), height: moderateScale(60), borderRadius: 100, overflow: 'hidden', alignSelf: 'center' }}>
              <FastImage source={{ uri: image !== '' ? image : '' }} style={{ width: moderateScale(60), height: moderateScale(60) }} resizeMode={FastImage.resizeMode.contain} />
            </View>
            :
            <View style={styles.listEventImageContainer}>
              <View style={styles.listEventImageSubContainer}>
                <FastImage
                  source={{ uri: image }}
                  style={styles.listEventImage}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </View>
            </View>}
          <View style={styles.eventDetailsContainer}>
            <Text numberOfLines={1} style={styles.buttonText(primary1)}>{name}</Text>
          </View>
        </View>
        <View style={{ marginHorizontal: 10 }} >{renderSeprator()}</View>
        {/* <View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Text style={styles.extraInfoBoxDescription}>{description}</Text>
            </ScrollView>
          </View> */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >
          <DescriptionComponent description={description} baseStyle={styles.extraInfoBoxDescription} />
          {projectData.length > 0 && tab === 'judges' ? <View style={{ flex: 1, flexDirection: 'column', marginTop: 25, paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 18, color: primary2, fontFamily: fonts.Bold_Font, marginLeft: 10 }}>PROJECTS</Text>
            {/* <ScrollView style={{ marginTop: 20 }} contentContainerStyle={{ flexGrow: 1 }} >{projectData.map(renderProject)}</ScrollView> */}
            <View style={{ flex: 1, marginTop: 20 }} >{projectData.map(renderProject)}</View>
          </View> : null}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <ScrollView
        contentContainerStyle={styles.eventListScrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          tintColor={primary1 || "#062D5B"}
          colors={[primary1 || "#062D5B", primary2 || "#7E7E7E"]}
          onRefresh={() => {
            setRefreshing(true);
            if (search.length > 0) {

            } else {

            }
          }}
        />
      }
      > */}
      {renderCurrentProjectDecscription()}

    </View>
  );



};
export default EventProjectDetailsSheetData;
