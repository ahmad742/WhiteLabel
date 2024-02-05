import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import {
  Text,
  View,
  Modal,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import isFunction from "lodash/isFunction";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import EmptyView from "./EmptyView";

import * as hFunctions from "../services/helperFunctions";
import { useCustomer } from "../context/CustomerContext";
import APIs from '../services/api';
import fonts from '../theme/fonts';

const Filter = (props) => {
  const {
    eventId,
    onApplyFilter,
    onFilterClear,
    filters = {},
  } = props;
  const { venues = [], teams = [], dates = [] } = filters;

  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;
  const teamRef = useRef();
  const venueRef = useRef();

  const [visible, setVisible] = useState(false);
  const [applying, setApplying] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [selectedTeam, setSelectedTeam] = useState({});
  const [selectedVenue, setSelectedVenue] = useState({});

  const onApplyFilterPress = async () => {
    if (isFunction(onApplyFilter)) {
      try {
        setApplying(true);
        const fData = {
          date: filterDate,
          event_id: eventId,
          team_id: selectedTeam?.team_id || "",
          venue_id: selectedVenue?.venue_id || "",
        };

        const userId = await AsyncStorage.getItem("@userId");
        const res = await APIs.getEvetsPrograms(fData, { user_id: userId });
        const { programs: filteredPrograms = [] } = res?.data;
        onApplyFilter({ filteredPrograms });
        setVisible(false);
      } catch (error) {
        const errorMessage = hFunctions.getErrorMessage(error);
        hFunctions.showNotificationMessage("Venues Data Error", errorMessage.trim(), {
          type: "danger",
        });
      } finally {
        setApplying(false);
      }
    }
  };

  const onClearPress = () => {
    if (teamRef.current) {
      teamRef.current.clearData();
    }
    if (venueRef.current) {
      venueRef.current.clearData();
    }
    if (isFunction(onFilterClear)) {
      onFilterClear();
    }
    setFilterDate("");
    setSelectedTeam({});
    setSelectedVenue({});
    setVisible(false);
  };

  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="slide"
        presentationStyle="overFullScreen"
        onDismiss={() => setVisible(false)}
      >
        <View style={styles.filterModalContainer}>
          <View style={styles.filterModalSubContainer}>
            <View style={styles.filterHandleView} />
            <Text style={styles.filterContainerTitle}>Filters</Text>
            <View style={styles.seprator} />
            <Text style={styles.filterTitle}>Date</Text>
            <DatePickerModal
              dates={dates}
              value={filterDate}
              onDateChange={(d) => setFilterDate(d)}
            />
            <View style={styles.seprator} />
            <Text style={styles.filterTitle}>Venue</Text>
            <VenuessPickerModal
              ref={venueRef}
              venues={venues}
              value={selectedVenue}
              onVenueChange={(vn) => setSelectedVenue(vn)}
            />
            <View style={styles.seprator} />
            <Text style={styles.filterTitle}>Team</Text>
            <TeamsPickerModal
              teams={teams}
              ref={teamRef}
              value={selectedTeam}
              onTeamChange={(tm) => setSelectedTeam(tm)}
            />
            <View style={styles.filterButtonContainer}>
              <Pressable
                disabled={applying}
                style={styles.clearBtn}
                onPress={() => onClearPress()}
              >
                <Text style={styles.clearBtnTxt}>Clear All</Text>
              </Pressable>
              <Pressable
                disabled={applying}
                style={styles.applyBtn(primary1)}
                onPress={() => onApplyFilterPress()}
              >
                {
                  applying ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.applyBtnTxt}>Apply</Text>
                  )
                }
              </Pressable>
            </View>
            <Pressable style={styles.closeButton} onPress={() => setVisible(false)}>
              <AntDesign name="close" size={25} color="#D1D1D1" />
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={styles.filterButton}
        onPress={() => setVisible(true)}
      >
        <View style={styles.filterContainer}>
          <Text numberOfLines={1} style={styles.filterText}>Filter</Text>
        </View>
        <AntDesign name="filter" style={styles.iconStyle} />
      </Pressable>
    </>
  );
};

