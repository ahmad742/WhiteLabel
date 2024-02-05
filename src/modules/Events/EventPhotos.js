import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Keyboard,
  TextInput,
  Pressable,
  SafeAreaView,
  LayoutAnimation,
  ActivityIndicator,
} from "react-native";
import isEmpty from "lodash/isEmpty";
import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import ImageViewer from "react-native-image-zoom-viewer";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ImagePickerButton from "../../components/ImagePicker";
import EmptyView from "../../components/EmptyView";

import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import styles from "./EventDetailsStyle";
import APIs from "../../services/api";

export default (props) => {
  const { eventPhotos = [], eventId } = props;

  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  const [photos, setPhotos] = useState(eventPhotos);
  const [imageData, setImageData] = useState({});
  const [sharing, setSharing] = useState(false);
  const [showImageView, setShowImageView] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageDescription, setImageDescription] = useState("");
  const [initialPhotoIndex, setInitialPhotoIndex] = useState(0);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);

  useEffect(() => {
    setPhotos(eventPhotos);
  }, [eventPhotos, eventId]);

  const showImageViewer = (ind) => {
    setInitialPhotoIndex(ind);
    setShowImageView(true);
  };

  const hideImageViewer = () => {
    setShowImageView(false);
    setInitialPhotoIndex(0);
  };

  const onImageUploadPress = async () => {
    Keyboard.dismiss();
    setImageUploading(true);
    try {
      const userId = await AsyncStorage.getItem("@userId");
      const imgData = {
        event_id: eventId,
        description: imageDescription,
        image: imageData.base64ImageData,
      };
      const res = await APIs.uploadEventPhoto(imgData, { user_id: userId });
      const { photo_id, message } = res.data;
      hFunctions.showNotificationMessage("Photo Upload Info", message, {
        type: photo_id ? "success" : "danger",
      });
      if (photo_id) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setPhotos([
          { link: imageData.uri, description: imageDescription },
          ...photos,
        ]);
        setTimeout(() => {
          closeImageUpload();
        }, 500);
      }
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Photo Upload Error", errorMessage.trim(), {
        type: "danger",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const onImageChange = (imgData) => {
    const { data, sourceURL, path, type } = imgData;
    const mimeType = `${type}/${path.split(".").pop()}`;
    const base64ImageData = `data:${mimeType};base64,${data}`;
    setTimeout(() => {
      setImageData({ base64ImageData, uri: sourceURL || path });
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowImageUploadModal(true);
    }, 200);
  };

  const closeImageUpload = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowImageUploadModal(false);
    setImageData({});
  };

  const onImageSharePress = async (urlIndex) => {
    const url = photos[urlIndex].link;
    setSharing(true);
    hFunctions.fileDownload(
      url,
      null,
      async ({ fileUrl = "" }) => {
        try {
          await Share.open({
            url: !fileUrl.includes("file://") ? `file://${fileUrl}` : fileUrl,
          });
        } catch (error) {
          const errorMessage = hFunctions.getErrorMessage(error);
          hFunctions.showNotificationMessage("File Sharing Error", errorMessage.trim(), {
            type: "danger",
          });
        } finally {
          setSharing(false);
        }
      },
      (error) => {
        setSharing(false);
        const errorMessage = hFunctions.getErrorMessage(error);
        hFunctions.showNotificationMessage("File Sharing Error", errorMessage.trim(), {
          type: "danger",
        });
      }
    );
  };

  const renderImageViewerFooter = (currentIndex) => {
    return (
      <SafeAreaView style={styles.imageViewFooterSubContainer}>
        <View style={{ flex: 1 }}>
          {photos[currentIndex]?.description ? <Text style={styles.imageCaption}>{photos[currentIndex]?.description}</Text> : null}
        </View>
        <View style={styles.imageViewFooterButtonContainer}>
          {
            sharing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Pressable onPress={onImageSharePress.bind(this, currentIndex)} style={styles.imageShareBtn}>
                <Text style={styles.imageShareBtnTxt}>Share</Text>
              </Pressable>
            )
          }
        </View>
      </SafeAreaView>
    );
  };

  const imageURLs = photos.map(p => ({ url: p.link }));

  return (
    <>
      <View style={styles.infoContainer}>
        <ImagePickerButton
          text="Snap a Pic"
          onImageChange={onImageChange}
        />
        {
          showImageUploadModal && !isEmpty(imageData) ? (
            <>
              <View style={styles.imageViewContainer}>
                <FastImage
                  style={styles.imagePreview}
                  source={{ uri: imageData.uri }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <View style={styles.imageUploadDescriptioonBox}>
                  <TextInput
                    multiline
                    value={imageDescription}
                    placeholder="Write a caption"
                    style={styles.imageDescriptionInput}
                    onChangeText={(v) => setImageDescription(v)}
                  />
                </View>
              </View>
              <View style={styles.imageUploadButtonContainer}>
                <Pressable disabled={imageUploading} onPress={closeImageUpload} style={[styles.imageUploadButton(), styles.imageUploadCancelButton(primary1)]}>
                  <Text style={[styles.imageUploadButtonText, styles.imageUploadCancelButtonText(primary1)]}>Cancel</Text>
                </Pressable>
                <Pressable
                  disabled={imageUploading}
                  style={styles.imageUploadButton(primary1)}
                  onPress={onImageUploadPress}
                >
                  {
                    imageUploading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.imageUploadButtonText}>Post My Picture</Text>
                    )
                  }
                </Pressable>
              </View>
            </>
          ) : null
        }
        {
          photos.map((p, i) => (
            <Pressable key={`${p.link}-${i}`} onPress={() => showImageViewer(i)}>
              <FastImage
                source={{ uri: p.link }}
                style={styles.photoStyle}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text numberOfLines={2} style={styles.photoDescription(primary1)}>{p.description}</Text>
            </Pressable>
          ))
        }
        {
          photos.length === 0 ? (
            <EmptyView
              message="No photos found"
            />
          ) : null
        }
      </View>
      <Modal
        transparent
        animationType="fade"
        visible={showImageView}
        onRequestClose={hideImageViewer}
      >
        <ImageViewer
          enableImageZoom
          enableSwipeDown
          useNativeDriver
          enablePreload={true}
          loadingRender={() => <ActivityIndicator />}
          imageUrls={imageURLs}
          index={initialPhotoIndex}
          onCancel={() => hideImageViewer()}
          onSwipeDown={() => hideImageViewer()}
          renderFooter={renderImageViewerFooter}
          footerContainerStyle={styles.imageViewFooterMainContainer}
        />
      </Modal>
    </>
  );
};
