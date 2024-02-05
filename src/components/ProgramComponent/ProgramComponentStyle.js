import { StyleSheet } from "react-native";

import fonts from "../../theme/fonts";

export default StyleSheet.create({
  programContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  programDataContainer: {
    flex: 1,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#D1D1D1",
    justifyContent: "space-between",
  },
  programName: (color) => ({
    fontFamily: fonts.Bold_Font,
    fontSize: 15,
    lineHeight: 17,
    color: color || "#5086A7",
    letterSpacing: 1,
    marginBottom: 5,
  }),
  teamName: (color) => ({
    fontFamily: fonts.Medium_Font,
    fontSize: 11,
    lineHeight: 17,
    color: color || "#5086A7",
    marginBottom: 5,
  }),
  teamScore: (color) => ({
    fontFamily: fonts.Bold_Font,
    fontSize: 13,
    color: color || "#5086A7",
  }),
  programTime: {
    fontFamily: fonts.Regular_Font,
    fontSize: 12,
    lineHeight: 17,
    color: "#7E7E7E",
    letterSpacing: 1,
  },
  programVenue: (color) => ({
    fontFamily: fonts.Regular_Font,
    fontSize: 12,
    lineHeight: 15,
    color: color || "#5086A7",
    marginTop: 5,
  }),
  leftContainer: {
    paddingRight: 20,
    paddingLeft: 5,
  },
  incompleteDot: (color) => ({
    position: "absolute",
    left: 1,
    width: 10,
    height: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: color || "#5086A7",
    backgroundColor: "#fff",
  }),
  completeDot: (color) => ({
    backgroundColor: color || "#5086A7",
  }),
  lineStyle: {
    width: 1,
    position: "relative",
    backgroundColor: "#E5E5E5",
  },
  iconStyle: (color) => ({
    height: 25,
    width: 25,
    tintColor: color || "#232122",
  }),
  teamLogo: {
    height: 45,
    width: '90%',
  },
  fixtureNo: {
    fontFamily: fonts.Regular_Font,
    fontSize: 10,
    color: "#7E7E7E",
    marginBottom: 2
  },
  matchStage: (color) => ({
    fontFamily: fonts.Regular_Font,
    fontSize: 10,
    color: color || "#5086A7",
    marginTop: 5,
    alignSelf: 'center'

  }),
  refrees: {
    fontFamily: fonts.Regular_Font,
    fontSize: 12,
    lineHeight: 15,
    color: "#7E7E7E",
    marginTop: 8,
    alignSelf: 'center'
  },
});