import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";

import GradientButton from "./GradientButton";

const DateTimePickerComponent = ({
  onCancelPress,
  date = moment(),
  visible = false,
  onDateTimeChange,
  mode = "datetime",
  hasMinDate = true,
  hasMaxDate = false,
}) => {
  const [showDateTimePickerModal, setShowDateTimePicker] = useState(false);
  const [selectediOSSessionDate, setiOSSelectedSessionDate] = useState(date);

  useEffect(() => {
    if (Platform.OS === "ios") {
      setiOSSelectedSessionDate(date);
    }
  }, [date]);

  useEffect(() => {
    if (Platform.OS === "ios") {
      setShowDateTimePicker(visible);
    }
  }, [visible]);

  const onDateSelected = (event, selectedDate) => {
    if (selectedDate !== undefined) {
      onDateTimeChange(moment(selectedDate));
    }
    if (event.type === "dismissed" && onCancelPress) {
      onCancelPress();
    }
  };

  const oniOSDateSelectd = (_event, selectedDate) => {
    if (selectedDate !== undefined) {
      setiOSSelectedSessionDate(moment(selectedDate));
    }
  };

  const onDatePickerConfirmPress = (d) => {
    onDateTimeChange(d);
  };

  if (visible && Platform.OS === "android") {
    return (
      <DateTimePicker
        mode={mode}
        value={date.toDate()}
        minimumDate={hasMinDate ? moment().toDate() : undefined}
        maximumDate={hasMaxDate ? moment().toDate() : undefined}
        onChange={onDateSelected}
      />
    );
  } else if (visible && Platform.OS === "ios") {
    return (
      <Modal
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        onDismiss={() => setShowDateTimePicker(false)}
        visible={showDateTimePickerModal}
      >
        <SafeAreaView style={modalStyles.iosPickerStyle}>
          <Pressable
            style={modalStyles.iosPickerSubContainer}
            onPress={() => {
              setShowDateTimePicker(false);
              onCancelPress();
            }}
          >
            <View style={modalStyles.modalDataContainer}>
              <DateTimePicker
                value={selectediOSSessionDate.toDate()}
                mode={mode}
                display={"spinner"}
                minimumDate={hasMinDate ? moment().toDate() : undefined}
                maximumDate={hasMaxDate ? moment().toDate() : undefined}
                onChange={oniOSDateSelectd}
                style={modalStyles.iosPickerBtnStyle}
                themeVariant="dark"
                textColor="black"
              />
              <View style={modalStyles.modalBtnContainer}>
                <GradientButton
                  onPress={() => {
                    if (onCancelPress) {
                      onCancelPress();
                    }
                    setShowDateTimePicker(false);
                  }}
                  text={"Cancel"}
                  gradientContainer={modalStyles.modalBtnStyle}
                />
                <GradientButton
                  onPress={() =>
                    onDatePickerConfirmPress(selectediOSSessionDate)
                  }
                  text={"Okay"}
                  gradientContainer={modalStyles.modalBtnStyle}
                />
              </View>
            </View>
          </Pressable>
        </SafeAreaView>
      </Modal>
    );
  } else {
    return null;
  }
};

const modalStyles = StyleSheet.create({
  iosPickerStyle: {
    flex: 1,
    backgroundColor: "#00000080",
  },
  iosPickerSubContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
  modalDataContainer: {
    backgroundColor: "#ffffff",
    width: "90%",
    paddingVertical: 20,
    borderRadius: 20,
    alignSelf: "center",
  },
  modalBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnStyle: {
    marginTop: 15,
    marginHorizontal: 10,
    paddingHorizontal: 20,
  },
  iosPickerBtnStyle: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DateTimePickerComponent;
