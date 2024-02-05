import { StyleSheet } from "react-native";
import { moderateScale } from "../../styles/utils/utils";

import fonts from "../../theme/fonts";

export default StyleSheet.create({
  performersContainer: {
    flex: 1, margin: 5, alignItems: 'center',
  },
  performersListContainer: {
    flex: 1, margin: 5,
  },
  performersListDataContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: moderateScale(10),
    borderRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
    alignSelf: 'center',
    margin: 5,
    marginHorizontal: -10,
  },
  performersDataContainer: (width) => ({
    flex: 1,
    width: width - 100,
    marginVertical: 5,
    backgroundColor: 'white',
    padding: moderateScale(10),
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
    alignSelf: 'center',
  }),
  performersImage: (width, height, margin) => ({
    width: width, height: height, borderRadius: 100, overflow: 'hidden', margin: margin, alignSelf: 'center',
  }),
  performersName: (color) => ({
    fontSize: 18, alignSelf: 'center', padding: moderateScale(5), fontFamily: fonts.Bold_Font, color,
  }),
  performersDes: {
    fontSize: 13, color: '#7E7E7E', alignSelf: 'center', padding: moderateScale(10),
  },
  performersStar: {
    position: 'absolute', top: 0, right: 0, margin: moderateScale(10),
  },
  readMoreButtonStyle: (color) => ({
    backgroundColor: color || "#5086A7",
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    margin: moderateScale(10),
    borderRadius: 4,
  }),
  readMoreButtonTextStyle: {
    color: '#FFFFFF',
    fontFamily: fonts.Regular_Font,
    textAlign: 'center',
    fontSize: moderateScale(12),
    lineHeight: moderateScale(15),
    textTransform: 'uppercase',
  },
  eventDetailsContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  buttonText: (color) => ({
    fontSize: 18,
    color: color || "#062D5B",
    fontFamily: fonts.Bold_Font,
    marginBottom: 10,
    marginTop: 2,
  }),
  readMoreButtonListStyle: (color) => ({
    backgroundColor: color || "#5086A7",
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  }),
});
