import React, { useState, useEffect } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ProgramComponent from "../../components/ProgramComponent/ProgramComponent";
import EmptyView from "../../components/EmptyView";
import Filter from "../../components/ProgramFilter";

import * as hFunctions from "../../services/helperFunctions";
import { programNavIgnoreTypes } from "../../services/data";
import { navigateTo } from "../../context/NavigationContext";
import styles from "./EventDetailsStyle";
import APIs from "../../services/api";


export default (props) => {
  const {
    eventData = {},
    eventSubType = "",
    showFilter = true,
    programs: eventPrograms = [],
  } = props;
  const { event_id, background_image } = eventData;
  const [programs, setPrograms] = useState(eventPrograms);
  const [programFilters, setProgramFilters] = useState({});

  useEffect(() => {
    getProgramFilters();
  }, []);

  useEffect(() => {
    setPrograms(eventPrograms);
  }, [eventPrograms]);

  const getProgramFilters = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      const res = await APIs.getProgramFilters({ event_id }, { user_id: userId });
      const { data = {} } = res;
      setProgramFilters(data);
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Program Filter Error", errorMessage.trim(), {
        type: "danger",
      });
    }
  };

  const goToGameDetails = async (programId) => {
    if (programNavIgnoreTypes.some(et => eventSubType.includes(et))) {
      return null;
    }
    const programParams = {
      event_id,
      eventSubType,
      background_image,
      program_id: programId,
    };
    navigateTo("GameDetails", { programParams });
  };

  const onApplyFilter = (filterData = {}) => {
    const { filteredPrograms = [] } = filterData;
    setPrograms(filteredPrograms);
  };

  const onFilterClear = () => {
    setPrograms(eventPrograms);
  };

  const renderProgram = (item, index) => {
    const isLastItem = index === programs.length - 1;
    return (
      <ProgramComponent
        data={item}
        index={index}
        key={index.toString()}
        isLastProgram={isLastItem}
        onPress={() => goToGameDetails(item?.id)}
      />
    );
  };
  return (
    <View style={styles.programContainer}>
      {
        showFilter ? (
          <View style={{ marginBottom: 30 }}>
            <Filter
              eventId={event_id}
              filters={programFilters}
              onApplyFilter={onApplyFilter}
              onFilterClear={onFilterClear}
            />
          </View>
        ) : null
      }
      {/* <View style={styles.programTitleContainer}>
        <Text style={styles.programTitle}>Program for the day</Text>
        <Pressable style={styles.programDownloadBtn}>
          <Feather name="download" size={25} color={primary1 || "#062D5B"} />
        </Pressable>
      </View> */}
      <View style={styles.seprator} />
      {programs.map(renderProgram)}
      {
        programs.length < 1 ? (
          <EmptyView message="No programs found" />
        ) : null
      }
    </View>
  );
};
