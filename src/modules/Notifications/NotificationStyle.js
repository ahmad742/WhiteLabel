import { Dimensions, Platform, StyleSheet } from "react-native";
import fonts from "../../theme/fonts";

const { height, width } = Dimensions.get("screen");
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 15,
    paddingBottom: 30,
    paddingHorizontal: 15,
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notificationIconContainer: (backgroundColor) => ({
    padding: 10,
    backgroundColor,
    borderRadius: 5,
  }),
  listSeprator: {
    marginVertical: 10,
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  notificationTextContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  notificationTitle: (color) => ({
    color,
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.Bold_Font,
  }),
  notificationDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#7E7E7E",
    fontFamily: fonts.Regular_Font,
  },
  modalBlurContainer: {
    height,
    width,
    position: "absolute",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalDataContainer: {
    overflow: "hidden",
    paddingVertical: 25,
    paddingHorizontal: 20,
    width: width * 0.85,
    maxHeight: height * 0.8,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        backgroundColor: "#f1f1f1",
        shadowColor: '#000000',
        shadowOffset: {
          width: 5,
          height: 10,
        },
        shadowOpacity: 0.45,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
        backgroundColor: "#FFFFFF",
      },
      default: {
        backgroundColor: "#FFFFFF",
      },
    }),
  },
  notificationModalTitle: (color) => ({
    color,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fonts.Bold_Font,
    marginBottom: 10,
  }),
  notificationModalDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 1,
    color: "#7E7E7E",
    marginBottom: 10,
    fontFamily: fonts.Regular_Font,
  },
  notificationModalImage: {
    width: '100%',
    borderRadius:6,
    marginBottom: 10,
  },
  notificationModalBtn: (backgroundColor) => ({
    alignSelf: "center",
    width: "70%",
    marginTop: 10,
    backgroundColor,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  }),
  notificationModalBtnTxt: {
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
    color: "#ffffff",
    fontSize: 16,
  },
  overlayLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
});
