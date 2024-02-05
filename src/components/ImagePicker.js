import React, { useState } from 'react';
import {
  Text,
  View,
  Modal,
  Platform,
  Pressable,
  Dimensions,
  StyleSheet,
} from 'react-native';
import isFunction from "lodash/isFunction";
import ImagePicker from "react-native-image-crop-picker";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import * as hFunctions from "../services/helperFunctions";
import { useCustomer } from "../context/CustomerContext";
import fonts from '../theme/fonts';

const imageCroppingOptions = {
  // width: 250,
  // height: 250,
  cropping: true,
  multiple: false,
  mediaType: 'photo',
  writeTempFile: true,
  includeBase64: true,
  freeStyleCropEnabled: true,
  compressImageQuality: 0.8,
  enableRotationGesture: true,
  avoidEmptySpaceAroundImage: true,
};

const ImagePickerComponent = (props) => {
  const { text = "", onImageChange } = props;

  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  const [visible, setVisible] = useState(false);

  const onButtonPress = async () => {
    const userId = await AsyncStorage.getItem("@userId");
    if (!userId || userId == -1) {
      hFunctions.showNotificationMessage("Image Upload Warning", "You need to register/login if you want to upload photos in this event.", {
        type: "warning",
      });
      return null;
    }
    setVisible(true);
  };

  const onCameraPress = async () => {
    try {
      const result = await ImagePicker.openCamera(imageCroppingOptions);
      if (isFunction(onImageChange)) {
        onImageChange(result);
      }
      setVisible(false);
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Camera Open Issue", errorMessage.trim(), {
        type: "danger",
      });
    }
  };

  const onGalleryPress = async () => {
    try {
      const result = await ImagePicker.openPicker(imageCroppingOptions);
      if (isFunction(onImageChange)) {
        onImageChange(result);
      }
      setVisible(false);
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Gallery Open Issue", errorMessage.trim(), {
        type: "danger",
      });
    }
  };

  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        presentationStyle="overFullScreen"
        onDismiss={() => setVisible(false)}
      >
        <View style={styles.imagePickerModalContainer}>
          <View style={styles.imagePickerModalSubContainer}>
            <View style={styles.imagePickerHandleView} />
            <Text style={styles.imagePickerContainerTitle}>Select Image</Text>
            <View style={styles.seprator} />
            <Pressable onPress={onCameraPress} style={styles.imagePickerSubButton}>
              <Text style={styles.imagePickerSubButtonText}>Open Camera</Text>
              <MaterialCommunityIcons name="camera" size={25} color={"#D1D1D1"} />
            </Pressable>
            <View style={styles.seprator} />
            <Pressable onPress={onGalleryPress} style={styles.imagePickerSubButton}>
              <Text style={styles.imagePickerSubButtonText}>Open Gallery</Text>
              <MaterialCommunityIcons name="image-album" size={25} color={"#D1D1D1"} />
            </Pressable>
            <View style={styles.seprator} />
            <Pressable
              onPress={() => setVisible(false)}
              style={[styles.imagePickerSubButton, styles.cancelButton(primary1)]}
            >
              <Text style={[styles.imagePickerSubButtonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.closeButton} onPress={() => setVisible(false)}>
              <AntDesign name="close" size={25} color="#D1D1D1" />
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        onPress={onButtonPress}
        style={styles.addPhotoButton(primary1)}
      >
        <Text style={styles.addPhotoButtonText}>{text}</Text>
      </Pressable>
    </>
  );
};

const { height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  cancelButton: (color) => ({
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: color || "#5086A7",
  }),
  cancelButtonText: {
    fontSize: 18,
    lineHeight: 21,
    color: "#ffffff",
    letterSpacing: 1,
    alignSelf: "center",
    fontFamily: fonts.Bold_Font,
  },
  addPhotoButton: (color) => ({
    height: 45,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: color || "#5086A7",
  }),
  addPhotoButtonText: {
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 1,
    color: "#FFFFFF",
    fontFamily: fonts.Medium_Font,
  },
  imagePickerSubButtonText: {
    fontFamily: fonts.Regular_Font,
    fontSize: 15,
    color: "#7E7E7E",
    lineHeight: 17,
    letterSpacing: 1,
  },
  imagePickerSubButton: {
    height: 50,
    paddingLeft: 20,
    paddingRight: 15,
    marginVertical: 30,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seprator: {
    borderTopWidth: 1,
    borderTopColor: "#D1D1D1",
  },
  imagePickerContainerTitle: {
    color: "#7E7E7E",
    fontFamily: fonts.Bold_Font,
    fontSize: 18,
    lineHeight: 21,
    alignSelf: "center",
    letterSpacing: 1,
    marginVertical: 20,
  },
  imagePickerHandleView: {
    height: 6,
    width: "25%",
    borderRadius: 5,
    alignSelf: "center",
    backgroundColor: "#C4C4C4",
  },
  imagePickerContainer: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: "center",
  },
  imagePickerModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imagePickerModalSubContainer: {
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
  closeButton: {
    position: "absolute",
    top: 15,
    right: 20,
  },
});

export default ImagePickerComponent;