const DatePickerModal = forwardRef((props, ref) => {
  const { dates = [], onDateChange, value = "" } = props;

  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);

  useImperativeHandle(ref, () => ({
    clearData() {
      setSelectedDate("");
    },
  }));

  const onDateSelect = (date) => {
    if (isFunction(onDateChange)) {
      onDateChange(date);
    }
    setSelectedDate(date);
    setVisible(false);
  };

  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="slide"
        presentationStyle="overFullScreen"
        onDismiss={() => setVisible(false)}
      >
        <SafeAreaView style={styles.pickerModal}>
          <View style={styles.pickerBox}>
            <Text style={styles.modalTitalText}>Dates</Text>
            <View style={styles.seprator} />
            <FlatList
              data={dates}
              keyExtractor={(t, i) => `${t}-${i}`}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.seprator} />}
              renderItem={({ item }) => {
                const selected = selectedDate === item;
                return (
                  <Pressable style={styles.teamView} onPress={onDateSelect.bind(this, item)}>
                    <Text style={styles.teamName(selected ? primary1 : "")}>{item}</Text>
                    {
                      selected ? (
                        <AntDesign name="check" size={20} color={primary1 || "#062D5B"} />
                      ) : null
                    }
                  </Pressable>
                );
              }}
            />
            <Pressable onPress={() => setVisible(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseBtnTxt}>Cancel</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
      <Pressable
        style={styles.filterSubButton}
        onPress={() => setVisible(true)}
      >
        <Text
          numberOfLines={1}
          style={styles.filterSubButtonText}
        >{selectedDate ? selectedDate : "Please Select Date"}</Text>
        <MaterialCommunityIcons name="calendar-blank-outline" size={25} color={"#D1D1D1"} />
      </Pressable>
    </>
  );
});

const TeamsPickerModal = forwardRef((props, ref) => {
  const { teams = [], onTeamChange, value = {} } = props;

  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  const [visible, setVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(value);

  useImperativeHandle(ref, () => ({
    clearData() {
      setSelectedTeam({});
    },
  }));

  const onTeamSelect = (team) => {
    if (isFunction(onTeamChange)) {
      onTeamChange(team);
    }
    setSelectedTeam(team);
    setVisible(false);
  };

  const { team_id: sTeamId, team = "" } = selectedTeam;
  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="slide"
        presentationStyle="overFullScreen"
        onDismiss={() => setVisible(false)}
      >
        <SafeAreaView style={styles.pickerModal}>
          <View style={styles.pickerBox}>
            <Text style={styles.modalTitalText}>Teams</Text>
            <View style={styles.seprator} />
            <FlatList
              data={teams}
              keyExtractor={(t) => `${t.team_id}`}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.seprator} />}
              renderItem={({ item }) => {
                const { team: lTeam = "", team_id = "" } = item;
                const selected = team_id === sTeamId;
                return (
                  <Pressable style={styles.teamView} onPress={onTeamSelect.bind(this, item)}>
                    <Text style={styles.teamName(selected ? primary1 : "")}>{lTeam}</Text>
                    {
                      selected ? (
                        <AntDesign name="check" size={20} color={primary1 || "#062D5B"} />
                      ) : null
                    }
                  </Pressable>
                );
              }}
            />
            <Pressable onPress={() => setVisible(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseBtnTxt}>Cancel</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
      <Pressable
        style={styles.filterSubButton}
        onPress={() => setVisible(true)}
      >
        <Text
          numberOfLines={1}
          style={styles.filterSubButtonText}
        >{team ? team : "Please Select Team"}</Text>
        <Feather name="users" size={25} color={"#D1D1D1"} />
      </Pressable>
    </>
  );
});

