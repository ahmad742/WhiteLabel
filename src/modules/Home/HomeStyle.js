import { StyleSheet, Platform } from "react-native";

import fonts from "../../theme/fonts";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title1: (color) => ({
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 10,
    color: color || '#062D5B',
    fontSize: 18,
    fontFamily: fonts.Bold_Font,
  }),
  title2: (color) => ({
    marginVertical: 20,
    color: color || '#062D5B',
    fontSize: 16,
    fontFamily: fonts.Bold_Font,
    alignSelf: 'center',
  }),
  eventRectangleButtonContainer: {
    borderRadius: 10,
    height: 150,
    marginHorizontal: 15,
    marginBottom: 15,
    overflow: "hidden",
  },
  eventRectangleButton: {
    padding: 10,
    zIndex: 10,
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  eventRectangleButtonText: {
    fontSize: 18,
    lineHeight: 21,
    color: "#fff",
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
  },
  featuredEventImage: {
    height: 180,
    width: '100%',
    borderRadius: 10,
    overflow: "hidden",
  },
  featuredEventContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  leagueName: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 21,
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
  },
  leagueDate: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 17,
    fontFamily: fonts.Regular_Font,
    textTransform: "uppercase",
  },
  gameBadge: {
    marginTop: 5,
    borderRadius: 3,
    paddingVertical: 4,
    paddingHorizontal: 5,
    alignSelf: "flex-start",
    backgroundColor: "rgba(196, 196, 196, 0.7)",
  },
  gameName: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fonts.Bold_Font,
  },
  featuredEventBottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  readMoreBtn: (color) => ({
    borderRadius: 4,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: color || "#5086A7",
  }),
  readMoreBtnTxt: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 15,
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
  },
  sportImg: {
    height: 38,
    width: 38,
  },
  eventImg: {
    height: 70,
    width: 70,
    alignSelf: "flex-end",
  },
  eventSquareButtonContainer: {
    borderRadius: 10,
    height: 150,
    width: "48%",
    marginBottom: 10,
    overflow: "hidden",
  },
  eventSquareButton: {
    padding: 10,
    zIndex: 10,
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
  },
  eventSquareButtonText: {
    fontSize: 14,
    lineHeight: 16,
    color: "#fff",
    fontFamily: fonts.Bold_Font,
    textTransform: "uppercase",
  },
  eventsWrapper: {
    flexWrap: "wrap",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  eventBGImage: {
    height: "200%",
    width: "400%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
  eventRectangleBGImage: {
    height: "100%",
    width: "100%",
  },
  notificationBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
  },
  listSeprator: {
    height: 1,
    marginVertical: 15,
    backgroundColor: "#D1D1D1",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  listEventImageContainer: {
    height: 56,
    width: 60,
    overflow: "visible",
    borderRadius: 5,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  listEventImageSubContainer: {
    borderRadius: 5,
    overflow: "hidden",
  },
  listEventImage: {
    height: "100%",
    width: "100%",
  },
  sportBadge: (color) => ({
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    alignSelf: "flex-start",
    backgroundColor: color || "#5086A7",
  }),
  sportName: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fonts.Bold_Font,
  },
  bookmarkBtn: {
    position: "absolute",
    top: 0,
    right: -7,
  },
  eventDetailsContainer: {
    flex: 0.95,
    paddingHorizontal: 15,
  },
  buttonText: (color) => ({
    fontSize: 18,
    color: color || "#062D5B",
    lineHeight: 21,
    fontFamily: fonts.Bold_Font,
    marginBottom: 10,
    marginTop: 2,
  }),
  eventListContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 25,
    paddingBottom: 20,
  },
  searchContainer: {
    marginHorizontal: 30
  },
  titleStyle: (color) => ({
    marginTop: 40,
    marginBottom: 10,
    color: color || '#062D5B',
    fontSize: 18,
    lineHeight: 21,
    fontFamily: fonts.Bold_Font,
    marginHorizontal: 15,
    textTransform: "uppercase"
  }),
  hostView: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 20,
  }
});
