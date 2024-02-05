import { StyleSheet } from "react-native";
import { animtionValue } from "../../services/data";
import fonts from "../../theme/fonts";

const { HEADER_MAX_HEIGHT } = animtionValue(false);

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
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
  mediaCaption: (color) => ({
    marginTop: 5,
    fontFamily: fonts.Bold_Font,
    fontSize: 15,
    lineHeight: 17,
    color: color || "#7E7E7E",
    letterSpacing: 1,
  }),
  newsDetailScrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  newsDetailImage: {
    height: HEADER_MAX_HEIGHT,
    width: '100%',
  },
  newsDetailImageContainer: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  newsDetailName: {
    fontFamily: fonts.Bold_Font,
    fontSize: 18,
    lineHeight: 21,
    color: "#fff",
    textTransform: "uppercase",
    marginBottom: 5,
    letterSpacing: 1,
  },
  newsDetailsPublishedDate: {
    fontFamily: fonts.Regular_Font,
    fontSize: 17,
    lineHeight: 21,
    color: "#fff",
    letterSpacing: 1,
  },
  newsDetailDescription: {
    marginTop: 15,
    fontFamily: fonts.Regular_Font,
    fontSize: 14,
    lineHeight: 15,
    color: "#7E7E7E",
  },
});