const VenuessPickerModal = forwardRef((props, ref) => {
  const { onVenueChange, value = {}, venues = [] } = props;

  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  const [visible, setVisible] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(value);

  useImperativeHandle(ref, () => ({
    clearData() {
      setSelectedVenue({});
    },
  }));

  const onVenueSelect = (venue) => {
    if (isFunction(onVenueChange)) {
      onVenueChange(venue);
    }
    setSelectedVenue(venue);
    setVisible(false);
  };

  const { venue_id: sVenueId, venue = "" } = selectedVenue;
  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="slide"
        presentationStyle="overFullScreen"
        onDismiss={() => setVisible(false)}
      >
        <SafeAreaView style={styles.pickerModal}>
          <View style={styles.pickerBox}>
            <Text style={styles.modalTitalText}>Venues</Text>
            <View style={styles.seprator} />
            <FlatList
              data={venues}
              keyExtractor={(t) => `${t.venue_id}`}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.seprator} />}
              renderItem={({ item }) => {
                const { venue: lVenue = "", venue_id = "" } = item;
                const selected = venue_id === sVenueId;
                return (
                  <Pressable style={styles.teamView} onPress={onVenueSelect.bind(this, item)}>
                    <Text style={styles.teamName(selected ? primary1 : "")}>{lVenue}</Text>
                    {
                      selected ? (
                        <AntDesign name="check" size={20} color={primary1 || "#062D5B"} />
                      ) : null
                    }
                  </Pressable>
                );
              }}
              ListEmptyComponent={() => (
                <EmptyView message="No Venues Found" />
              )}
            />
            <Pressable onPress={() => setVisible(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseBtnTxt}>Cancel</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
      <Pressable
        style={styles.filterSubButton}
        onPress={() => setVisible(true)}
      >
        <Text
          numberOfLines={1}
          style={styles.filterSubButtonText}
        >{venue ? venue : "Please Select Venue"}</Text>
        <MaterialCommunityIcons name="map-marker" size={25} color={"#D1D1D1"} />
      </Pressable>
    </>
  );
});

const { height, width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  applyBtnTxt: {
    fontFamily: fonts.Medium_Font,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 1,
    color: "#FFFFFF",
  },
  applyBtn: (color) => ({
    height: 40,
    width: 110,
    borderRadius: 5,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: color || "#5086A7",
  }),
  clearBtnTxt: {
    fontFamily: fonts.Medium_Font,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 1,
    color: "#7E7E7E",
  },
  clearBtn: {
    height: 40,
    width: 110,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 15,
    alignItems: 'center',
    borderColor: "#D1D1D1",
    justifyContent: "center",
  },
  filterButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  filterSubButtonText: {
    flex: 1,
    fontFamily: fonts.Regular_Font,
    fontSize: 15,
    color: "#7E7E7E",
    lineHeight: 17,
    letterSpacing: 1,
  },
  filterSubButton: {
    height: 50,
    paddingLeft: 20,
    paddingRight: 15,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterTitle: {
    fontFamily: fonts.Medium_Font,
    fontSize: 15,
    color: "#7E7E7E",
    lineHeight: 17,
    letterSpacing: 1,
    marginTop: 15,
  },
  seprator: {
    borderTopWidth: 1,
    borderTopColor: "#D1D1D1",
  },
  filterContainerTitle: {
    color: "#7E7E7E",
    fontFamily: fonts.Bold_Font,
    fontSize: 18,
    lineHeight: 21,
    alignSelf: "center",
    letterSpacing: 1,
    marginVertical: 20,
  },
  filterHandleView: {
    height: 6,
    width: "25%",
    borderRadius: 5,
    alignSelf: "center",
    backgroundColor: "#C4C4C4",
  },
  filterButton: {
    height: 40,
    width: '80%',
    borderWidth: 1,
    borderRadius: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    borderColor: '#D1D1D1',
  },
  filterContainer: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: "center",
  },
  filterText: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: fonts.Regular_Font,
    color: "#7E7E7E",
  },
  iconStyle: {
    fontSize: 22,
    alignSelf: 'center',
    color: '#D1D1D1',
    marginHorizontal: 15,
  },
  filterModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  filterModalSubContainer: {
    padding: 20,
    maxHeight: height * 0.8,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  filterModalScrollContainer: {
    flexGrow: 1,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 20,
  },
  pickerBox: {
    padding: 20,
    borderRadius: 10,
    width: width * 0.9,
    maxHeight: height * 0.6,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  pickerModal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  teamView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  teamName: (color) => ({
    fontSize: 14,
    lineHeight: 16,
    fontFamily: fonts.Regular_Font,
    color: color || "#7E7E7E",
  }),
  modalCloseBtnTxt: {
    fontFamily: fonts.Medium_Font,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 1,
    color: "#7E7E7E",
  },
  modalCloseBtn: {
    height: 40,
    width: 110,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
    alignSelf: "center",
    alignItems: 'center',
    borderColor: "#D1D1D1",
    justifyContent: "center",
  },
  modalTitalText: {
    color: "#7E7E7E",
    fontFamily: fonts.Bold_Font,
    fontSize: 18,
    lineHeight: 21,
    alignSelf: "center",
    letterSpacing: 1,
    marginBottom: 10,
  },
});

export default Filter;
