import React from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

import { useCustomer } from "../context/CustomerContext";
import { goBack } from "../context/NavigationContext";
import fonts from "../theme/fonts";

const bannerUnitId='ca-app-pub-3811772596085899/4147481225';
const HeaderComponent = (props) => {
  const {
    headerRight = null,
    title = "",
    showLeft = true,
    isAdBanner = false,
  } = props;

  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;

  return (
    <SafeAreaView style={styles.mainHeaderContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeftView}>
          {showLeft ? (
            <Pressable onPress={() => goBack()}>
              <AntDesign
                color={primary1 || "#062D5B"}
                size={25}
                name="arrowleft"
              />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.headerCenterView}>
          <Text style={styles.headerText(primary1)}>{title}</Text>
        </View>
        <View style={styles.headerRightView}>
          {headerRight ? headerRight() : null}
        </View>
      </View>
      {isAdBanner && (
        <View style={{ backgroundColor: "#fff", alignItems:'center' }}>
          <BannerAd
            unitId={TestIds.BANNER}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainHeaderContainer: {
    zIndex: 100,
    backgroundColor: "#fff",
  },
  headerContainer: {
    paddingLeft: 10,
    paddingBottom: 15,
    paddingTop: Platform.OS === "ios" ? 10 : 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D1D1",
    justifyContent: "space-between",
  },
  headerLeftView: {
    flex: 0.2,
  },
  headerCenterView: {
    flex: 0.8,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRightView: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerText: (color) => ({
    textAlign: "center",
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
    color: color || "#062D5B",
    fontSize: Platform.OS === "ios" ? 18 : 20,
    lineHeight: Platform.OS === "ios" ? 21 : 22,
  }),
});

export default HeaderComponent;
