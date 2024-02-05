import React from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';

import { navigateTo } from "../context/NavigationContext";
import fonts from '../theme/fonts';

const NavLink = (props) => {
  const { text = "", containerStyle = {}, routeName = "" } = props;
  return (
    <View style={containerStyle}>
      <Pressable onPress={() => navigateTo(routeName)}>
        <Text style={styles.signInStyle}>{text}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({

  signInStyle: {
    fontSize: 14,
    lineHeight: 16,
    color: '#7E7E7E',
    fontFamily: fonts.Regular_Font,
  },

});

export default NavLink;
