import { StyleSheet, Platform, Dimensions } from "react-native";
import { animtionValue } from "../../services/data";
import fonts from "../../theme/fonts";

const { HEADER_MAX_HEIGHT } = animtionValue(false);
const { width } = Dimensions.get("window");
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  cardStyle: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
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
  facilityImage: {
    width: "100%",
    height: width * 0.5,
    borderRadius: 10,
  },
  facilityImageOverlay: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  facilityTitle: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 21,
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
  },
  facilityPublished: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 17,
    fontFamily: fonts.Medium_Font,
    textTransform: "uppercase",
    marginTop: 5,
  },
  readMoreBtn: (color) => ({
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-end",
    backgroundColor: color || "#5086A7",
  }),
  readMoreBtnTxt: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 15,
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
  },
  mediaDescription: {
    marginTop: 5,
    fontFamily: fonts.Regular_Font,
    fontSize: 13,
    lineHeight: 15,
    color: "#7E7E7E",
  },
  venueTypeCardStyle: (color) => ({
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: color || "#062D5B",
  }),
  venueTypeIcon: {
    height: 70,
    width: 60,
  },
  venueTypeText: {
    fontSize: 18,
    lineHeight: 21,
    color: "#ffffff",
    letterSpacing: 1,
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
  },
  venueContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  venueImage: {
    height: 60,
    width: 60,
    marginRight: 10,
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
  venueDataContainer: {
    flex: 1,
    paddingRight: 10,
    paddingVertical: 10,
  },
  venueName: (color) => ({
    color: color || "#062D5B",
    fontSize: 18,
    lineHeight: 21,
    fontFamily: fonts.Bold_Font,
  }),
  venueSubText: (color) => ({
    color: color || "#062D5B",
    fontSize: 11,
    lineHeight: 13,
    fontFamily: fonts.Bold_Font,
  }),
  venueDetailScrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  venueDetailImage: {
    height: HEADER_MAX_HEIGHT,
    width: '100%',
  },
  venueDetailImageContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  venueDetailName: {
    fontFamily: fonts.Bold_Font,
    fontSize: 18,
    lineHeight: 21,
    color: "#fff",
    textTransform: "uppercase",
    marginBottom: 5,
    letterSpacing: 1,
  },
  venueDetailDescription: {
    marginTop: 15,
    fontFamily: fonts.Regular_Font,
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 1,
    color: "#7E7E7E",
  },
  seprator: {
    borderBottomWidth: 1,
    borderBottomColor: "#D1D1D1",
    marginVertical: 20,
    marginHorizontal: 15,
  },
  contactContainer: {
    paddingHorizontal: 15,
  },
  lblStyle: (color) => ({
    textTransform: "uppercase",
    fontFamily: fonts.Bold_Font,
    color: color || "#062D5B",
    marginBottom: 7,
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 1,
  }),
  contactPerson: {
    fontFamily: fonts.Regular_Font,
    color: "#000",
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 1,
    marginBottom: 7,
  },
  contactPersonNo: {
    fontSize: 14,
    color: "#000",
    lineHeight: 16,
    letterSpacing: 1,
    alignSelf: "flex-start",
    fontFamily: fonts.Regular_Font,
  },
  contactPersonNo2: (color) => ({
    fontFamily: fonts.Bold_Font,
    color: color || "#7E7E7E",
    fontSize: 15,
  }),
  openMapBtn: (backgroundColor) => ({
    backgroundColor,
    borderRadius: 3,
    marginTop: 2,
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  }),
  openMapBtnTxt: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 15,
    letterSpacing: 1,
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
  },
  iconStyle: (color) => ({
    height: 15,
    width: 15,
    tintColor: color || "#062D5B",
  }),
  downloadBtn: (backgroundColor) => ({
    backgroundColor,
    marginTop: 2,
    borderRadius: 3,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    justifyContent: "center",
  }),
});
