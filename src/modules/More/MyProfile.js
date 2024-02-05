import React, { useEffect, useState, Fragment } from "react";
import {
  View,
  Text,
  Platform,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import isEmpty from "lodash/isEmpty";
import Modal from "react-native-modal";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import HeaderComponent from "../../components/HeaderComponent";
import GradientButton from "../../components/GradientButton";
import EmptyView from "../../components/EmptyView";

import * as NavActions from "../../context/NavigationContext";
import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import APIs from "../../services/api";
import styles from "./MoreStyle";

const MyProfile = () => {
  const { currentCustomer = {} } = useCustomer();
  const {
    login_type,
    primary1 = "#1F376A",
    primary2 = "#1183C7",
    delete_reasons = {},
  } = currentCustomer;
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [cellphone, setCellPhone] = useState('');
  const [topPadding, setTopPadding] = useState(0);
  const [idPassport, setIdPassport] = useState('');
  const [hasId, setHasId] = useState(false);
  const [isParentMember, setIsPrentMember] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [userData, setUserData] = useState({});
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { getProfile(); }, []);

  const getProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      const response = await APIs.getUserProfile({ user_id: userId });
      const uData = response?.data ?? {};
      setUserData(uData);
      setName(uData?.name ?? "");
      setSurname(uData?.surname ?? "");
      setEmail(uData?.email ?? "");
      setCellPhone(uData?.cellphone ?? "");
      setIdPassport(uData?.id_passport ?? "");
      setHasId(!!uData?.no_id);
      setIsPrentMember(uData?.parent_member);
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Error", errorMessage.trim(), {
        type: "danger",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const addReason = () => {
    setShowReasonModal(true);
  };

  const hideModal = () => {
    setShowReasonModal(false);
    setReason("");
  };

  const onDeletePress = async () => {
    try {
      setSubmitting(true);
      const userId = await AsyncStorage.getItem("@userId");
      const response = await APIs.deleteUser({ reason }, { user_id: userId });
      const { message, status } = response?.data ?? {};
      const isDeleted = status == "Success";
      hFunctions.showNotificationMessage(isDeleted ? "Success" : "Error", message, {
        type: isDeleted ? "success" : "danger",
      });
      if (isDeleted) {
        await AsyncStorage.removeItem("@userId");
        NavActions.navigateTo("LoginFlow");
      }
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("User Delition Error", errorMessage.trim(), {
        type: "danger",
      });
    } finally {
      setSubmitting(false);
      setShowReasonModal(false);
    }
  };

  const onUpdatePress = async () => {
    try {
      setIsUpdating(true);
      let uData = {
        name,
        email,
        surname,
        cellphone,
        parent_member: isParentMember,
      };
      if (login_type != 1) {
        uData.no_id = hasId;
        uData.id_passport = idPassport;
      }
      const userId = await AsyncStorage.getItem("@userId");
      const response = await APIs.updateUserProfile(uData, { user_id: userId });
      const { status, message } = response?.data ?? {};
      hFunctions.showNotificationMessage(status == "Success" ? "Success" : "Error", message, {
        type: status == "Success" ? "success" : "danger",
      });
      if (status == "Success") {
        getProfile();
      }
    } catch (error) {
      const errorMessage = hFunctions.getErrorMessage(error);
      hFunctions.showNotificationMessage("Profile Update Error", errorMessage.trim(), {
        type: "danger",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const renderView = () => {
    if (isFetching) {
      return (
        <View style={styles.emptyView}>
          <ActivityIndicator size={"large"} color={primary1} />
        </View>
      );
    } else if (!isFetching && !isEmpty(userData)) {
      return (
        <Fragment>
          <KeyboardAwareScrollView
            extraScrollHeight={20}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            enableAutomaticScroll={Platform.OS === 'ios'}
            contentContainerStyle={[styles.scrollContainer, { paddingTop: 30 + topPadding }]}
          >
            <View style={styles.inputBox}>
              <Text style={[styles.inputLabel(primary2), { marginTop: 0 }]}>Name</Text>
              <View style={styles.inputContainer}>
                <AntDesign style={styles.loginIcons(primary1)} name="user" size={30} color="white" />
                <TextInput
                  value={name}
                  autoCapitalize="none"
                  style={styles.inputs(primary2)}
                  onChangeText={(text) => setName(text)}
                />
              </View>
              <Text style={styles.inputLabel(primary2)}>Surname</Text>
              <View style={styles.inputContainer}>
                <AntDesign style={styles.loginIcons(primary1)} name="user" size={30} color="white" />
                <TextInput
                  value={surname}
                  autoCapitalize="none"
                  style={styles.inputs(primary2)}
                  onChangeText={(text) => setSurname(text)}
                />
              </View>
              <Text style={styles.inputLabel(primary2)}>Cell Phone</Text>
              <View style={styles.inputContainer}>
                <Feather style={styles.loginIcons(primary1)} name="phone" size={30} color="white" />
                <TextInput
                  value={cellphone}
                  returnKeyType="done"
                  autoCapitalize="none"
                  keyboardType="phone-pad"
                  style={styles.inputs(primary2)}
                  onChangeText={(text) => setCellPhone(text)}
                  placeholder="Please start with your country code"
                />
              </View>
              <Text style={styles.inputLabel(primary2)}>Email</Text>
              <View style={styles.inputContainer}>
                <Feather style={styles.loginIcons(primary1)} name="mail" size={30} color="white" />
                <TextInput
                  value={email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.inputs(primary2)}
                  onChangeText={(text) => setEmail(text)}
                />
              </View>
              {
                login_type != 1 ? (
                  <Fragment>
                    <Pressable
                      onPress={() => setHasId(!hasId)}
                      style={[styles.checkboxContainer, { marginTop: 30 }]}
                    >
                      <MaterialCommunityIcons
                        name={hasId ? "checkbox-marked" : "checkbox-blank-outline"}
                        color={primary1 || '#062D5B'}
                        size={30}
                      />
                      <Text style={styles.checkboxText(primary1)}>I don't have a South African ID Number</Text>
                    </Pressable>
                    <Text style={styles.inputLabel(primary2)}>{hasId ? "Passport Number" : "ID Number"}</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons style={styles.loginIcons(primary1)} name="passport" size={30} color="white" />
                      <TextInput
                        value={idPassport}
                        autoCapitalize="none"
                        style={styles.inputs(primary2)}
                        onChangeText={(text) => setIdPassport(text)}
                      />
                    </View>
                  </Fragment>
                ) : null
              }
              <Pressable
                onPress={() => setIsPrentMember(!isParentMember)}
                style={[styles.checkboxContainer, { marginTop: 20 }]}
              >
                <MaterialCommunityIcons
                  name={isParentMember ? "checkbox-marked" : "checkbox-blank-outline"}
                  color={primary1 || '#062D5B'}
                  size={30}
                />
                <Text style={styles.checkboxText(primary1)}>I'm a parent of participating students</Text>
              </Pressable>
              <GradientButton
                text={"Update"}
                onPress={onUpdatePress}
                showLoading={isUpdating}
                gradientContainer={{ marginTop: 30, marginBottom: 15 }}
              />
            </View>
            <Pressable
              onPress={addReason}
              style={[styles.deleteButton, { marginTop: 20 }]}
            >
              <SimpleLineIcons
                name={"trash"}
                color={primary1}
                size={25}
              />
              <Text style={styles.deleteBtnTxt(primary1)}>Delete Account</Text>
            </Pressable>
          </KeyboardAwareScrollView>
          <View
            style={styles.nameContainer(primary1)}
            onLayout={(e) => setTopPadding(e.nativeEvent.layout.height)}
          >
            <View>
              <Text style={styles.nameText}>{`${userData?.name} ${userData?.surname}`}</Text>
              {
                isParentMember ? (
                  <View style={styles.parentView}>
                    <Text style={styles.parentTxt}>Parent</Text>
                  </View>
                ) : null
              }
            </View>
            <View style={styles.triangle(primary1)} />
          </View>
        </Fragment>
      );
    } else {
      return (
        <EmptyView message="Profile not found" />
      );
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponent title="My Profile" />
      <View style={{ flex: 1 }}>
        {renderView()}
      </View>
      <Modal
        avoidKeyboard
        useNativeDriver
        animationIn={"slideInUp"}
        animationOutTiming={1000}
        isVisible={showReasonModal}
        onBackdropPress={hideModal}
        animationOut={"slideOutDown"}
        onBackButtonPress={hideModal}
        style={styles.modalContainer}
      >
        <View style={styles.modalDataContainer}>
          <Text style={styles.deleteModalTitle(primary2)}>Delete Reason</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {
              Object.entries(delete_reasons).map(([key = "", value = ""]) => {
                const isSelected = key === reason;
                return (
                  <Pressable style={styles.selectBtn} onPress={() => setReason(key)} key={key}>
                    <MaterialCommunityIcons
                      size={25}
                      color={isSelected ? primary1 : primary2}
                      name={isSelected ? "radiobox-marked" : "radiobox-blank"}
                    />
                    <Text style={styles.reasonTxt(isSelected ? primary1 : primary2)}>{value}</Text>
                  </Pressable>
                );
              })
            }
          </ScrollView>
          <View style={styles.modalButtonContainer}>
            <Pressable
              onPress={hideModal}
              disabled={submitting}
              style={styles.clearBtn}
            >
              <Text style={styles.clearBtnTxt}>Cancel</Text>
            </Pressable>
            <Pressable
              disabled={submitting}
              onPress={() => onDeletePress()}
              style={styles.submitBtn(primary1)}
            >
              {
                submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitBtnTxt}>Submit</Text>
                )
              }
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyProfile;
